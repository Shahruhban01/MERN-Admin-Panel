
***

# MERN Admin Panel - Complete Enterprise Management System

## 📋 Project Overview

A **production-ready MERN Stack Admin Panel** with comprehensive **Role-Based Access Control (RBAC)**, **Dynamic Data Management**, **Custom Page Builder**, and **Activity Logging** system, featuring a modern responsive UI and enterprise-grade security.

***

## ✨ Core Features

### 🔐 Authentication & Security
- **JWT-based authentication** with secure token management
- **Password hashing** using bcrypt (12 rounds)
- **Protected routes** on both frontend and backend
- **Automatic token refresh** and session management
- **Login/Register** functionality with validation
- **Password strength enforcement**
- **Account lockout** after failed attempts (ready)

### 👥 Advanced Role-Based Access Control (RBAC)
- **Dynamic role creation** and management
- **Granular permission system** with 11+ modules:
  - Dashboard (view, edit)
  - Users (view, create, edit, delete)
  - Products (view, create, edit, delete)
  - Orders (view, create, edit, delete)
  - Analytics (view)
  - Roles (view, create, edit, delete)
  - Admins (view, create, edit, delete)
  - Settings (view, edit)
  - Activity Logs (view)
  - Data Models (view, create, edit, delete)
  - Pages (view, create, edit, delete)
- **Super Admin role** with unrestricted access
- **Custom roles** with flexible permission combinations
- **Permission inheritance** and real-time validation
- **Role assignment** to admins with instant UI updates

### 🗄️ Dynamic Data Model Manager (No-Code CMS)
- **Visual model builder** - Create database collections without coding
- **Field type support**:
  - String, Text, Number, Boolean
  - Date, Email, URL
  - Select (dropdown), Multi-select
  - Image, File uploads
  - JSON data
  - Relations between models
- **Auto-generated CRUD APIs** for each model
- **Dynamic frontend pages** created automatically
- **Validation rules** per field (required, unique, min/max, patterns)
- **Search and pagination** built-in
- **Model reordering** and organization
- **Soft delete** option per model
- **Timestamps** toggle (createdAt, updatedAt)

### 📄 Custom Page Builder (No-Code)
- **Visual page editor** with live preview
- **Content types**:
  - HTML editor
  - Markdown support
  - JSON data
- **Template system**:
  - Default layout
  - Dashboard style
  - Full-width design
  - Sidebar layout
  - Blank canvas
- **Dynamic sidebar integration**:
  - Auto-adds page links to menu
  - Position control (top, main, bottom sections)
  - Custom ordering
  - Icon/emoji support
- **SEO optimization**:
  - Meta titles and descriptions
  - Keywords management
  - Custom URL slugs
- **Draft/Published workflow**
- **Permission-based page access**

### 📊 Activity Logging & Audit Trail
- **Comprehensive activity tracking**:
  - All admin logins/logouts
  - User CRUD operations
  - Role modifications
  - Permission changes
  - Settings updates
  - Data model changes
  - Page creation/edits
  - Failed login attempts
- **Detailed log entries**:
  - Admin name and role
  - Action type and description
  - IP address and device info
  - Timestamp
  - Affected resources
  - Before/after states (for edits)
- **Advanced filtering**:
  - By action type
  - By admin
  - By date range
  - Full-text search
- **Exportable logs** (CSV, JSON ready)

### ⚙️ App Settings Management
- **Dynamic configuration system**:
  - App name and branding
  - Logo URL
  - Contact information
  - Maintenance mode toggle
  - Email settings
  - API keys storage
  - Feature flags
  - Custom key-value pairs
- **API-first design** for Flutter/mobile apps
- **Real-time updates** across admin panel
- **Environment-specific** settings support

### 🎨 Frontend Features
- **React 18** with Vite for blazing-fast builds
- **React Router v6** with nested routing
- **Context API** for global state (Auth, Theme)
- **Advanced sidebar**:
  - Tree-style navigation with submenus
  - Real-time search with keyword matching
  - Auto-expand active menu
  - Collapsible sections
  - Dynamic menu from database
  - Responsive mobile drawer
