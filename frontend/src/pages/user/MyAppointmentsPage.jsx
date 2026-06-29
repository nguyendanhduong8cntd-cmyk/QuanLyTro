import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, MapPin, X } from 'lucide-react'
import toast from 'react-hot-toast'
import appointmentApi from '../../api/appointmentApi'
import { getErrorMessage } from '../../api/axiosClient'
import AccountNav from '../../components/layout/AccountNav'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { PageLoader } from '../../components/common/Spinner'
import { APPOINTMENT_STATUS } from '../../utils/constants'
import { formatDateTime, formatCurrency } from '../../utils/format'

export default function MyAppointmentsPage() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await appointmentApi.my({ status: status || undefined, page, size: 8 })
      setData(res.data)
    } catch {
      setData({ content: [], totalPages: 0 })
    } finally {
      setLoading(false)
    }
  }, [status, page])

  useEffect(() => { load() }, [load])

  const doCancel = async () => {
    setCancelling(true)
    try {
      await appointmentApi.updateStatus(cancelTarget.id, 'CANCELLED')
      toast.success('Đã hủy lịch hẹn')
      setCancelTarget(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Tài khoản của tôi</h1>
      <AccountNav />

      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-slate-500">Lọc:</span>
        <select className="select w-auto" value={status} onChange={(e) => { setStatus(e.target.value); setPage(0) }}>
          <option value="">Tất cả trạng thái</option>
          {Object.entries(APPOINTMENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {loading ? (
        <PageLoader />
      ) : data.content.length === 0 ? (
        <EmptyState icon={CalendarClock} title="Chưa có lịch hẹn nào"
          description="Khám phá các phòng trọ và đặt lịch xem ngay!"
          action={<Link to="/phong-tro" className="btn-primary">Tìm phòng</Link>} />
      ) : (
        <>
          <div className="space-y-3">
            {data.content.map((a) => {
              const canCancel = a.status === 'PENDING' || a.status === 'CONFIRMED'
              return (
                <div key={a.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <Link to={`/phong-tro/${a.post?.id}`} className="flex-1">
                    <p className="font-semibold text-slate-800 hover:text-primary-600">{a.post?.title || 'Tin đã xóa'}</p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin size={14} /> {a.post?.addressDetail} · {formatCurrency(a.post?.price)}/tháng
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-primary-600">
                      <CalendarClock size={14} /> {formatDateTime(a.appointmentDate)}
                    </p>
                    {a.note && <p className="mt-1 text-sm italic text-slate-400">"{a.note}"</p>}
                  </Link>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <StatusBadge meta={APPOINTMENT_STATUS[a.status]} />
                    {canCancel && (
                      <button className="btn-ghost btn-sm text-red-600 hover:bg-red-50" onClick={() => setCancelTarget(a)}>
                        <X size={14} /> Hủy
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={doCancel}
        title="Hủy lịch hẹn"
        message="Bạn chắc chắn muốn hủy lịch hẹn xem phòng này?"
        confirmText="Hủy lịch"
        danger
        loading={cancelling}
      />
    </div>
  )
}
