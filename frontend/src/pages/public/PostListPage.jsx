import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, Search } from 'lucide-react'
import postApi from '../../api/postApi'
import PostCard from '../../components/post/PostCard'
import LocationSelect from '../../components/post/LocationSelect'
import AmenityCheckboxGroup from '../../components/post/AmenityCheckboxGroup'
import Pagination from '../../components/common/Pagination'
import { PageLoader } from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import { POST_TYPES } from '../../utils/constants'

const emptyFilter = {
  keyword: '', type: '', provinceId: '', districtId: '', wardId: '',
  minPrice: '', maxPrice: '', minArea: '', maxArea: '', amenityIds: [],
  sortBy: 'createdAt', sortDir: 'desc',
}

function cleanParams(obj) {
  const out = {}
  Object.entries(obj).forEach(([k, v]) => {
    if (v === '' || v === null || v === undefined) return
    if (Array.isArray(v) && v.length === 0) return
    out[k] = v
  })
  return out
}

export default function PostListPage() {
  const [searchParams] = useSearchParams()
  const [filter, setFilter] = useState({
    ...emptyFilter,
    keyword: searchParams.get('keyword') || '',
    type: searchParams.get('type') || '',
    provinceId: searchParams.get('provinceId') || '',
  })
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const fetchPosts = useCallback(async (currentFilter, currentPage) => {
    setLoading(true)
    try {
      const params = cleanParams({ ...currentFilter, page: currentPage, size: 12 })
      const res = await postApi.search(params)
      setData(res.data)
    } catch {
      setData({ content: [], totalElements: 0, totalPages: 0 })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(filter, page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const applyFilter = () => {
    setPage(0)
    fetchPosts(filter, 0)
    setMobileFilterOpen(false)
  }

  const resetFilter = () => {
    setFilter(emptyFilter)
    setPage(0)
    fetchPosts(emptyFilter, 0)
  }

  const setField = (k, v) => setFilter((f) => ({ ...f, [k]: v }))

  const FilterPanel = (
    <div className="space-y-5">
      <div>
        <label className="label">Từ khóa</label>
        <input className="input" placeholder="Tên tin, mô tả..." value={filter.keyword}
          onChange={(e) => setField('keyword', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilter()} />
      </div>

      <div>
        <label className="label">Loại hình</label>
        <select className="select" value={filter.type} onChange={(e) => setField('type', e.target.value)}>
          <option value="">Tất cả</option>
          {POST_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      <div>
        <label className="label">Khu vực</label>
        <LocationSelect
          compact
          value={{ provinceId: filter.provinceId, districtId: filter.districtId, wardId: filter.wardId }}
          onChange={(loc) => setFilter((f) => ({ ...f, ...loc }))}
        />
      </div>

      <div>
        <label className="label">Khoảng giá (đ/tháng)</label>
        <div className="flex items-center gap-2">
          <input type="number" className="input" placeholder="Từ" value={filter.minPrice} onChange={(e) => setField('minPrice', e.target.value)} />
          <span className="text-slate-400">-</span>
          <input type="number" className="input" placeholder="Đến" value={filter.maxPrice} onChange={(e) => setField('maxPrice', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label">Diện tích (m²)</label>
        <div className="flex items-center gap-2">
          <input type="number" className="input" placeholder="Từ" value={filter.minArea} onChange={(e) => setField('minArea', e.target.value)} />
          <span className="text-slate-400">-</span>
          <input type="number" className="input" placeholder="Đến" value={filter.maxArea} onChange={(e) => setField('maxArea', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label">Tiện ích</label>
        <AmenityCheckboxGroup value={filter.amenityIds} onChange={(ids) => setField('amenityIds', ids)} />
      </div>

      <div className="flex gap-2 pt-2">
        <button className="btn-primary flex-1" onClick={applyFilter}><Search size={16} /> Áp dụng</button>
        <button className="btn-ghost" onClick={resetFilter}>Xóa lọc</button>
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar desktop */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="card sticky top-20 p-5">
            <h3 className="mb-4 flex items-center gap-2 font-semibold"><SlidersHorizontal size={18} /> Bộ lọc</h3>
            {FilterPanel}
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Phòng trọ cho thuê</h1>
              <p className="text-sm text-slate-500">{data.totalElements} kết quả</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="select w-auto"
                value={`${filter.sortBy}:${filter.sortDir}`}
                onChange={(e) => {
                  const [sortBy, sortDir] = e.target.value.split(':')
                  const nf = { ...filter, sortBy, sortDir }
                  setFilter(nf)
                  setPage(0)
                  fetchPosts(nf, 0)
                }}
              >
                <option value="createdAt:desc">Mới nhất</option>
                <option value="price:asc">Giá thấp → cao</option>
                <option value="price:desc">Giá cao → thấp</option>
                <option value="area:desc">Diện tích lớn nhất</option>
              </select>
              <button className="btn-outline lg:hidden" onClick={() => setMobileFilterOpen(true)}>
                <SlidersHorizontal size={16} /> Lọc
              </button>
            </div>
          </div>

          {loading ? (
            <PageLoader />
          ) : data.content.length === 0 ? (
            <EmptyState title="Không tìm thấy phòng trọ" description="Thử thay đổi bộ lọc để có nhiều kết quả hơn." />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.content.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
              <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Bộ lọc</h3>
              <button onClick={() => setMobileFilterOpen(false)}><X size={22} className="text-slate-500" /></button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  )
}
