# MERN Admin Panel - Complete Role-Based Access Control System

## 📋 Project Overview

A fully functional **MERN Stack Admin Panel** with comprehensive **Role-Based Access Control (RBAC)** system, featuring dynamic permission management, user authentication, and a modern responsive UI.

---

## ✨ Features Implemented

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Password hashing** using bcrypt (12 rounds)
- **Protected routes** on both frontend and backend
- **Automatic token refresh** and session management
- **Login/Register** functionality with validation

### 👥 Role-Based Access Control (RBAC)
- **Dynamic role creation** and management
- **Granular permission system** with 8 modules:
  - Dashboard (view, edit)
  - Users (view, create, edit, delete)
  - Products (view, create, edit, delete)
  - Orders (view, create, edit, delete)
  - Analytics (view)
  - Roles (view, create, edit, delete)
  - Admins (view, create, edit, delete)
  - Settings (view, edit)
- **Super Admin role** with full access to all features
- **Custom roles** with specific permission combinations
- **Permission inheritance** and validation

### 🎨 Frontend Features
- **React 18** with Vite build system
- **React Router v6** for navigation
- **Context API** for state management (Auth, Theme)
- **Persistent sidebar** with tree-style navigation
- **Search functionality** in sidebar
- **Dark/Light theme** toggle with system preference detection
- **Responsive design** for desktop, tablet, and mobile
- **Permission-based UI rendering**:
  - Conditional page access
  - Dynamic button visibility
  - Action-based component rendering
- **Toast notifications** for user feedback
- **Loading states** and error handling

### 🔧 Backend Features
- **Node.js + Express.js** RESTful API
- **MongoDB** with Mongoose ODM
- **JWT authentication** middleware
- **Permission checking middleware**:
  - `checkPermission(module, action)` - Single permission check
  - `isSuperAdmin()` - Super admin verification
  - `checkAnyPermission([...])` - At least one permission
  - `checkAllPermissions([...])` - All permissions required
- **File upload** with Multer (profile pictures)
- **Input validation** with express-validator
- **Error handling** middleware
- **CORS configuration**

### 📄 Core Pages & Components

#### Admin Management
- **Admin List** - View all admins with role information
- **Create Admin** - Add new admins with role assignment
- **Edit Admin** - Update admin details and roles
- **Delete Admin** - Remove admins (with safety checks)
- **Status Toggle** - Activate/deactivate admin accounts

#### Role Management
- **Role List** - Card-based display of all roles
- **Create Role** - Define new roles with permissions
- **Edit Role** - Modify role permissions
- **Delete Role** - Remove unused roles (with validation)
- **Permission Matrix** - Visual permission selection by module

#### Profile & Settings
- **Profile Page**:
  - Personal information editing
  - Avatar upload/change/delete
  - Password change functionality
  - Bio and contact details
- **Settings Page**:
  - Theme selection (Light/Dark)
  - Email notification preferences
  - Dashboard layout options
  - Language selection
  - Timezone and date format

#### Dashboard
- **Statistics cards** (customizable based on permissions)
- **Quick actions** menu
- **Recent activity** feed
- **Role-based content** visibility

#### User Management
- Permission-based CRUD operations
- Search and filter functionality
- Bulk actions support

#### Products, Orders, Analytics
- Modular pages with permission checks
- Empty states with helpful messages
- Loading indicators

***

## 🏗️ Project Structure

