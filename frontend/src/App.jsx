import { Routes, Route } from 'react-router-dom'

import PublicLayout from './components/layout/PublicLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'

// Public
import HomePage from './pages/public/HomePage'
import PostListPage from './pages/public/PostListPage'
import PostDetailPage from './pages/public/PostDetailPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import NotFoundPage from './pages/public/NotFoundPage'
import ForbiddenPage from './pages/public/ForbiddenPage'

// User
import ProfilePage from './pages/user/ProfilePage'
import MyAppointmentsPage from './pages/user/MyAppointmentsPage'
import WalletPage from './pages/user/WalletPage'

// Staff
import StaffDashboardPage from './pages/staff/StaffDashboardPage'
import MyPostsPage from './pages/staff/MyPostsPage'
import PostEditorPage from './pages/staff/PostEditorPage'
import StaffAppointmentsPage from './pages/staff/StaffAppointmentsPage'

// Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import ManagePostsPage from './pages/admin/ManagePostsPage'
import ManageUsersPage from './pages/admin/ManageUsersPage'
import ManageAmenitiesPage from './pages/admin/ManageAmenitiesPage'
import ManageTransactionsPage from './pages/admin/ManageTransactionsPage'
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage'

export default function App() {
  return (
    <Routes>
      {/* Auth full-screen */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Public + User */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/phong-tro" element={<PostListPage />} />
        <Route path="/phong-tro/:id" element={<PostDetailPage />} />
        <Route path="/403" element={<ForbiddenPage />} />

        <Route
          path="/tai-khoan/ho-so"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />
        <Route
          path="/tai-khoan/lich-hen"
          element={<ProtectedRoute><MyAppointmentsPage /></ProtectedRoute>}
        />
        <Route
          path="/tai-khoan/vi"
          element={<ProtectedRoute><WalletPage /></ProtectedRoute>}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Staff */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute roles={['STAFF', 'ADMIN']}>
            <DashboardLayout variant="staff" />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboardPage />} />
        <Route path="tin-dang" element={<MyPostsPage />} />
        <Route path="dang-tin" element={<PostEditorPage />} />
        <Route path="tin-dang/:id/sua" element={<PostEditorPage />} />
        <Route path="lich-hen" element={<StaffAppointmentsPage />} />
        <Route path="vi" element={<WalletPage embedded />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <DashboardLayout variant="admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="duyet-tin" element={<ManagePostsPage />} />
        <Route path="nguoi-dung" element={<ManageUsersPage />} />
        <Route path="tien-ich" element={<ManageAmenitiesPage />} />
        <Route path="giao-dich" element={<ManageTransactionsPage />} />
        <Route path="lich-hen" element={<AdminAppointmentsPage />} />
      </Route>
    </Routes>
  )
}
