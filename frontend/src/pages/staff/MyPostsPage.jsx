import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  PlusSquare, Pencil, Trash2, Crown, Home, MapPin, Maximize, Loader2, ImageOff,
} from 'lucide-react'
import toast from 'react-hot-toast'
import postApi from '../../api/postApi'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage } from '../../api/axiosClient'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Modal from '../../components/common/Modal'
import { PageLoader } from '../../components/common/Spinner'
import { POST_STATUS, POST_TYPE_LABEL, VIP_PRICE_PER_DAY } from '../../utils/constants'
import { formatCurrency, formatDate, resolveImageUrl } from '../../utils/format'

export default function MyPostsPage() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [rentTarget, setRentTarget] = useState(null)
  const [vipTarget, setVipTarget] = useState(null)
  const [acting, setActing] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await postApi.myPosts({ status: status || undefined, page, size: 8, sortBy: 'createdAt', sortDir: 'desc' })
      setData(res.data)
    } catch {
      setData({ content: [], totalPages: 0 })
    } finally {
      setLoading(false)
    }
  }, [status, page])

  useEffect(() => { load() }, [load])

  const doDelete = async () => {
    setActing(true)
    try {
      await postApi.remove(deleteTarget.id)
      toast.success('Đã xóa tin đăng')
      setDeleteTarget(null)
      load()
    } catch (err) { toast.error(getErrorMessage(err)) } finally { setActing(false) }
  }

  const doRent = async () => {
    setActing(true)
    try {
      await postApi.markRented(rentTarget.id)
      toast.success('Đã đánh dấu cho thuê')
      setRentTarget(null)
      load()
    } catch (err) { toast.error(getErrorMessage(err)) } finally { setActing(false) }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tin đăng của tôi</h1>
          <p className="text-sm text-slate-500">Quản lý, chỉnh sửa và đẩy VIP cho tin đăng</p>
        </div>
        <Link to="/staff/dang-tin" className="btn-primary"><PlusSquare size={18} /> Đăng tin mới</Link>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-slate-500">Lọc:</span>
        <select className="select w-auto" value={status} onChange={(e) => { setStatus(e.target.value); setPage(0) }}>
          <option value="">Tất cả</option>
          {Object.entries(POST_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {loading ? (
        <PageLoader />
      ) : data.content.length === 0 ? (
        <EmptyState icon={Home} title="Chưa có tin đăng" description="Bắt đầu đăng tin đầu tiên của bạn ngay!"
          action={<Link to="/staff/dang-tin" className="btn-primary">Đăng tin</Link>} />
      ) : (
        <>
          <div className="space-y-3">
            {data.content.map((p) => {
              const thumb = resolveImageUrl(p.images?.[0])
              return (
                <div key={p.id} className="card flex flex-col gap-4 p-4 md:flex-row">
                  <div className="h-32 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 md:w-44">
                    {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" />
                      : <div className="flex h-full items-center justify-center text-slate-300"><ImageOff size={32} /></div>}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <Link to={`/phong-tro/${p.id}`} className="font-semibold text-slate-800 hover:text-primary-600">{p.title}</Link>
                      <div className="flex items-center gap-2">
                        {p.isVip && <span className="badge bg-amber-100 text-amber-700"><Crown size={12} /> VIP</span>}
                        <StatusBadge meta={POST_STATUS[p.status]} />
                      </div>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span className="font-semibold text-primary-600">{formatCurrency(p.price)}/tháng</span>
                      <span className="inline-flex items-center gap-1"><Maximize size={13} /> {Number(p.area)} m²</span>
                      <span>{POST_TYPE_LABEL[p.type]}</span>
                    </div>
                    <p className="mt-1 line-clamp-1 flex items-center gap-1 text-sm text-slate-400">
                      <MapPin size={13} /> {[p.ward?.name, p.district?.name, p.province?.name].filter(Boolean).join(', ')}
                    </p>
                    {p.isVip && p.vipExpiration && (
                      <p className="mt-1 text-xs text-amber-600">VIP đến {formatDate(p.vipExpiration)}</p>
                    )}

                    <div className="mt-auto flex flex-wrap gap-2 pt-3">
                      <Link to={`/staff/tin-dang/${p.id}/sua`} className="btn-outline btn-sm"><Pencil size={14} /> Sửa</Link>
                      <button className="btn-outline btn-sm !border-amber-200 !text-amber-700 hover:!bg-amber-50" onClick={() => setVipTarget(p)}>
                        <Crown size={14} /> {p.isVip ? 'Gia hạn VIP' : 'Đẩy VIP'}
                      </button>
                      {p.status !== 'RENTED' && (
                        <button className="btn-ghost btn-sm text-emerald-700 hover:bg-emerald-50" onClick={() => setRentTarget(p)}>
                          <Home size={14} /> Đã cho thuê
                        </button>
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

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={doDelete}
        title="Xóa tin đăng" message={`Xóa tin "${deleteTarget?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa" danger loading={acting} />

      <ConfirmDialog open={!!rentTarget} onClose={() => setRentTarget(null)} onConfirm={doRent}
        title="Đánh dấu đã cho thuê" message="Tin sẽ chuyển sang trạng thái 'Đã cho thuê' và không nhận đặt lịch mới."
        confirmText="Xác nhận" loading={acting} />

      <BuyVipModal post={vipTarget} onClose={() => setVipTarget(null)} onDone={() => { setVipTarget(null); load() }} />
    </div>
  )
}

function BuyVipModal({ post, onClose, onDone }) {
  const { user, refreshProfile } = useAuth()
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const cost = (Number(days) || 0) * VIP_PRICE_PER_DAY
  const notEnough = (user?.balance ?? 0) < cost

  const submit = async () => {
    if (!days || days < 1) { toast.error('Số ngày tối thiểu là 1'); return }
    setLoading(true)
    try {
      await postApi.buyVip(post.id, Number(days))
      toast.success('Đẩy VIP thành công!')
      await refreshProfile()
      onDone()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={!!post}
      onClose={onClose}
      title={post?.isVip ? 'Gia hạn gói VIP' : 'Đẩy tin lên VIP'}
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={loading}>Hủy</button>
          <button className="btn-primary" onClick={submit} disabled={loading || notEnough}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : `Thanh toán ${formatCurrency(cost)}`}
          </button>
        </>
      }
    >
      <p className="mb-4 rounded-lg bg-primary-50 p-3 text-sm text-primary-700">{post?.title}</p>
      <div className="space-y-4">
        <div>
          <label className="label">Số ngày VIP (×{formatCurrency(VIP_PRICE_PER_DAY)}/ngày)</label>
          <input type="number" className="input" min={1} max={365} value={days} onChange={(e) => setDays(e.target.value)} />
          <div className="mt-2 flex gap-2">
            {[7, 15, 30].map((d) => (
              <button key={d} type="button" onClick={() => setDays(d)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${Number(days) === d ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600'}`}>
                {d} ngày
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
          <span className="text-slate-500">Số dư ví hiện tại</span>
          <span className="font-semibold text-slate-800">{formatCurrency(user?.balance)}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
          <span className="text-slate-500">Thành tiền</span>
          <span className="font-bold text-primary-600">{formatCurrency(cost)}</span>
        </div>
        {notEnough && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            Số dư không đủ. Vui lòng <Link to="/staff/vi" className="font-semibold underline">nạp thêm tiền</Link>.
          </p>
        )}
      </div>
    </Modal>
  )
}
