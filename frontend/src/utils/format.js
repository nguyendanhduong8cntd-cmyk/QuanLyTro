// Cac ham dinh dang hien thi

export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '0 đ'
  const num = Number(value)
  if (Number.isNaN(num)) return '0 đ'
  return num.toLocaleString('vi-VN') + ' đ'
}

/** Rut gon gia: 2.500.000 -> 2,5 triệu/tháng */
export function formatPriceShort(value) {
  const num = Number(value) || 0
  if (num >= 1_000_000) {
    const trieu = num / 1_000_000
    return `${trieu % 1 === 0 ? trieu : trieu.toFixed(1).replace('.', ',')} triệu`
  }
  if (num >= 1000) return `${Math.round(num / 1000)} nghìn`
  return num.toLocaleString('vi-VN')
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDateTime(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Chuyen URL anh tuong doi tu backend (/api/files/x) thanh URL day du */
export function resolveImageUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  const origin = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/api$/, '')
  return origin + url
}

/** Lay datetime-local string (yyyy-MM-ddTHH:mm) tu Date */
export function toDateTimeLocalValue(date) {
  const d = date || new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