- **Dark/Light theme** with smooth transitions
- **Fully responsive** design (mobile-first)
- **Permission-based rendering**:
  - Conditional page access
  - Dynamic action buttons
  - Module-level visibility
- **Rich notifications** system
- **Loading skeletons** and optimistic updates
- **Error boundaries** for fault tolerance
- **Infinite scroll** ready
- **Table virtualization** for large datasets (ready)

### 🔧 Backend Features
- **Node.js + Express.js** RESTful API
- **MongoDB** with Mongoose ODM
- **Modular architecture** with separation of concerns
- **Advanced middleware stack**:
  - JWT authentication
  - Permission validation (`checkPermission`)
  - Super admin verification (`isSuperAdmin`)
  - Multi-permission checks (`checkAnyPermission`, `checkAllPermissions`)
  - Activity logging interceptor
  - Error handling
  - Request validation
- **File upload system** with Multer
- **Input sanitization** with express-validator
- **CORS** with whitelist
- **Rate limiting** ready
- **Database indexing** for performance
- **Aggregation pipelines** for analytics
- **Transaction support** for critical operations

***

## 🏗️ Enhanced Project Structure

```
mern-admin-panel/
├── backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── multer.js                # File upload config
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   ├── checkPermission.js       # RBAC middleware
│   │   └── dynamicModelLoader.js    # Dynamic model registry
│   ├── models/
│   │   ├── Admin.js                 # Admin schema
│   │   ├── Role.js                  # Role with permissions
│   │   ├── User.js                  # User schema
│   │   ├── ActivityLog.js           # Activity tracking
│   │   ├── AppSetting.js            # App configuration
│   │   ├── DataModel.js             # Dynamic model definitions
│   │   ├── Page.js                  # Custom pages
│   │   └── dynamicModels.js         # Runtime model registry
│   ├── routes/
│   │   ├── auth.js                  # Authentication
│   │   ├── profile.js               # Profile management
│   │   ├── roles.js                 # Role CRUD
│   │   ├── admins.js                # Admin management
│   │   ├── users.js                 # User management
│   │   ├── activityLogs.js          # Activity log endpoints
│   │   ├── appSettings.js           # App settings CRUD
│   │   ├── dataModels.js            # Model manager endpoints
│   │   ├── dynamicData.js           # Dynamic CRUD routes
│   │   ├── pages.js                 # Page builder endpoints
│   │   └── analytics.js             # Analytics data
│   ├── utils/
│   │   ├── schemaGenerator.js       # Dynamic schema builder
│   │   ├── validationBuilder.js     # Field validation
│   │   └── logActivity.js           # Activity logger utility
│   ├── scripts/
│   │   ├── seedRoles.js             # Seed default roles
│   │   └── setupFirstAdmin.js       # Create super admin
│   ├── uploads/                     # File storage
│   ├── .env                         # Environment variables
│   ├── server.js                    # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── css/
│   │   │       └── components/      # Component styles
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Layout.jsx           # Main layout
│   │   │   ├── Header.jsx           # Top bar
│   │   │   ├── Sidebar.jsx          # Dynamic navigation
│   │   │   ├── MainContent.jsx      # Dashboard
│   │   │   ├── Profile.jsx          # User profile
│   │   │   ├── Settings.jsx         # System settings
│   │   │   ├── Roles.jsx            # Role management
│   │   │   ├── Admins.jsx           # Admin management
│   │   │   ├── Users.jsx            # User management
│   │   │   ├── ActivityLogs.jsx     # Activity viewer
│   │   │   ├── AppSettings.jsx      # App config
│   │   │   ├── DataModels.jsx       # Model list
│   │   │   ├── ModelBuilder.jsx     # Model editor
│   │   │   ├── FieldBuilder.jsx     # Field configurator
│   │   │   ├── DynamicCrudPage.jsx  # Auto-generated CRUD
│   │   │   ├── Pages.jsx            # Page list
│   │   │   ├── PageBuilder.jsx      # Page editor
│   │   │   ├── DynamicPageView.jsx  # Render custom pages
│   │   │   ├── ProtectedRoute.jsx   # Auth guard
│   │   │   ├── PermissionRoute.jsx  # Permission guard
│   │   │   └── PermissionGuard.jsx  # Conditional rendering
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state
│   │   │   └── ThemeContext.jsx     # Theme manager
│   │   ├── services/
│   │   │   └── api.js               # Axios instance
│   │   ├── App.jsx                  # Root component
│   │   └── main.jsx                 # Entry point
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

***

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (v6+ recommended)
- MongoDB Atlas account (for production) or local MongoDB
- npm or yarn

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/admin-panel
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRE=7d
EOF

# Seed default roles
npm run seed:roles

# Create first super admin
npm run setup

# Start backend
npm run dev
```

