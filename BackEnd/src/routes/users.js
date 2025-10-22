const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/checkPermission');
const { logActivity } = require('../utils/logActivity');

// ✅ Get all users
router.get('/', protect, checkPermission('users', 'view'), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { users } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Create user
router.post(
  '/',
  protect,
  checkPermission('users', 'create'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be 6+ chars long')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, password, isActive } = req.body;

      const exists = await User.findOne({ email });
      if (exists)
        return res
          .status(400)
          .json({ success: false, message: 'Email already exists' });

      const user = await User.create({ name, email, password, isActive });
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user }
      });
      await logActivity(req.admin._id, 'create', `Created new user: ${user.name}`, { id: user._id }, req);

    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// ✅ Update user
router.put('/:id', protect, checkPermission('users', 'edit'), async (req, res) => {
  try {
    const { name, email, isActive } = req.body;
    const updates = { name, email, isActive };
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
    // await logActivity(req.admin._id, 'create', `Created new user: ${user.name}`, { id: user._id }, req);
    await logActivity(req.admin._id, 'update', `Updated user: ${user.name}`, { id: user._id }, req);

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Delete user
router.delete('/:id', protect, checkPermission('users', 'delete'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
    await logActivity(req.admin._id, 'delete', `Deleted user: ${user.name}`, { id: user._id }, req);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
