import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Check, X, Trash2, Eye, Crown, MapPin, ImageOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import postApi from '../../api/postApi'
import { getErrorMessage } from '../../api/axiosClient'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Modal from '../../components/common/Modal'
import { PageLoader } from '../../components/common/Spinner'
import { POST_STATUS, POST_TYPE_LABEL } from '../../utils/constants'
import { formatCurrency, resolveImageUrl } from '../../utils/format'

export default function ManagePostsPage() {
  const [status, setStatus] = useState('PENDING')
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await postApi.adminSearch({ status: status || undefined, page, size: 8, sortBy: 'createdAt', sortDir: 'desc' })
      setData(res.data)
    } catch {
      setData({ content: [], totalPages: 0 })
    } finally {
      setLoading(false)
    }
  }, [status, page])

  useEffect(() => { load() }, [load])

  const approve = async (id) => {
    setActingId(id)
    try {
      await postApi.approve(id)
      toast.success('Đã duyệt tin')
      load()
    } catch (err) { toast.error(getErrorMessage(err)) } finally { setActingId(null) }
  }

  const doReject = async (reason) => {
    setActingId(rejectTarget.id)
    try {
      await postApi.reject(rejectTarget.id, reason)
      toast.success('Đã từ chối tin')
      setRejectTarget(null)
      load()
    } catch (err) { toast.error(getErrorMessage(err)) } finally { setActingId(null) }
  }

  const doDelete = async () => {
    setActingId(deleteTarget.id)
    try {
      await postApi.remove(deleteTarget.id)
      toast.success('Đã xóa tin')
      setDeleteTarget(null)
      load()
    } catch (err) { toast.error(getErrorMessage(err)) } finally { setActingId(null) }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Kiểm duyệt tin đăng</h1>
        <p className="text-sm text-slate-500">Duyệt, từ chối hoặc gỡ các tin đăng</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {[['PENDING', 'Chờ duyệt'], ['APPROVED', 'Đã duyệt'], ['REJECTED', 'Bị từ chối'], ['RENTED', 'Đã thuê'], ['', 'Tất cả']].map(([val, label]) => (
          <button key={val} onClick={() => { setStatus(val); setPage(0) }}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${status === val ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <PageLoader />
      ) : data.content.length === 0 ? (
        <EmptyState title="Không có tin đăng" />
      ) : (
        <>
          <div className="space-y-3">
            {data.content.map((p) => {
              const thumb = resolveImageUrl(p.images?.[0])
              return (
                <div key={p.id} className="card flex flex-col gap-4 p-4 md:flex-row">
                  <div className="h-28 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 md:w-40">
                    {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" />
                      : <div className="flex h-full items-center justify-center text-slate-300"><ImageOff size={28} /></div>}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-semibold text-slate-800">{p.title}</p>
                      <div className="flex items-center gap-2">
                        {p.isVip && <span className="badge bg-amber-100 text-amber-700"><Crown size={12} /> VIP</span>}
                        <StatusBadge meta={POST_STATUS[p.status]} />
                      </div>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-slate-500">
                      <span className="font-semibold text-primary-600">{formatCurrency(p.price)}/tháng</span>
                      <span>{Number(p.area)} m²</span>
                      <span>{POST_TYPE_LABEL[p.type]}</span>
                      <span>Đăng bởi: <b className="text-slate-600">{p.staff?.fullName}</b></span>
                    </div>
                    <p className="mt-1 line-clamp-1 flex items-center gap-1 text-sm text-slate-400">
                      <MapPin size={13} /> {[p.addressDetail, p.ward?.name, p.district?.name, p.province?.name].filter(Boolean).join(', ')}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2 pt-3">
                      <Link to={`/phong-tro/${p.id}`} className="btn-ghost btn-sm"><Eye size={14} /> Xem</Link>
                      {p.status === 'PENDING' && (
                        <>
                          <button className="btn-success btn-sm" disabled={actingId === p.id} onClick={() => approve(p.id)}>
                            <Check size={14} /> Duyệt
                          </button>
                          <button className="btn-outline btn-sm !border-red-200 !text-red-600 hover:!bg-red-50" disabled={actingId === p.id} onClick={() => setRejectTarget(p)}>
                            <X size={14} /> Từ chối
                          </button>
                        </>
                      )}
                      <button className="btn-ghost btn-sm text-red-600 hover:bg-red-50" onClick={() => setDeleteTarget(p)}>
                        <Trash2 size={14} /> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}

      <RejectModal target={rejectTarget} onClose={() => setRejectTarget(null)} onConfirm={doReject} loading={actingId === rejectTarget?.id} />

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={doDelete}
        title="Xóa tin đăng" message={`Xóa tin "${deleteTarget?.title}"?`} confirmText="Xóa" danger loading={actingId === deleteTarget?.id} />
    </div>
  )
}

function RejectModal({ target, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState('')
  useEffect(() => { if (target) setReason('') }, [target])

  return (
    <Modal
      open={!!target}
      onClose={onClose}
      title="Từ chối tin đăng"
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={loading}>Hủy</button>
          <button className="btn-danger" onClick={() => reason.trim() ? onConfirm(reason) : toast.error('Vui lòng nhập lý do')} disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Từ chối'}
          </button>
        </>
      }
    >
      <p className="mb-3 text-sm text-slate-600">Nhập lý do từ chối tin "<b>{target?.title}</b>":</p>
      <textarea className="input" rows={3} placeholder="VD: Hình ảnh không rõ ràng, thông tin thiếu..." value={reason} onChange={(e) => setReason(e.target.value)} />
    </Modal>
  )
}
