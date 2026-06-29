import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, Phone, User, Check, X, CheckCheck, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import appointmentApi from '../../api/appointmentApi'
import { getErrorMessage } from '../../api/axiosClient'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import { PageLoader } from '../../components/common/Spinner'
import { APPOINTMENT_STATUS } from '../../utils/constants'
import { formatDateTime } from '../../utils/format'

export default function StaffAppointmentsPage() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await appointmentApi.staff({ status: status || undefined, page, size: 10 })
      setData(res.data)
    } catch {
      setData({ content: [], totalPages: 0 })
    } finally {
      setLoading(false)
    }
  }, [status, page])

  useEffect(() => { load() }, [load])

  const update = async (id, newStatus) => {
    setActingId(id)
    try {
      await appointmentApi.updateStatus(id, newStatus)
      toast.success('Cập nhật trạng thái thành công')
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setActingId(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Lịch hẹn xem phòng</h1>
        <p className="text-sm text-slate-500">Khách đặt lịch xem các tin đăng của bạn</p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-slate-500">Lọc:</span>
        <select className="select w-auto" value={status} onChange={(e) => { setStatus(e.target.value); setPage(0) }}>
          <option value="">Tất cả</option>
          {Object.entries(APPOINTMENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {loading ? (
        <PageLoader />
      ) : data.content.length === 0 ? (
        <EmptyState icon={CalendarClock} title="Chưa có lịch hẹn nào" />
      ) : (
        <>
          <div className="space-y-3">
            {data.content.map((a) => (
              <div key={a.id} className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <Link to={`/phong-tro/${a.post?.id}`} className="font-semibold text-slate-800 hover:text-primary-600">
                      {a.post?.title || 'Tin đã xóa'}
                    </Link>
                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-400">
                      <MapPin size={13} /> {a.post?.addressDetail}
                    </p>
                  </div>
                  <StatusBadge meta={APPOINTMENT_STATUS[a.status]} />
                </div>

                <div className="mt-3 grid gap-2 rounded-lg bg-slate-50 p-3 text-sm sm:grid-cols-3">
                  <span className="flex items-center gap-1.5 text-slate-600"><User size={14} /> {a.customer?.fullName}</span>
                  <a href={`tel:${a.customer?.phone}`} className="flex items-center gap-1.5 text-primary-600"><Phone size={14} /> {a.customer?.phone}</a>
                  <span className="flex items-center gap-1.5 text-slate-600"><CalendarClock size={14} /> {formatDateTime(a.appointmentDate)}</span>
                </div>
                {a.note && <p className="mt-2 text-sm italic text-slate-500">"{a.note}"</p>}

                {(a.status === 'PENDING' || a.status === 'CONFIRMED') && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    {a.status === 'PENDING' && (
                      <button className="btn-success btn-sm" disabled={actingId === a.id} onClick={() => update(a.id, 'CONFIRMED')}>
                        <Check size={14} /> Xác nhận
                      </button>
                    )}
                    {a.status === 'CONFIRMED' && (
                      <button className="btn-primary btn-sm" disabled={actingId === a.id} onClick={() => update(a.id, 'DONE')}>
                        <CheckCheck size={14} /> Hoàn thành
                      </button>
                    )}
                    <button className="btn-ghost btn-sm text-red-600 hover:bg-red-50" disabled={actingId === a.id} onClick={() => update(a.id, 'CANCELLED')}>
                      <X size={14} /> Hủy
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
