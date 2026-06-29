import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Sparkles, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import amenityApi from '../../api/amenityApi'
import { getErrorMessage } from '../../api/axiosClient'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Modal from '../../components/common/Modal'
import { PageLoader } from '../../components/common/Spinner'

export default function ManageAmenitiesPage() {
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState(null) // null = none, {} = create, {id} = edit
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [acting, setActing] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await amenityApi.getAll()
      setAmenities(res.data || [])
    } catch { setAmenities([]) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const doDelete = async () => {
    setActing(true)
    try {
      await amenityApi.remove(deleteTarget.id)
      toast.success('Đã xóa tiện ích')
      setDeleteTarget(null)
      load()
    } catch (err) { toast.error(getErrorMessage(err)) } finally { setActing(false) }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý tiện ích</h1>
          <p className="text-sm text-slate-500">Các tiện ích dùng để lọc tin (wifi, điều hòa...)</p>
        </div>
        <button className="btn-primary" onClick={() => setEditTarget({})}><Plus size={18} /> Thêm tiện ích</button>
      </div>

      {loading ? (
        <PageLoader />
      ) : amenities.length === 0 ? (
        <EmptyState icon={Sparkles} title="Chưa có tiện ích" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((a) => (
            <div key={a.id} className="card flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Sparkles size={18} />
                </span>
                <div>
                  <p className="font-medium text-slate-800">{a.name}</p>
                  {a.icon && <p className="text-xs text-slate-400">{a.icon}</p>}
                </div>
              </div>
              <div className="flex gap-1">
                <button className="rounded-lg p-2 text-slate-500 hover:bg-primary-50 hover:text-primary-600" onClick={() => setEditTarget(a)}><Pencil size={16} /></button>
                <button className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={() => setDeleteTarget(a)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AmenityModal target={editTarget} onClose={() => setEditTarget(null)} onDone={() => { setEditTarget(null); load() }} />
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={doDelete}
        title="Xóa tiện ích" message={`Xóa tiện ích "${deleteTarget?.name}"?`} confirmText="Xóa" danger loading={acting} />
    </div>
  )
}

function AmenityModal({ target, onClose, onDone }) {
  const [form, setForm] = useState({ name: '', icon: '' })
  const [loading, setLoading] = useState(false)
  const isEdit = target && target.id

  useEffect(() => {
    if (target) setForm({ name: target.name || '', icon: target.icon || '' })
  }, [target])

  const submit = async () => {
    if (!form.name.trim()) { toast.error('Vui lòng nhập tên tiện ích'); return }
    setLoading(true)
    try {
      if (isEdit) await amenityApi.update(target.id, form)
      else await amenityApi.create(form)
      toast.success(isEdit ? 'Cập nhật thành công' : 'Thêm tiện ích thành công')
      onDone()
    } catch (err) { toast.error(getErrorMessage(err)) } finally { setLoading(false) }
  }

  return (
    <Modal open={!!target} onClose={onClose} title={isEdit ? 'Sửa tiện ích' : 'Thêm tiện ích'} size="sm"
      footer={<>
        <button className="btn-ghost" onClick={onClose} disabled={loading}>Hủy</button>
        <button className="btn-primary" onClick={submit} disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Lưu'}
        </button>
      </>}>
      <div className="space-y-4">
        <div>
          <label className="label">Tên tiện ích</label>
          <input className="input" placeholder="VD: Wifi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label">Icon (class FontAwesome - tùy chọn)</label>
          <input className="input" placeholder="VD: fa-wifi" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        </div>
      </div>
    </Modal>
  )
}
