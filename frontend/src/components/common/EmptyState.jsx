import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title = 'Không có dữ liệu', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-500">
        <Icon size={28} />
      </div>
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
