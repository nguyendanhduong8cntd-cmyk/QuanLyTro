import { Home, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Home size={20} />
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              Trọ<span className="text-primary-600">Tốt</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Nền tảng tìm kiếm phòng trọ, nhà nguyên căn, chung cư mini nhanh chóng và uy tín.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Khám phá</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link to="/phong-tro" className="hover:text-primary-600">Tìm phòng trọ</Link></li>
            <li><Link to="/phong-tro?type=NGUYEN_CAN" className="hover:text-primary-600">Nhà nguyên căn</Link></li>
            <li><Link to="/phong-tro?type=CHUNG_CU_MINI" className="hover:text-primary-600">Chung cư mini</Link></li>
            <li><Link to="/phong-tro?type=O_GHEP" className="hover:text-primary-600">Ở ghép</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link to="/login" className="hover:text-primary-600">Đăng nhập</Link></li>
            <li><Link to="/register" className="hover:text-primary-600">Đăng ký</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Liên hệ</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li className="flex items-center gap-2"><Mail size={15} /> contact@goldenboat.io</li>
            <li className="flex items-center gap-2"><Phone size={15} /> 1900 1234</li>
            <li className="flex items-center gap-2"><MapPin size={15} /> Hà Nội, Việt Nam</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} TrọTốt. Đồ án Quản Lý Trọ.
      </div>
    </footer>
  )
}
