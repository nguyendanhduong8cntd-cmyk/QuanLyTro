import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, UserCog, FileText, Clock, CheckCircle2, Home, CalendarClock, DollarSign, Crown, Wallet,
} from 'lucide-react'
import dashboardApi from '../../api/dashboardApi'
import StatCard from '../../components/common/StatCard'
import RevenueChart from '../../components/dashboard/RevenueChart'
import { PageLoader } from '../../components/common/Spinner'
import { formatCurrency } from '../../utils/format'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [revenue, setRevenue] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([dashboardApi.admin(), dashboardApi.revenue()])
      .then(([s, r]) => { setStats(s.data); setRevenue(r.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan hệ thống</h1>
        <p className="text-sm text-slate-500">Thống kê toàn bộ hoạt động của nền tảng</p>
      </div>

      {/* Revenue highlight */}
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <div className="card bg-gradient-to-br from-primary-600 to-primary-700 p-5 text-white">
          <p className="flex items-center gap-2 text-primary-100"><DollarSign size={18} /> Tổng doanh thu</p>
          <p className="mt-1 text-3xl font-extrabold">{formatCurrency(stats?.totalRevenue)}</p>
        </div>
        <StatCard icon={Crown} label="Doanh thu VIP" value={formatCurrency(stats?.revenueFromVip)} color="violet" />
        <StatCard icon={Wallet} label="Tổng nạp ví" value={formatCurrency(stats?.revenueFromDeposit)} color="emerald" />
      </div>

      {/* Counters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Tổng người dùng" value={stats?.totalUsers ?? 0} color="primary" />
        <StatCard icon={UserCog} label="Nhân viên" value={stats?.totalStaff ?? 0} color="violet" />
        <StatCard icon={FileText} label="Tổng tin đăng" value={stats?.totalPosts ?? 0} color="primary" />
        <StatCard icon={CalendarClock} label="Tổng lịch hẹn" value={stats?.totalAppointments ?? 0} color="emerald" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Clock} label="Tin chờ duyệt" value={stats?.pendingPosts ?? 0} color="amber" />
        <StatCard icon={CheckCircle2} label="Tin đã duyệt" value={stats?.approvedPosts ?? 0} color="emerald" />
        <StatCard icon={Home} label="Đã cho thuê" value={stats?.rentedPosts ?? 0} color="slate" />
        <StatCard icon={Users} label="Khách hàng" value={stats?.totalCustomers ?? 0} color="primary" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Doanh thu theo tháng ({revenue?.year})</h2>
            <span className="text-sm text-slate-500">Tổng: <b className="text-primary-600">{formatCurrency(revenue?.total)}</b></span>
          </div>
          <RevenueChart monthlyRevenue={revenue?.monthlyRevenue} />
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Cần xử lý</h2>
          <div className="space-y-2">
            <Link to="/admin/duyet-tin" className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm font-medium text-amber-800 hover:bg-amber-100">
              <span className="flex items-center gap-2"><Clock size={16} /> Tin chờ duyệt</span>
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">{stats?.pendingPosts ?? 0}</span>
            </Link>
            <Link to="/admin/nguoi-dung" className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Users size={16} /> Quản lý người dùng
            </Link>
            <Link to="/admin/giao-dich" className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <DollarSign size={16} /> Xem giao dịch
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