```
mern-admin-panel/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── multer.js          # File upload configuration
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── checkPermission.js # Permission validation
│   ├── models/
│   │   ├── Admin.js           # Admin schema
│   │   └── Role.js            # Role schema with permissions
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── profile.js         # Profile management
│   │   ├── roles.js           # Role CRUD operations
│   │   ├── admins.js          # Admin management
│   │   ├── users.js           # User management
│   │   ├── products.js        # Product management
│   │   ├── orders.js          # Order management
│   │   └── analytics.js       # Analytics data
│   ├── scripts/
│   │   ├── seedRoles.js       # Seed default roles
│   │   └── setupFirstAdmin.js # Create first super admin
│   ├── uploads/               # File storage
│   ├── .env                   # Environment variables
│   ├── server.js              # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── css/
│   │   │       └── components/  # Component-specific styles
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Layout.jsx       # Main layout wrapper
│   │   │   ├── Header.jsx       # Top navigation bar
│   │   │   ├── Sidebar.jsx      # Persistent sidebar with search
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ProfileSettings.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── RoleManagement.jsx
│   │   │   ├── RoleModal.jsx
│   │   │   ├── AdminManagement.jsx
│   │   │   ├── AdminModal.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── ProtectedRoute.jsx   # Auth guard
│   │   │   ├── PermissionRoute.jsx  # Permission guard
│   │   │   └── PermissionGuard.jsx  # Conditional rendering
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Authentication state
│   │   │   └── ThemeContext.jsx   # Theme management
│   │   ├── services/
│   │   │   └── api.js             # API client with interceptors
│   │   ├── App.jsx                # Root component
│   │   └── main.jsx               # Entry point
│   ├── .env                       # Environment variables
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

***

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/admin-panel
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
EOF

# Seed default roles
npm run seed:roles

# Create first super admin
npm run setup

# Start backend server
npm run dev
```

**Default Super Admin Credentials:**
- Email: `admin@example.com`
- Password: `Admin@123456`
- ⚠️ **Change password immediately after first login!**

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

Access the application at: `http://localhost:5173`

***

## 📝 Default Roles Seeded

### 1. Super Admin
- **All permissions** across all modules
- Can create/edit/delete other admins and roles
- Cannot be deleted or deactivated if only one exists

### 2. Content Manager
- Dashboard: view
- Users: view
- Products: view, create, edit, delete
- Orders: view
- Analytics: view
- Settings: view

### 3. Customer Support
- Dashboard: view
- Users: view, edit
- Products: view
- Orders: view, create, edit
- Settings: view

### 4. Viewer
- Dashboard: view
- Users: view
- Products: view
- Orders: view
- Analytics: view
- Settings: view

***

## 🔑 Permission System

### Module Structure
Each module has specific actions that can be permitted:

```javascript
permissions: {
  dashboard: { view, edit },
  users: { view, create, edit, delete },
  products: { view, create, edit, delete },
  orders: { view, create, edit, delete },
  analytics: { view },
  roles: { view, create, edit, delete },
  admins: { view, create, edit, delete },
  settings: { view, edit }
}
```

### Backend Permission Checking

```javascript
// Single permission check
router.get('/users', protect, checkPermission('users', 'view'), handler);

// Super admin only
router.post('/roles', protect, isSuperAdmin, handler);

// Any permission (at least one)
router.get('/data', protect, checkAnyPermission([
  { module: 'users', action: 'view' },
  { module: 'products', action: 'view' }
]), handler);

// All permissions required
router.post('/critical', protect, checkAllPermissions([
  { module: 'users', action: 'delete' },
  { module: 'admins', action: 'delete' }
]), handler);
```

### Frontend Permission Checking

```jsx
// Component-level guard
<PermissionGuard module="users" action="create">
  <button>Add User</button>
</PermissionGuard>

// Page-level guard
<PermissionRoute module="admins" action="view">
  <AdminManagement />
</PermissionRoute>

// Programmatic check
const { hasPermission } = useAuth();
if (hasPermission('users', 'edit')) {
  // Show edit button
}
```

***

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current admin
- `POST /api/auth/logout` - Logout

### Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/avatar` - Upload avatar
- `DELETE /api/profile/avatar` - Delete avatar
- `PUT /api/profile/password` - Change password
- `PUT /api/profile/preferences` - Update preferences

### Roles
- `GET /api/roles` - Get all roles (requires `roles.view`)
- `GET /api/roles/:id` - Get single role (requires `roles.view`)
- `POST /api/roles` - Create role (requires `roles.create`)
- `PUT /api/roles/:id` - Update role (requires `roles.edit`)
- `DELETE /api/roles/:id` - Delete role (requires `roles.delete`)

