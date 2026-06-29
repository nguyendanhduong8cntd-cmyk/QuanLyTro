import { ChevronLeft, ChevronRight } from 'lucide-react'

/** page: 0-based. totalPages tu backend. */
export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null

  const current = page + 1 // hien thi 1-based
  const pages = []
  const start = Math.max(1, current - 2)
  const end = Math.min(totalPages, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)

  const go = (p1) => {
    const target = p1 - 1
    if (target >= 0 && target < totalPages && target !== page) onChange(target)
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-6">
      <button
        className="btn-ghost btn-sm disabled:opacity-40"
        disabled={page === 0}
        onClick={() => go(current - 1)}
      >
        <ChevronLeft size={16} />
      </button>
      {start > 1 && (
        <>
          <button className="btn-ghost btn-sm h-8 w-8 !px-0" onClick={() => go(1)}>1</button>
          {start > 2 && <span className="px-1 text-slate-400">…</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => go(p)}
          className={`h-8 w-8 rounded-md text-sm font-medium transition ${
            p === current ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-slate-400">…</span>}
          <button className="btn-ghost btn-sm h-8 w-8 !px-0" onClick={() => go(totalPages)}>
            {totalPages}
          </button>
        </>
      )}
      <button
        className="btn-ghost btn-sm disabled:opacity-40"
        disabled={page >= totalPages - 1}
        onClick={() => go(current + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
