import { NavLink } from 'react-router-dom'
import { User, CalendarClock, Wallet } from 'lucide-react'

const TABS = [
  { to: '/tai-khoan/ho-so', label: 'Hồ sơ', icon: User },
  { to: '/tai-khoan/lich-hen', label: 'Lịch hẹn', icon: CalendarClock },
  { to: '/tai-khoan/vi', label: 'Ví tiền', icon: Wallet },
]

export default function AccountNav() {
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            `inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
              isActive ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`
          }
        >
          <t.icon size={16} /> {t.label}
        </NavLink>
      ))}
    </div>
  )
}
