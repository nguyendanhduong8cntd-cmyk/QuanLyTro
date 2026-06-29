export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-[3px]',
  }
  return (
    <span
      className={`inline-block animate-spin rounded-full border-primary-600 border-t-transparent ${sizes[size]} ${className}`}
      role="status"
      aria-label="loading"
    />
  )
}

export function PageLoader({ label = 'Đang tải...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
      <Spinner size="lg" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
