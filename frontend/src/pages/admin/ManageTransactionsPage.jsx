import { useEffect, useState, useCallback } from 'react'
import { Receipt } from 'lucide-react'
import transactionApi from '../../api/transactionApi'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import { PageLoader } from '../../components/common/Spinner'
import { TRANSACTION_TYPE, TRANSACTION_STATUS } from '../../utils/constants'
import { formatCurrency, formatDateTime } from '../../utils/format'

export default function ManageTransactionsPage() {
  const [type, setType] = useState('')
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await transactionApi.admin({ type: type || undefined, page, size: 12 })
      setData(res.data)
    } catch {
      setData({ content: [], totalPages: 0 })
    } finally {
      setLoading(false)
    }
  }, [type, page])

  useEffect(() => { load() }, [load])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Giao dịch hệ thống</h1>
        <p className="text-sm text-slate-500">Toàn bộ giao dịch nạp tiền, mua VIP, thanh toán</p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-slate-500">Loại:</span>
        <select className="select w-auto" value={type} onChange={(e) => { setType(e.target.value); setPage(0) }}>
          <option value="">Tất cả</option>
          {Object.entries(TRANSACTION_TYPE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {loading ? (
        <PageLoader />
      ) : data.content.length === 0 ? (
        <EmptyState icon={Receipt} title="Chưa có giao dịch" />
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Người dùng</th>
                    <th className="px-4 py-3">Loại</th>
                    <th className="px-4 py-3">Số tiền</th>
                    <th className="px-4 py-3">Phương thức</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.content.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-400">#{t.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{t.userFullName || '—'}</td>
                      <td className="px-4 py-3"><StatusBadge meta={TRANSACTION_TYPE[t.type]} /></td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(t.amount)}</td>
                      <td className="px-4 py-3 text-slate-600">{t.paymentMethod}</td>
                      <td className="px-4 py-3"><StatusBadge meta={TRANSACTION_STATUS[t.status]} /></td>
                      <td className="px-4 py-3 text-slate-500">{formatDateTime(t.createdAt)}</td>
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
