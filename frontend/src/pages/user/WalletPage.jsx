import { useEffect, useState, useCallback } from 'react'
import { Wallet, Plus, Loader2, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import transactionApi from '../../api/transactionApi'
import { getErrorMessage } from '../../api/axiosClient'
import AccountNav from '../../components/layout/AccountNav'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import Modal from '../../components/common/Modal'
import { PageLoader } from '../../components/common/Spinner'
import { TRANSACTION_TYPE, TRANSACTION_STATUS } from '../../utils/constants'
import { formatCurrency, formatDateTime } from '../../utils/format'

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000]
const METHODS = ['VNPAY', 'MOMO', 'BANK_TRANSFER']

export default function WalletPage({ embedded = false }) {
  const { user, refreshProfile } = useAuth()
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [depositOpen, setDepositOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await transactionApi.my({ page, size: 8 })
      setData(res.data)
    } catch {
      setData({ content: [], totalPages: 0 })
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])
  useEffect(() => { refreshProfile() }, [refreshProfile])

  const onDeposited = () => {
    setDepositOpen(false)
    refreshProfile()
    setPage(0)
    load()
  }

  const Wrapper = embedded ? 'div' : 'div'

  return (
    <Wrapper className={embedded ? '' : 'mx-auto max-w-4xl px-4 py-8 sm:px-6'}>
      {!embedded && <h1 className="mb-6 text-2xl font-bold text-slate-900">Tài khoản của tôi</h1>}
      {!embedded && <AccountNav />}
      {embedded && <h1 className="mb-6 text-2xl font-bold text-slate-900">Ví tiền</h1>}

      {/* Balance card */}
      <div className="card mb-6 overflow-hidden">
        <div className="flex flex-col items-start justify-between gap-4 bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-white sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-primary-100"><Wallet size={18} /> Số dư khả dụng</p>
            <p className="mt-1 text-4xl font-extrabold">{formatCurrency(user?.balance)}</p>
          </div>
          <button onClick={() => setDepositOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50">
            <Plus size={18} /> Nạp tiền
          </button>
        </div>
      </div>

      {/* History */}
      <div className="card p-5">
        <h2 className="mb-4 font-semibold">Lịch sử giao dịch</h2>
        {loading ? (
          <PageLoader />
        ) : data.content.length === 0 ? (
          <EmptyState icon={Wallet} title="Chưa có giao dịch" description="Các giao dịch nạp tiền, mua VIP sẽ hiển thị ở đây." />
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {data.content.map((t) => {
                const isIncome = t.type === 'DEPOSIT'
                return (
                  <div key={t.id} className="flex items-center gap-3 py-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-primary-50 text-primary-600'}`}>
                      {isIncome ? <ArrowDownToLine size={18} /> : <ArrowUpFromLine size={18} />}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{t.description || TRANSACTION_TYPE[t.type]?.label}</p>
                      <p className="text-xs text-slate-400">{formatDateTime(t.createdAt)} · {t.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${isIncome ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                      </p>
                      <StatusBadge meta={TRANSACTION_STATUS[t.status]} />
                    </div>
                  </div>
                )
              })}
            </div>
            <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
          </>
        )}
      </div>

      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} onDone={onDeposited} />
    </Wrapper>
  )
}

function DepositModal({ open, onClose, onDone }) {
  const [amount, setAmount] = useState(100000)
  const [method, setMethod] = useState('VNPAY')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!amount || amount < 1000) {
      toast.error('Số tiền nạp tối thiểu 1.000đ')
      return
    }
    setLoading(true)
    try {
      await transactionApi.deposit({ amount: Number(amount), paymentMethod: method })
      toast.success('Nạp tiền thành công!')
      onDone()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nạp tiền vào ví"
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={loading}>Hủy</button>
          <button className="btn-primary" onClick={submit} disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : `Nạp ${formatCurrency(amount)}`}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label">Số tiền</label>
          <input type="number" className="input" value={amount} min={1000} step={1000} onChange={(e) => setAmount(e.target.value)} />
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((a) => (
              <button key={a} type="button" onClick={() => setAmount(a)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${Number(amount) === a ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-primary-300'}`}>
                {formatCurrency(a)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Phương thức thanh toán</label>
          <div className="grid grid-cols-3 gap-2">
            {METHODS.map((m) => (
              <button key={m} type="button" onClick={() => setMethod(m)}
                className={`rounded-lg border px-2 py-2 text-sm font-medium ${method === m ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-primary-300'}`}>
                {m === 'BANK_TRANSFER' ? 'Chuyển khoản' : m}
              </button>
            ))}
          </div>
        </div>
        <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
          * Đây là thanh toán giả lập cho mục đích demo — tiền sẽ được cộng ngay vào ví.
        </p>
      </div>
    </Modal>
  )
}
