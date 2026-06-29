import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import {
  Home, LayoutDashboard, FileText, PlusSquare, CalendarClock, Users, Sparkles,
  Receipt, LogOut, Menu, X, ExternalLink, Wallet,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABEL } from '../../utils/constants'
import { formatCurrency } from '../../utils/format'

const STAFF_NAV = [
  { to: '/staff', label: 'Tổng quan', icon: LayoutDashboard, end: true },
  { to: '/staff/tin-dang', label: 'Tin đăng của tôi', icon: FileText },
  { to: '/staff/dang-tin', label: 'Đăng tin mới', icon: PlusSquare },
  { to: '/staff/lich-hen', label: 'Lịch hẹn xem phòng', icon: CalendarClock },
  { to: '/staff/vi', label: 'Ví tiền', icon: Wallet },
]

const ADMIN_NAV = [
  { to: '/admin', label: 'Tổng quan', icon: LayoutDashboard, end: true },
  { to: '/admin/duyet-tin', label: 'Kiểm duyệt tin', icon: FileText },
  { to: '/admin/nguoi-dung', label: 'Người dùng', icon: Users },
  { to: '/admin/tien-ich', label: 'Tiện ích', icon: Sparkles },
  { to: '/admin/giao-dich', label: 'Giao dịch', icon: Receipt },
  { to: '/admin/lich-hen', label: 'Lịch hẹn', icon: CalendarClock },
]

export default function DashboardLayout({ variant = 'staff' }) {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const nav = variant === 'admin' ? ADMIN_NAV : STAFF_NAV
  const title = variant === 'admin' ? 'Quản trị hệ thống' : 'Kênh nhân viên'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Home size={18} />
            </span>
            <span className="font-extrabold text-slate-900">
              Trọ<span className="text-primary-600">Tốt</span>
            </span>
          </Link>
          <button className="text-slate-400 lg:hidden" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="px-3 py-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-slate-100 p-3">
          <Link to="/" className="sidebar-link">
            <ExternalLink size={18} /> Về trang chủ
          </Link>
          <button onClick={handleLogout} className="sidebar-link w-full text-red-600 hover:bg-red-50 hover:text-red-700">
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {open && <div className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <button className="text-slate-600 lg:hidden" onClick={() => setOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            {role === 'STAFF' && (
              <span className="hidden rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-700 sm:inline-flex">
                Số dư: {formatCurrency(user?.balance)}
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-tight text-slate-800">{user?.fullName}</p>
                <p className="text-xs text-slate-500">{ROLE_LABEL[role] || role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
