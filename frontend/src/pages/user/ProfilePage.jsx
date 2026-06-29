import { useState } from 'react'
import { Save, KeyRound, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import userApi from '../../api/userApi'
import { getErrorMessage } from '../../api/axiosClient'
import AccountNav from '../../components/layout/AccountNav'
import { ROLE_LABEL } from '../../utils/constants'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  })
  const [pwd, setPwd] = useState({ oldPassword: '', newPassword: '', confirm: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPwd, setSavingPwd] = useState(false)

  const saveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const res = await userApi.updateMe({ fullName: profile.fullName, phone: profile.phone, avatar: profile.avatar })
      updateUser(res.data)
      toast.success('Cập nhật hồ sơ thành công')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSavingProfile(false)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (pwd.newPassword !== pwd.confirm) {
      toast.error('Mật khẩu mới nhập lại không khớp')
      return
    }
    setSavingPwd(true)
    try {
      await userApi.changePassword({ oldPassword: pwd.oldPassword, newPassword: pwd.newPassword })
      toast.success('Đổi mật khẩu thành công')
      setPwd({ oldPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSavingPwd(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Tài khoản của tôi</h1>
      <AccountNav />

      {/* Card thong tin */}
      <div className="card mb-6 p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </span>
          <div>
            <p className="text-lg font-semibold text-slate-900">{user?.fullName}</p>
            <p className="text-sm text-slate-500">@{user?.username} · {ROLE_LABEL[user?.role]}</p>
          </div>
        </div>
      </div>

      {/* Form ho so */}
      <form onSubmit={saveProfile} className="card mb-6 p-6">
        <h2 className="mb-4 font-semibold">Thông tin cá nhân</h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Họ và tên</label>
              <input className="input" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} required />
            </div>
            <div>
              <label className="label">Số điện thoại</label>
              <input className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Email</label>
              <input className="input bg-slate-50" value={user?.email || ''} disabled />
            </div>
            <div>
              <label className="label">Tên đăng nhập</label>
              <input className="input bg-slate-50" value={user?.username || ''} disabled />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <button type="submit" className="btn-primary" disabled={savingProfile}>
            {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Lưu thay đổi</>}
          </button>
        </div>
      </form>

      {/* Doi mat khau */}
      <form onSubmit={changePassword} className="card p-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold"><KeyRound size={18} /> Đổi mật khẩu</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Mật khẩu hiện tại</label>
            <input type="password" className="input" value={pwd.oldPassword} onChange={(e) => setPwd({ ...pwd, oldPassword: e.target.value })} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Mật khẩu mới</label>
              <input type="password" className="input" value={pwd.newPassword} onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} required minLength={6} />
            </div>
            <div>
              <label className="label">Nhập lại mật khẩu mới</label>
              <input type="password" className="input" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} required />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <button type="submit" className="btn-outline" disabled={savingPwd}>
            {savingPwd ? <Loader2 size={16} className="animate-spin" /> : 'Đổi mật khẩu'}
          </button>
        </div>
      </form>
    </div>
  )
}
