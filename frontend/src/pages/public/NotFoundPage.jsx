import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary-500">
        <SearchX size={40} />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold text-slate-900">404</h1>
      <p className="mt-2 text-slate-500">Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <Link to="/" className="btn-primary mt-6">Về trang chủ</Link>
    </div>
  )
}
