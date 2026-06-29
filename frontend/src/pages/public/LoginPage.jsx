import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Home, Lock, User, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage } from '../../api/axiosClient'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' })
  const [loading, setLoading] = useState(false)

  const redirectByRole = (role) => {
    const from = location.state?.from?.pathname
    if (from) return navigate(from, { replace: true })
    if (role === 'ADMIN') return navigate('/admin', { replace: true })
    if (role === 'STAFF') return navigate('/staff', { replace: true })
    return navigate('/', { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form)
      toast.success('Đăng nhập thành công!')
      redirectByRole(user.role)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Sai tài khoản hoặc mật khẩu'))
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (u, p) => setForm({ usernameOrEmail: u, password: p })

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-white lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Home size={22} />
          </span>
          <span className="text-xl font-extrabold">TrọTốt</span>
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-white">
            Tìm tổ ấm <br /> phù hợp với bạn
          </h1>
          <p className="mt-4 max-w-md text-primary-100">
            Hàng nghìn phòng trọ, nhà nguyên căn và chung cư mini đang chờ bạn khám phá.
          </p>
        </div>
        <p className="text-sm text-primary-200">© {new Date().getFullYear()} TrọTốt</p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
                <Home size={22} />
              </span>
              <span className="text-xl font-extrabold text-slate-900">TrọTốt</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Đăng nhập</h2>
          <p className="mt-1 text-sm text-slate-500">Chào mừng bạn quay lại!</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">Tên đăng nhập hoặc Email</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  className="input pl-10"
                  placeholder="vd: admin"
                  value={form.usernameOrEmail}
                  onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Mật khẩu</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  className="input pl-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Đăng nhập'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:underline">
              Đăng ký ngay
            </Link>
          </p>

          {/* Demo accounts */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Tài khoản dùng thử</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button onClick={() => fillDemo('admin', 'admin123')} className="rounded-lg border border-slate-200 py-2 hover:border-primary-300 hover:bg-primary-50">
                <span className="block font-semibold text-slate-700">Admin</span>
                <span className="text-slate-400">admin123</span>
              </button>
              <button onClick={() => fillDemo('staff', 'staff123')} className="rounded-lg border border-slate-200 py-2 hover:border-primary-300 hover:bg-primary-50">
                <span className="block font-semibold text-slate-700">Staff</span>
                <span className="text-slate-400">staff123</span>
              </button>
              <button onClick={() => fillDemo('user', 'user123')} className="rounded-lg border border-slate-200 py-2 hover:border-primary-300 hover:bg-primary-50">
                <span className="block font-semibold text-slate-700">User</span>
                <span className="text-slate-400">user123</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
