import { Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'

export default function ForbiddenPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
        <ShieldX size={40} />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold text-slate-900">403</h1>
      <p className="mt-2 text-slate-500">Bạn không có quyền truy cập trang này.</p>
      <Link to="/" className="btn-primary mt-6">Về trang chủ</Link>
    </div>
  )
}
