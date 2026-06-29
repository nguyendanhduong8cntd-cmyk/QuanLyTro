import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, User, Phone, Building2 } from 'lucide-react'
import appointmentApi from '../../api/appointmentApi'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import { PageLoader } from '../../components/common/Spinner'
import { APPOINTMENT_STATUS } from '../../utils/constants'
import { formatDateTime } from '../../utils/format'

export default function AdminAppointmentsPage() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await appointmentApi.admin({ page, size: 12 })
      setData(res.data)
    } catch {
      setData({ content: [], totalPages: 0 })
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Tất cả lịch hẹn</h1>
        <p className="text-sm text-slate-500">Lịch hẹn xem phòng trên toàn hệ thống</p>
      </div>

      {loading ? (
        <PageLoader />
      ) : data.content.length === 0 ? (
        <EmptyState icon={CalendarClock} title="Chưa có lịch hẹn" />
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Bài đăng</th>
                    <th className="px-4 py-3">Khách hàng</th>
                    <th className="px-4 py-3">Thời gian hẹn</th>
                    <th className="px-4 py-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.content.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <Link to={`/phong-tro/${a.post?.id}`} className="flex items-center gap-2 font-medium text-slate-700 hover:text-primary-600">
                          <Building2 size={15} className="shrink-0 text-slate-400" />
                          <span className="line-clamp-1">{a.post?.title || 'Tin đã xóa'}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="flex items-center gap-1.5 text-slate-700"><User size={14} /> {a.customer?.fullName}</p>
                        <p className="flex items-center gap-1.5 text-xs text-slate-400"><Phone size={12} /> {a.customer?.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatDateTime(a.appointmentDate)}</td>
                      <td className="px-4 py-3"><StatusBadge meta={APPOINTMENT_STATUS[a.status]} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