**Default Super Admin:**
- Email: `admin@example.com`
- Password: `Admin@123456`
- ⚠️ **Change immediately after first login!**

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start dev server
npm run dev
```

**Access:** `http://localhost:5173`

***

## 📝 Seeded Default Roles

### 1. Super Admin
- **Full system access** - all permissions enabled
- Can manage other super admins
- Cannot be deleted if only super admin exists

### 2. Content Manager
- Dashboard, Users, Products (full CRUD)
- Orders (view only)
- Analytics (view)
- Data Models (full CRUD)
- Pages (full CRUD)

### 3. Customer Support
- Dashboard, Users (view, edit)
- Products (view)
- Orders (full CRUD)

### 4. Viewer
- Read-only access to all modules
- Cannot create, edit, or delete

***

## 🔑 Permission System Deep Dive

### Module Permissions

```javascript
permissions: {
  dashboard: { view, edit },
  users: { view, create, edit, delete },
  products: { view, create, edit, delete },
  orders: { view, create, edit, delete },
  analytics: { view },
  roles: { view, create, edit, delete },
  admins: { view, create, edit, delete },
  settings: { view, edit },
  activity_logs: { view },
  data_models: { view, create, edit, delete },
  pages: { view, create, edit, delete }
}
```

### Backend Examples

```javascript
// Single permission
router.get('/users', protect, checkPermission('users', 'view'), handler);

// Super admin only
router.delete('/critical', protect, isSuperAdmin, handler);

// Any permission (OR logic)
router.get('/dashboard', protect, checkAnyPermission([
  { module: 'users', action: 'view' },
  { module: 'products', action: 'view' }
]), handler);

// All permissions (AND logic)
router.post('/import', protect, checkAllPermissions([
  { module: 'users', action: 'create' },
  { module: 'products', action: 'create' }
]), handler);
```

### Frontend Examples

```jsx
// Component-level guard
<PermissionGuard module="users" action="create">
  <button>Add User</button>
</PermissionGuard>

// Page-level route protection
<PermissionRoute module="data_models" action="view">
  <DataModels />
</PermissionRoute>

// Programmatic check
const { hasPermission } = useAuth();
if (hasPermission('pages', 'edit')) {
  // Show edit UI
}
```

***

## 🎯 Complete API Reference

### Authentication
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current admin info
- `POST /api/auth/logout` - Logout

### Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/avatar` - Upload avatar
- `DELETE /api/profile/avatar` - Remove avatar
- `PUT /api/profile/password` - Change password

### Roles
- `GET /api/roles` - List roles
- `GET /api/roles/:id` - Get role
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### Admins
- `GET /api/admins` - List admins (pagination, search)
- `GET /api/admins/:id` - Get admin
- `POST /api/admins` - Create admin
- `PUT /api/admins/:id` - Update admin
- `DELETE /api/admins/:id` - Delete admin

### Users
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Activity Logs
- `GET /api/activity-logs` - List logs (filters: actionType, search, dateRange, adminId)
- `GET /api/activity-logs/:id` - Get log details

### App Settings
- `GET /api/app-settings` - Get all settings
- `GET /api/app-settings/:key` - Get setting by key
- `POST /api/app-settings` - Create setting
- `PUT /api/app-settings/:id` - Update setting
- `DELETE /api/app-settings/:id` - Delete setting

### Data Models (CMS Engine)
- `GET /api/data-models` - List models
- `GET /api/data-models/:id` - Get model
- `POST /api/data-models` - Create model (auto-generates schema)
- `PUT /api/data-models/:id` - Update model
- `DELETE /api/data-models/:id` - Delete model

