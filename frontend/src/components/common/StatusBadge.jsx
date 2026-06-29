/** meta: { label, className } tu constants. */
export default function StatusBadge({ meta, fallback = '—' }) {
  if (!meta) return <span className="badge bg-slate-100 text-slate-600">{fallback}</span>
  return <span className={`badge ${meta.className}`}>{meta.label}</span>
}
