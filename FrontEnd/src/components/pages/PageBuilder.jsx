import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PermissionRoute from '../PermissionRoute';
import api from '../../services/api';
import '../../assets/css/components/pages/PageBuilder.css';

function PageBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    contentType: 'html',
    template: 'default',
    icon: '',
    sidebar: {
      enabled: true,
      position: 'main',
      order: 0
    },
    status: 'draft',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadPage();
    }
  }, [id]);

  const loadPage = async () => {
    try {
      const response = await api.get(`/pages/${id}`);
      setFormData(response.data.data.page);
    } catch (error) {
      showMessage('error', 'Failed to load page');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData({ ...formData, slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (isEditMode) {
        await api.put(`/pages/${id}`, formData);
        showMessage('success', 'Page updated successfully');
      } else {
        await api.post('/pages', formData);
        showMessage('success', 'Page created successfully');
      }

      setTimeout(() => navigate('/pages'), 1500);
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to save page');
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const keyword = e.target.value.trim();
      if (!formData.seo.keywords.includes(keyword)) {
        setFormData({
          ...formData,
          seo: {
            ...formData.seo,
            keywords: [...formData.seo.keywords, keyword]
          }
        });
        e.target.value = '';
      }
    }
  };

  const removeKeyword = (keyword) => {
    setFormData({
      ...formData,
      seo: {
        ...formData.seo,
        keywords: formData.seo.keywords.filter(k => k !== keyword)
      }
    });
  };

  return (
    <PermissionRoute module="pages" action={isEditMode ? 'edit' : 'create'}>
      <div className="page-builder">
        <div className="builder-header">
          <div className="header-content">
            <button onClick={() => navigate('/pages')} className="btn-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div>
              <h1>{isEditMode ? 'Edit Page' : 'Create New Page'}</h1>
              <p>Design and publish custom pages</p>
            </div>
          </div>
          <div className="builder-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {previewMode ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>

        {message.text && (
          <div className={`notification notification-${message.type}`}>
            <span>{message.text}</span>
          </div>
        )}

        {previewMode ? (
          <div className="preview-container">
            <div className="preview-header">
              <h2>Preview Mode</h2>
              <button onClick={() => setPreviewMode(false)} className="btn-secondary">
                Exit Preview
              </button>
            </div>
            <div className={`preview-content template-${formData.template}`}>
              <h1>{formData.title}</h1>
              {formData.contentType === 'html' ? (
                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
              ) : (
                <pre>{formData.content}</pre>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="builder-form">
            <div className="form-layout">
              {/* Main Content Area */}
              <div className="main-section">
                <div className="form-section">
                  <h2>Page Content</h2>
                  
                  <div className="form-group">
                    <label htmlFor="title">Page Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter page title"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="slug">URL Slug *</label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="slug"
                          name="slug"
                          value={formData.slug}
                          onChange={handleChange}
                          placeholder="page-url-slug"
                          required
                        />
                        <button
                          type="button"
                          onClick={generateSlug}
                          className="btn-generate"
                          title="Generate from title"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                          </svg>
                        </button>
                      </div>
                      <small className="form-hint">URL: /page/{formData.slug}</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="icon">Icon (Emoji)</label>
                      <input
                        type="text"
                        id="icon"
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        placeholder="📄"
                        maxLength="2"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Brief description of the page"
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contentType">Content Type</label>
                      <select
                        id="contentType"
                        name="contentType"
                        value={formData.contentType}
                        onChange={handleChange}
                      >
                        <option value="html">HTML</option>
                        <option value="markdown">Markdown</option>
                        <option value="json">JSON</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="template">Template</label>
                      <select
                        id="template"
                        name="template"
                        value={formData.template}
                        onChange={handleChange}
                      >
                        <option value="default">Default</option>
                        <option value="dashboard">Dashboard</option>
                        <option value="fullwidth">Full Width</option>
                        <option value="sidebar">With Sidebar</option>
                        <option value="blank">Blank</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="content">Page Content *</label>
                    <div className="editor-toolbar">
                      <button type="button" className="toolbar-btn" title="Bold">
                        <strong>B</strong>
                      </button>
                      <button type="button" className="toolbar-btn" title="Italic">
                        <em>I</em>
                      </button>
                      <button type="button" className="toolbar-btn" title="Heading">
                        H
                      </button>
                      <button type="button" className="toolbar-btn" title="Link">
                        🔗
                      </button>
                    </div>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows="15"
                      className="code-editor"
                      placeholder={
                        formData.contentType === 'html'
                          ? '<h1>Welcome to my page</h1>\n<p>Start creating...</p>'
                          : formData.contentType === 'markdown'
                          ? '# Welcome\n\nStart writing in **Markdown**...'
                          : '{\n  "title": "My Content"\n}'
                      }
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Sidebar Settings */}
              <div className="sidebar-section">
                <div className="form-section sticky">
                  <h2>Publish Settings</h2>
                  
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <hr />

                  <h3>Sidebar Navigation</h3>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="sidebar.enabled"
                      checked={formData.sidebar.enabled}
                      onChange={handleChange}
                    />
                    <span>Show in Sidebar Menu</span>
                  </label>

                  {formData.sidebar.enabled && (
                    <>
                      <div className="form-group">
                        <label htmlFor="sidebar.position">Menu Position</label>
                        <select
                          id="sidebar.position"
                          name="sidebar.position"
                          value={formData.sidebar.position}
                          onChange={handleChange}
                        >
                          <option value="top">📌 Top Section</option>
                          <option value="main">📋 Main Section</option>
                          <option value="bottom">⬇️ Bottom Section</option>
                          <option value="hidden">🔒 Hidden</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="sidebar.order">Display Order</label>
                        <input
                          type="number"
                          id="sidebar.order"
                          name="sidebar.order"
                          value={formData.sidebar.order}
                          onChange={handleChange}
                          min="0"
                          placeholder="0"
                        />
                        <small className="form-hint">Lower numbers appear first</small>
                      </div>
                    </>
                  )}

                  <hr />

                  <h3>SEO Settings</h3>
                  
                  <div className="form-group">
                    <label htmlFor="seo.metaTitle">Meta Title</label>
                    <input
                      type="text"
                      id="seo.metaTitle"
                      name="seo.metaTitle"
                      value={formData.seo.metaTitle}
                      onChange={handleChange}
                      placeholder="SEO title"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="seo.metaDescription">Meta Description</label>
                    <textarea
                      id="seo.metaDescription"
                      name="seo.metaDescription"
                      value={formData.seo.metaDescription}
                      onChange={handleChange}
                      rows="3"
                      placeholder="SEO description"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Keywords</label>
                    <input
                      type="text"
                      placeholder="Type and press Enter"
                      onKeyDown={handleKeywordAdd}
                    />
                    <div className="keywords-list">
                      {formData.seo.keywords.map((keyword, index) => (
                        <span key={index} className="keyword-tag">
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/pages')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Page' : 'Create Page'}
              </button>
            </div>
          </form>
        )}
      </div>
    </PermissionRoute>
  );
}

export default PageBuilder;