### Dynamic Data (Auto-generated per model)
- `GET /api/dynamic-data/:modelName` - List records
- `GET /api/dynamic-data/:modelName/:id` - Get record
- `POST /api/dynamic-data/:modelName` - Create record
- `PUT /api/dynamic-data/:modelName/:id` - Update record
- `DELETE /api/dynamic-data/:modelName/:id` - Delete record

### Pages (Page Builder)
- `GET /api/pages` - List pages
- `GET /api/pages/slug/:slug` - Get published page
- `GET /api/pages/:id` - Get page by ID
- `POST /api/pages` - Create page
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page
- `PUT /api/pages/:id/reorder` - Update sidebar order

***

## 🔒 Enterprise Security Features

- ✅ **Password hashing** (bcrypt, 12 rounds)
- ✅ **JWT with expiration** (configurable)
- ✅ **HTTP-only cookies** option
- ✅ **CORS whitelist**
- ✅ **Input sanitization** (XSS prevention)
- ✅ **SQL injection protection** (Mongoose)
- ✅ **NoSQL injection protection**
- ✅ **Rate limiting** ready
- ✅ **RBAC on every route**
- ✅ **Active status checks**
- ✅ **Self-deletion prevention**
- ✅ **Last super admin protection**
- ✅ **Activity audit trail**
- ✅ **File upload validation**
- ✅ **Environment variable protection**

***

## 🎨 UI/UX Highlights

- **Modern gradient design** with glassmorphism
- **Smooth 60fps animations**
- **Micro-interactions** on hover/click
- **Skeleton loaders** for perceived performance
- **Empty states** with helpful CTAs
- **Toast notifications** (success/error/info/warning)
- **Confirmation dialogs** for destructive actions
- **Responsive tables** with mobile cards fallback
- **Modal system** for forms
- **Search with debouncing**
- **Real-time validation feedback**
- **Keyboard shortcuts** ready
- **Accessibility (a11y)** considered
- **Print-friendly** views

***

## 🧪 Testing Guide

### Test RBAC System

1. **Super Admin Test:**
   - Login with default credentials
   - Verify access to all modules
   - Test all CRUD operations

2. **Custom Role Test:**
   - Create role "Blog Editor" with only `pages.view`, `pages.create`, `pages.edit`
   - Create admin with this role
   - Login as Blog Editor
   - Verify: Can only see Pages in sidebar
   - Verify: Cannot access Users, Data Models, Settings
   - Verify: Can create/edit pages but not delete

3. **Permission Denial Test:**
   - As Blog Editor, manually navigate to `/users`
   - Should see "Access Denied" page
   - API call to `/api/users` should return 403
   - "Delete" buttons should not appear in UI

### Test Dynamic CMS

1. **Create Data Model:**
   - Go to Data Models → Create
   - Name: "Blog Posts"
   - Add fields: title (string), content (text), published (boolean)
   - Save

2. **Verify Auto-Generation:**
   - Check sidebar - "Blog Posts" link should appear
   - Click link - CRUD page should load
   - API `/api/dynamic-data/blog_posts` should be accessible

3. **Test CRUD:**
   - Create blog post record
   - Edit record
   - Search records
   - Delete record

### Test Page Builder

1. **Create Custom Page:**
   - Go to Pages → Create
   - Title: "About Us"
   - Slug: about-us
   - Add HTML content
   - Set sidebar position: Main, order: 5
   - Publish

2. **Verify:**
   - "About Us" link appears in sidebar
   - Navigate to `/page/about-us`
   - Page renders with content
   - Reorder in sidebar works

***

## 📦 Dependencies

### Backend
- **express** (^4.18.x) - Web framework
- **mongoose** (^8.0.x) - MongoDB ODM
- **jsonwebtoken** (^9.0.x) - JWT auth
- **bcryptjs** (^2.4.x) - Password hashing
- **express-validator** (^7.0.x) - Validation
- **multer** (^1.4.x) - File uploads
- **cors** (^2.8.x) - CORS handling
- **dotenv** (^16.3.x) - Environment config

### Frontend
- **react** (^18.2.x) - UI library
- **react-router-dom** (^6.20.x) - Routing
- **axios** (^1.6.x) - HTTP client
- **vite** (^5.0.x) - Build tool

