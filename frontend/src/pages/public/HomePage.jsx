import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, MapPin, Building2, Home as HomeIcon, Users, Sparkles, ShieldCheck, Clock } from 'lucide-react'
import postApi from '../../api/postApi'
import locationApi from '../../api/locationApi'
import PostCard from '../../components/post/PostCard'
import { PageLoader } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import { POST_TYPES } from '../../utils/constants'

const CATEGORIES = [
  { type: 'PHONG_TRO', label: 'Phòng trọ', icon: HomeIcon, color: 'bg-primary-50 text-primary-600' },
  { type: 'NGUYEN_CAN', label: 'Nhà nguyên căn', icon: Building2, color: 'bg-emerald-50 text-emerald-600' },
  { type: 'CHUNG_CU_MINI', label: 'Chung cư mini', icon: Building2, color: 'bg-amber-50 text-amber-600' },
  { type: 'O_GHEP', label: 'Ở ghép', icon: Users, color: 'bg-rose-50 text-rose-600' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [provinces, setProvinces] = useState([])
  const [search, setSearch] = useState({ keyword: '', provinceId: '', type: '' })
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    locationApi.provinces().then((r) => setProvinces(r.data || [])).catch(() => {})
    postApi
      .search({ page: 0, size: 8, sortBy: 'createdAt', sortDir: 'desc' })
      .then((r) => setPosts(r.data?.content || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.keyword) params.set('keyword', search.keyword)
    if (search.provinceId) params.set('provinceId', search.provinceId)
    if (search.type) params.set('type', search.type)
    navigate(`/phong-tro?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Tìm phòng trọ ưng ý <br className="hidden sm:block" /> chỉ trong vài phút
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-primary-100 sm:text-lg">
            Hàng nghìn tin đăng phòng trọ, nhà nguyên căn, chung cư mini trên toàn quốc.
          </p>

          {/* Search box */}
          <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-4xl rounded-2xl bg-white p-3 shadow-xl">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  className="input border-0 pl-10 focus:ring-0"
                  placeholder="Bạn muốn tìm gì? (từ khóa)"
                  value={search.keyword}
                  onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                />
              </div>
              <select
                className="select min-w-[160px] border-0 text-slate-600 focus:ring-0"
                value={search.provinceId}
                onChange={(e) => setSearch({ ...search, provinceId: e.target.value })}
              >
                <option value="">Toàn quốc</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                className="select min-w-[150px] border-0 text-slate-600 focus:ring-0"
                value={search.type}
                onChange={(e) => setSearch({ ...search, type: e.target.value })}
              >
                <option value="">Mọi loại hình</option>
                {POST_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <button type="submit" className="btn-primary px-6">
                <Search size={18} /> Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.type}
              to={`/phong-tro?type=${c.type}`}
              className="card flex flex-col items-center gap-3 p-6 transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span className={`flex h-14 w-14 items-center justify-center rounded-xl ${c.color}`}>
                <c.icon size={26} />
              </span>
              <span className="font-semibold text-slate-700">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest posts */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Tin đăng mới nhất</h2>
            <p className="mt-1 text-sm text-slate-500">Những phòng trọ vừa được đăng tải</p>
          </div>
          <Link to="/phong-tro" className="btn-outline btn-sm">Xem tất cả</Link>
        </div>

        {loading ? (
          <PageLoader />
        ) : posts.length === 0 ? (
          <EmptyState title="Chưa có tin đăng" description="Hãy quay lại sau nhé!" />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900">Vì sao chọn TrọTốt?</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Feature icon={ShieldCheck} title="Tin đã kiểm duyệt" desc="Mọi tin đăng đều được quản trị viên xét duyệt trước khi hiển thị." />
          <Feature icon={Sparkles} title="Tiện ích rõ ràng" desc="Lọc nhanh theo wifi, điều hòa, máy giặt... đúng nhu cầu của bạn." />
          <Feature icon={Clock} title="Đặt lịch dễ dàng" desc="Đặt lịch xem phòng trực tuyến chỉ với vài thao tác." />
        </div>
      </section>
    </div>
  )
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="card p-6 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        <Icon size={26} />
      </span>
      <h3 className="mt-4 font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>
    </div>
  )
}