### Admins
- `GET /api/admins` - Get all admins (requires `admins.view`)
- `GET /api/admins/:id` - Get single admin (requires `admins.view`)
- `POST /api/admins` - Create admin (requires `admins.create`)
- `PUT /api/admins/:id` - Update admin (requires `admins.edit`)
- `DELETE /api/admins/:id` - Delete admin (requires `admins.delete`)

### Users, Products, Orders, Analytics
Similar CRUD patterns with respective permissions

***

## 🔒 Security Features

- **Password hashing** with bcrypt (12 rounds)
- **JWT tokens** with expiration
- **HTTP-only cookies** option available
- **CORS configuration** for allowed origins
- **Input validation** on all endpoints
- **SQL injection protection** via Mongoose
- **XSS protection** via input sanitization
- **Rate limiting** ready (can be added)
- **Role-based middleware** on every protected route
- **Active status checks** for admins and roles
- **Self-deletion prevention**
- **Last super admin protection**

***

## 🎨 UI/UX Features

- **Modern gradient design** with custom color schemes
- **Smooth animations** and transitions
- **Hover effects** on interactive elements
- **Loading states** for async operations
- **Empty states** with helpful messages
- **Toast notifications** for success/error feedback
- **Responsive tables** with horizontal scroll on mobile
- **Modal dialogs** for forms
- **Confirmation dialogs** for destructive actions
- **Search functionality** in tables and sidebar
- **Filter options** for data views
- **Pagination ready** structure

***

## 🧪 Testing the System

### Test Permission System

1. **Login as Super Admin**
   - Should see all menu items
   - Can access all pages
   - Can create/edit/delete everything

2. **Create a Limited Role**
   - Create role "Editor" with only `products.view` and `products.edit`
   - Create admin with this role

3. **Login as Editor**
   - Should only see Products in sidebar
   - Cannot access Users, Orders, Analytics, Roles, Admins
   - Can view and edit products, but cannot create or delete

4. **Test Permission Denials**
   - Try to manually navigate to `/admins` - should see "Access Denied"
   - Try API call to `/api/users` - should get 403 error
   - Buttons for unauthorized actions should be hidden

---

## 📦 Dependencies

### Backend
- express - Web framework
- mongoose - MongoDB ODM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- express-validator - Input validation
- multer - File uploads
- cors - Cross-origin requests
- dotenv - Environment variables

### Frontend
- react - UI library
- react-router-dom - Routing
- axios - HTTP client
- vite - Build tool

***

## 🚧 Future Enhancements (Optional)

- [ ] Two-factor authentication (2FA)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Activity logs and audit trail
- [ ] Real-time notifications with WebSocket
- [ ] File management system
- [ ] Advanced analytics dashboard
- [ ] Export data to CSV/PDF
- [ ] Bulk operations
- [ ] API rate limiting
- [ ] Session management
- [ ] Remember me functionality
- [ ] Social login integration

***

## 📄 License

MIT License - Feel free to use this project for learning or commercial purposes.

***

## 👨‍💻 Author

Built with ❤️ as a complete MERN stack admin panel template with production-ready RBAC system.

***

## 🆘 Troubleshooting

**Issue: Blank pages after login**
- Solution: Check browser console for errors, ensure all routes are properly imported in App.jsx

**Issue: 403 errors when accessing data**
- Solution: Verify the logged-in admin has the required permissions in their role

**Issue: Cannot create first admin**
- Solution: Run `npm run setup` in backend directory

**Issue: Theme not persisting**
- Solution: Check localStorage in browser dev tools, ensure ThemeContext is properly wrapped

**Issue: Sidebar not showing on mobile**
- Solution: Click hamburger menu icon in header to toggle sidebar

***

## ✅ System Status: FULLY OPERATIONAL

All features implemented and tested:
- ✅ Authentication system working
- ✅ Role-based permissions functioning on backend
- ✅ Dynamic UI based on permissions
- ✅ CRUD operations for all entities
- ✅ Responsive design implemented
- ✅ Theme system operational
- ✅ Profile management complete
- ✅ File upload working
- ✅ Search and filter features active

**The admin panel is ready for use, But with proper credits!**
**Built with ❤️ By Ruhban Abdullah**