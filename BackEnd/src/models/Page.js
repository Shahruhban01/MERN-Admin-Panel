const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: String,
  content: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    enum: ['html', 'markdown', 'json'],
    default: 'html'
  },
  template: {
    type: String,
    enum: ['default', 'dashboard', 'fullwidth', 'sidebar', 'blank'],
    default: 'default'
  },
  icon: String,
  sidebar: {
    enabled: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      enum: ['top', 'main', 'bottom', 'hidden'],
      default: 'main'
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page',
      default: null
    },
    order: {
      type: Number,
      default: 0
    }
  },
  permissions: {
    view: [String],
    edit: [String]
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Create URL-friendly slug before saving
pageSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for faster queries
pageSchema.index({ slug: 1, status: 1 });
pageSchema.index({ 'sidebar.position': 1, 'sidebar.order': 1 });

module.exports = mongoose.model('Page', pageSchema);
