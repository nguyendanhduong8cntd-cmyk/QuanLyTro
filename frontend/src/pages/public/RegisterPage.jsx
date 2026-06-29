import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage } from '../../api/axiosClient'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '', username: '', email: '', phone: '', password: '', confirm: '',
  })
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('Mật khẩu nhập lại không khớp')
      return
    }
    setLoading(true)
    try {
      const { confirm, ...payload } = form
      await register(payload)
      toast.success('Đăng ký thành công! Chào mừng bạn.')
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Đăng ký thất bại'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-white lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Home size={22} />
          </span>
          <span className="text-xl font-extrabold">TrọTốt</span>
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold leading-tight">Tham gia cùng <br /> TrọTốt ngay hôm nay</h1>
          <p className="mt-4 max-w-md text-primary-100">
            Tạo tài khoản miễn phí để lưu tin yêu thích và đặt lịch xem phòng dễ dàng.
          </p>
        </div>
        <p className="text-sm text-primary-200">© {new Date().getFullYear()} TrọTốt</p>
      </div>

      <div className="flex items-center justify-center bg-slate-50 p-6 py-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-900">Tạo tài khoản</h2>
          <p className="mt-1 text-sm text-slate-500">Chỉ mất một phút để bắt đầu.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">Họ và tên</label>
              <input className="input" placeholder="Nguyễn Văn A" value={form.fullName} onChange={set('fullName')} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Tên đăng nhập</label>
                <input className="input" placeholder="nguyenvana" value={form.username} onChange={set('username')} required minLength={4} />
              </div>
              <div>
                <label className="label">Số điện thoại</label>
                <input className="input" placeholder="0901234567" value={form.phone} onChange={set('phone')} required />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="email@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Mật khẩu</label>
                <input type="password" className="input" placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={set('password')} required minLength={6} />
              </div>
              <div>
                <label className="label">Nhập lại mật khẩu</label>
                <input type="password" className="input" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} required />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Đăng ký'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