***

## 🚧 Roadmap

### Phase 1 (Completed ✅)
- [x] Authentication system
- [x] RBAC implementation
- [x] Admin/Role/User management
- [x] Activity logging
- [x] App settings
- [x] Dynamic data models
- [x] Page builder
- [x] Real user count on dashboard

### Phase 2 (In Progress)
- [ ] Email notification system
- [ ] Two-factor authentication (2FA)
- [ ] Password reset via email
- [ ] Advanced analytics dashboard
- [ ] Data export (CSV, Excel, PDF)
- [ ] Bulk operations
- [ ] Media library manager

### Phase 3 (Planned)
- [ ] WebSocket real-time notifications
- [ ] Advanced chart builder
- [ ] Workflow automation
- [ ] API key management
- [ ] Webhook system
- [ ] Multi-language i18n
- [ ] Mobile app (React Native/Flutter)

***

## 🆘 Troubleshooting

**Q: Pages show blank after login**
- Check browser console for errors
- Verify routes in `App.jsx`
- Clear localStorage and re-login

**Q: 403 Forbidden on API calls**
- Verify admin has correct permissions in role
- Check JWT token in browser dev tools
- Ensure `Authorization` header is sent

**Q: Dynamic pages not appearing in sidebar**
- Check page status is "Published"
- Verify `sidebar.enabled = true` in page settings
- Refresh browser to reload menu

**Q: Cannot create first admin**
- Run `npm run setup` in backend directory
- Check MongoDB connection string
- Verify `.env` file exists

**Q: Data model not generating APIs**
- Check model status is active
- Restart backend server
- Verify no MongoDB collection name conflicts

**Q: File uploads failing**
- Create `uploads/` directory in backend
- Check file size limits in `multer.js`
- Verify disk permissions

***

## 📊 Database Collections

- `admins` - Admin accounts
- `roles` - Role definitions with permissions
- `users` - End users
- `activitylogs` - Activity audit trail
- `appsettings` - App configuration
- `datamodels` - Dynamic model schemas
- `pages` - Custom pages
- `{dynamic}` - Auto-created collections from Data Model Manager

***

## 🌐 Production Deployment

### Backend (Node.js)
```bash
# Build (if using TypeScript)
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name admin-api

# Or use Docker
docker build -t admin-panel-backend .
docker run -p 5000:5000 admin-panel-backend
```

### Frontend (React)
```bash
# Build for production
npm run build

# Deploy to Netlify/Vercel/AWS
# Or serve with nginx
```

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/admin-panel
JWT_SECRET=ultra-secure-production-secret-min-32-characters-long
JWT_EXPIRE=7d
FRONTEND_URL=https://youradmin.com
```

***

## ✅ System Status: PRODUCTION READY

**All Core Features Operational:**
- ✅ Authentication & JWT
- ✅ Full RBAC system
- ✅ Dynamic UI based on permissions
- ✅ CRUD operations for all entities
- ✅ Activity logging
- ✅ App settings management
- ✅ Dynamic data model engine
- ✅ Custom page builder
- ✅ Responsive design
- ✅ Theme system
- ✅ File uploads
- ✅ Search & filter
- ✅ Real-time dashboard stats

***

## 🎓 Learning Resources

- [MERN Stack Guide](https://www.mongodb.com/mern-stack)
- [JWT Best Practices](https://jwt.io/introduction)
- [RBAC Concepts](https://auth0.com/docs/manage-users/access-control/rbac)
- [MongoDB Schema Design](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/)

***

## 📄 License

MIT License - Free for personal and commercial use.

***

## 🙏 Credits

**Built with ❤️ by Ruhban Abdullah**

A comprehensive, production-ready MERN stack admin panel template featuring enterprise-grade RBAC, dynamic CMS capabilities, and modern development practices.

**Star ⭐ this repo if you find it useful!**

---

## 📧 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Email: ruhhbanabdullah@gmail.com
- Documentation: [Wiki](https://github.com/Shahruhban01/MERN-Admin-Panel)

***

**Version:** 2.0.0  
**Last Updated:** October 28, 2025  
**Status:** Production Ready ✅
