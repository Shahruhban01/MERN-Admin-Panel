const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Page = require('../models/Page');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/checkPermission');
const { logActivity } = require('../utils/logActivity');

// @route   GET /api/pages
// @desc    Get all pages
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, search = '', sidebarOnly } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { slug: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    if (sidebarOnly === 'true') {
      filter['sidebar.enabled'] = true;
      filter.status = 'published';
    }

    const pages = await Page.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ 'sidebar.position': 1, 'sidebar.order': 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { pages }
    });
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/pages/slug/:slug
// @desc    Get page by slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ 
      slug: req.params.slug,
      status: 'published'
    }).populate('createdBy', 'name email');

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { page }
    });
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/pages/:id
// @desc    Get page by ID
// @access  Private
router.get('/:id', protect, checkPermission('pages', 'view'), async (req, res) => {
  try {
    const page = await Page.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { page }
    });
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/pages
// @desc    Create new page
// @access  Private
router.post(
  '/',
  protect,
  checkPermission('pages', 'create'),
  [
    body('title').notEmpty().trim().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const {
        title,
        slug,
        description,
        content,
        contentType,
        template,
        icon,
        sidebar,
        permissions,
        seo,
        status
      } = req.body;

      // Check if slug already exists
      if (slug) {
        const existingPage = await Page.findOne({ slug });
        if (existingPage) {
          return res.status(400).json({
            success: false,
            message: 'A page with this slug already exists'
          });
        }
      }

      const page = await Page.create({
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        content,
        contentType,
        template,
        icon,
        sidebar,
        permissions,
        seo,
        status,
        createdBy: req.admin._id
      });

      await logActivity(
        req.admin._id,
        'page_create',
        `Created page: ${title}`,
        { pageId: page._id },
        req
      );

      res.status(201).json({
        success: true,
        message: 'Page created successfully',
        data: { page }
      });
    } catch (error) {
      console.error('Create page error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server error'
      });
    }
  }
);

// @route   PUT /api/pages/:id
// @desc    Update page
// @access  Private
router.put('/:id', protect, checkPermission('pages', 'edit'), async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    const {
      title,
      slug,
      description,
      content,
      contentType,
      template,
      icon,
      sidebar,
      permissions,
      seo,
      status
    } = req.body;

    // Check if new slug conflicts
    if (slug && slug !== page.slug) {
      const existingPage = await Page.findOne({ slug });
      if (existingPage) {
        return res.status(400).json({
          success: false,
          message: 'A page with this slug already exists'
        });
      }
    }

    // Update fields
    if (title) page.title = title;
    if (slug) page.slug = slug;
    if (description !== undefined) page.description = description;
    if (content) page.content = content;
    if (contentType) page.contentType = contentType;
    if (template) page.template = template;
    if (icon !== undefined) page.icon = icon;
    if (sidebar) page.sidebar = { ...page.sidebar, ...sidebar };
    if (permissions) page.permissions = permissions;
    if (seo) page.seo = { ...page.seo, ...seo };
    if (status) page.status = status;
    page.updatedBy = req.admin._id;

    await page.save();

    await logActivity(
      req.admin._id,
      'page_update',
      `Updated page: ${page.title}`,
      { pageId: page._id },
      req
    );

    res.status(200).json({
      success: true,
      message: 'Page updated successfully',
      data: { page }
    });
  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/pages/:id
// @desc    Delete page
// @access  Private
router.delete('/:id', protect, checkPermission('pages', 'delete'), async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    await page.deleteOne();

    await logActivity(
      req.admin._id,
      'page_delete',
      `Deleted page: ${page.title}`,
      { pageId: page._id },
      req
    );

    res.status(200).json({
      success: true,
      message: 'Page deleted successfully'
    });
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/pages/:id/reorder
// @desc    Update page sidebar order
// @access  Private
router.put('/:id/reorder', protect, checkPermission('pages', 'edit'), async (req, res) => {
  try {
    const { order, position } = req.body;

    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    if (order !== undefined) page.sidebar.order = order;
    if (position) page.sidebar.position = position;
    page.updatedBy = req.admin._id;

    await page.save();

    res.status(200).json({
      success: true,
      message: 'Page order updated',
      data: { page }
    });
  } catch (error) {
    console.error('Reorder page error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
