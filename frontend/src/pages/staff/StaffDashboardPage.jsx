import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Clock, CheckCircle2, Home, CalendarClock, Wallet, Crown, PlusSquare,
} from 'lucide-react'
import dashboardApi from '../../api/dashboardApi'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/common/StatCard'
import RevenueChart from '../../components/dashboard/RevenueChart'
import { PageLoader } from '../../components/common/Spinner'
import { formatCurrency } from '../../utils/format'

export default function StaffDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [revenue, setRevenue] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([dashboardApi.staff(), dashboardApi.revenue()])
      .then(([s, r]) => { setStats(s.data); setRevenue(r.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Xin chào, {user?.fullName} 👋</h1>
          <p className="text-sm text-slate-500">Tổng quan hoạt động tin đăng của bạn</p>
        </div>
        <Link to="/staff/dang-tin" className="btn-primary"><PlusSquare size={18} /> Đăng tin mới</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Tổng tin đăng" value={stats?.myPosts ?? 0} color="primary" />
        <StatCard icon={Clock} label="Chờ duyệt" value={stats?.myPendingPosts ?? 0} color="amber" />
        <StatCard icon={CheckCircle2} label="Đã duyệt" value={stats?.myApprovedPosts ?? 0} color="emerald" />
        <StatCard icon={Home} label="Đã cho thuê" value={stats?.myRentedPosts ?? 0} color="slate" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Wallet} label="Số dư ví" value={formatCurrency(stats?.balance)} color="primary" />
        <StatCard icon={Crown} label="Đã chi cho VIP" value={formatCurrency(stats?.totalSpentVip)} color="violet" />
        <StatCard icon={CalendarClock} label="Lịch hẹn chờ" value={stats?.myPendingAppointments ?? 0} color="amber" />
        <StatCard icon={CalendarClock} label="Tổng lịch hẹn" value={stats?.myTotalAppointments ?? 0} color="emerald" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Chi tiêu theo tháng ({revenue?.year})</h2>
            <span className="text-sm text-slate-500">Tổng: <b className="text-primary-600">{formatCurrency(revenue?.total)}</b></span>
          </div>
          <RevenueChart monthlyRevenue={revenue?.monthlyRevenue} />
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Lối tắt</h2>
          <div className="space-y-2">
            <QuickLink to="/staff/dang-tin" icon={PlusSquare} label="Đăng tin mới" />
            <QuickLink to="/staff/tin-dang" icon={FileText} label="Quản lý tin đăng" />
            <QuickLink to="/staff/lich-hen" icon={CalendarClock} label="Lịch hẹn xem phòng" />
            <QuickLink to="/staff/vi" icon={Wallet} label="Nạp tiền vào ví" />
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickLink({ to, icon: Icon, label }) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700">
      <Icon size={18} /> {label}
    </Link>
  )
}
