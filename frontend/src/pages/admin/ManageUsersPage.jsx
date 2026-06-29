import { useEffect, useState, useCallback } from 'react'
import { UserPlus, Search, Pencil, Trash2, Loader2, Lock, Unlock } from 'lucide-react'
import toast from 'react-hot-toast'
import userApi from '../../api/userApi'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage } from '../../api/axiosClient'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Modal from '../../components/common/Modal'
import { PageLoader } from '../../components/common/Spinner'
import { ROLE_LABEL, USER_STATUS } from '../../utils/constants'
import { formatCurrency, formatDate } from '../../utils/format'

const ROLE_BADGE = {
  ADMIN: 'bg-violet-100 text-violet-700',
  STAFF: 'bg-primary-100 text-primary-700',
  USER: 'bg-slate-100 text-slate-700',
}

export default function ManageUsersPage() {
  const { user: me } = useAuth()
  const [filters, setFilters] = useState({ keyword: '', role: '', status: '' })
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [acting, setActing] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userApi.search({
        keyword: filters.keyword || undefined,
        role: filters.role || undefined,
        status: filters.status || undefined,
        page, size: 10,
      })
      setData(res.data)
    } catch {
      setData({ content: [], totalPages: 0 })
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => { load() }, [load])

  const doDelete = async () => {
    setActing(true)
    try {
      await userApi.remove(deleteTarget.id)
      toast.success('Đã xóa người dùng')
      setDeleteTarget(null)
      load()
    } catch (err) { toast.error(getErrorMessage(err)) } finally { setActing(false) }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý người dùng</h1>
          <p className="text-sm text-slate-500">Tạo, phân quyền và khóa/mở tài khoản</p>
        </div>
        <button className="btn-primary" onClick={() => setCreateOpen(true)}><UserPlus size={18} /> Thêm tài khoản</button>
      </div>

      {/* Filters */}
      <div className="card mb-4 flex flex-wrap items-end gap-3 p-4">
        <div className="flex-1 min-w-[200px]">
          <label className="label">Tìm kiếm</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input className="input pl-9" placeholder="Tên, email, username..." value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && (setPage(0), load())} />
          </div>
        </div>
        <div>
          <label className="label">Vai trò</label>
          <select className="select w-40" value={filters.role} onChange={(e) => { setFilters({ ...filters, role: e.target.value }); setPage(0) }}>
            <option value="">Tất cả</option>
            <option value="ADMIN">Quản trị viên</option>
            <option value="STAFF">Nhân viên</option>
            <option value="USER">Người dùng</option>
          </select>
        </div>
        <div>
          <label className="label">Trạng thái</label>
          <select className="select w-36" value={filters.status} onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(0) }}>
            <option value="">Tất cả</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="BLOCKED">Đã khóa</option>
          </select>
        </div>
        <button className="btn-outline" onClick={() => { setPage(0); load() }}><Search size={16} /> Lọc</button>
      </div>

      {loading ? (
        <PageLoader />
      ) : data.content.length === 0 ? (
        <EmptyState title="Không có người dùng" />
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Người dùng</th>
                    <th className="px-4 py-3">Liên hệ</th>
                    <th className="px-4 py-3">Vai trò</th>
                    <th className="px-4 py-3">Số dư</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.content.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                            {u.fullName?.charAt(0)?.toUpperCase()}
                          </span>
                          <div>
                            <p className="font-medium text-slate-800">{u.fullName}</p>
                            <p className="text-xs text-slate-400">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <p>{u.email}</p>
                        <p className="text-xs text-slate-400">{u.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${ROLE_BADGE[u.role]}`}>{ROLE_LABEL[u.role]}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">{formatCurrency(u.balance)}</td>
                      <td className="px-4 py-3"><StatusBadge meta={USER_STATUS[u.status]} /></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {u.id !== me.id ? (
                            <>
                              <button className="rounded-lg p-2 text-slate-500 hover:bg-primary-50 hover:text-primary-600" title="Sửa" onClick={() => setEditTarget(u)}>
                                <Pencil size={16} />
                              </button>
                              <button className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" title="Xóa" onClick={() => setDeleteTarget(u)}>
                                <Trash2 size={16} />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs italic text-slate-400">Bạn</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}

      <CreateUserModal open={createOpen} onClose={() => setCreateOpen(false)} onDone={() => { setCreateOpen(false); setPage(0); load() }} />
      <EditUserModal target={editTarget} onClose={() => setEditTarget(null)} onDone={() => { setEditTarget(null); load() }} />
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={doDelete}
        title="Xóa người dùng" message={`Xóa tài khoản "${deleteTarget?.fullName}"? Mọi tin đăng của họ cũng sẽ bị xóa.`}
        confirmText="Xóa" danger loading={acting} />
    </div>
  )
}

function CreateUserModal({ open, onClose, onDone }) {
  const empty = { username: '', password: '', email: '', phone: '', fullName: '', role: 'STAFF' }
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  useEffect(() => { if (open) setForm(empty) }, [open])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async () => {
    setLoading(true)
    try {
      await userApi.create(form)
      toast.success('Tạo tài khoản thành công')
      onDone()
    } catch (err) { toast.error(getErrorMessage(err)) } finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Thêm tài khoản mới"
      footer={<>
        <button className="btn-ghost" onClick={onClose} disabled={loading}>Hủy</button>
        <button className="btn-primary" onClick={submit} disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Tạo tài khoản'}
        </button>
      </>}>
      <div className="space-y-4">
        <div>
          <label className="label">Họ và tên</label>
          <input className="input" value={form.fullName} onChange={set('fullName')} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Tên đăng nhập</label>
            <input className="input" value={form.username} onChange={set('username')} />
          </div>
          <div>
            <label className="label">Mật khẩu</label>
            <input type="password" className="input" value={form.password} onChange={set('password')} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label className="label">Số điện thoại</label>
            <input className="input" value={form.phone} onChange={set('phone')} />
          </div>
        </div>
        <div>
          <label className="label">Vai trò</label>
          <select className="select" value={form.role} onChange={set('role')}>
            <option value="STAFF">Nhân viên (STAFF)</option>
            <option value="USER">Người dùng (USER)</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
          </select>
        </div>
      </div>
    </Modal>
  )
}

function EditUserModal({ target, onClose, onDone }) {
  const [role, setRole] = useState('USER')
  const [status, setStatus] = useState('ACTIVE')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (target) { setRole(target.role); setStatus(target.status) }
  }, [target])

  const submit = async () => {
    setLoading(true)
    try {
      await userApi.update(target.id, { role, status })
      toast.success('Cập nhật thành công')
      onDone()
    } catch (err) { toast.error(getErrorMessage(err)) } finally { setLoading(false) }
  }

  return (
    <Modal open={!!target} onClose={onClose} title={`Cập nhật: ${target?.fullName || ''}`}
      footer={<>
        <button className="btn-ghost" onClick={onClose} disabled={loading}>Hủy</button>
        <button className="btn-primary" onClick={submit} disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Lưu'}
        </button>
      </>}>
      <div className="space-y-4">
        <div>
          <label className="label">Vai trò</label>
          <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="USER">Người dùng (USER)</option>
            <option value="STAFF">Nhân viên (STAFF)</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
          </select>
        </div>
        <div>
          <label className="label">Trạng thái</label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setStatus('ACTIVE')}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium ${status === 'ACTIVE' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'}`}>
              <Unlock size={16} /> Hoạt động
            </button>
            <button type="button" onClick={() => setStatus('BLOCKED')}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium ${status === 'BLOCKED' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 text-slate-600'}`}>
              <Lock size={16} /> Khóa
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
