import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Home, Search, User, LogOut, LayoutDashboard, CalendarClock, Wallet, ChevronDown, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABEL } from '../../utils/constants'

export default function Navbar() {
  const { user, isAuthenticated, logout, role } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const dashboardPath = role === 'ADMIN' ? '/admin' : role === 'STAFF' ? '/staff' : null

  const navClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 text-sm font-medium transition ${
      isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Home size={20} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Trọ<span className="text-primary-600">Tốt</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" end className={navClass}>
            <Home size={16} /> Trang chủ
          </NavLink>
          <NavLink to="/phong-tro" className={navClass}>
            <Search size={16} /> Tìm phòng
          </NavLink>
        </nav>

        {/* Right */}
        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-ghost">Đăng nhập</Link>
              <Link to="/register" className="btn-primary">Đăng ký</Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-2.5 hover:bg-slate-50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                <span className="max-w-[120px] truncate text-sm font-medium text-slate-700">{user?.fullName}</span>
                <ChevronDown size={15} className="text-slate-400" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-slate-800">{user?.fullName}</p>
                    <p className="text-xs text-slate-500">{ROLE_LABEL[role] || role}</p>
                  </div>
                  <div className="py-1">
                    {dashboardPath && (
                      <DropItem to={dashboardPath} icon={LayoutDashboard} onClick={() => setMenuOpen(false)}>
                        Bảng điều khiển
                      </DropItem>
                    )}
                    <DropItem to="/tai-khoan/ho-so" icon={User} onClick={() => setMenuOpen(false)}>
                      Hồ sơ của tôi
                    </DropItem>
                    <DropItem to="/tai-khoan/lich-hen" icon={CalendarClock} onClick={() => setMenuOpen(false)}>
                      Lịch hẹn của tôi
                    </DropItem>
                    <DropItem to="/tai-khoan/vi" icon={Wallet} onClick={() => setMenuOpen(false)}>
                      Ví tiền
                    </DropItem>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-slate-600" onClick={() => setMobileOpen((v) => !v)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <MobileLink to="/" onClick={() => setMobileOpen(false)}>Trang chủ</MobileLink>
            <MobileLink to="/phong-tro" onClick={() => setMobileOpen(false)}>Tìm phòng</MobileLink>
            {dashboardPath && <MobileLink to={dashboardPath} onClick={() => setMobileOpen(false)}>Bảng điều khiển</MobileLink>}
            {isAuthenticated ? (
              <>
                <MobileLink to="/tai-khoan/ho-so" onClick={() => setMobileOpen(false)}>Hồ sơ</MobileLink>
                <MobileLink to="/tai-khoan/lich-hen" onClick={() => setMobileOpen(false)}>Lịch hẹn</MobileLink>
                <MobileLink to="/tai-khoan/vi" onClick={() => setMobileOpen(false)}>Ví tiền</MobileLink>
                <button onClick={handleLogout} className="mt-1 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link to="/login" className="btn-outline flex-1" onClick={() => setMobileOpen(false)}>Đăng nhập</Link>
                <Link to="/register" className="btn-primary flex-1" onClick={() => setMobileOpen(false)}>Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function DropItem({ to, icon: Icon, children, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700">
      <Icon size={16} /> {children}
    </Link>
  )
}

function MobileLink({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-50'}`
      }
    >
      {children}
    </NavLink>
  )
}
