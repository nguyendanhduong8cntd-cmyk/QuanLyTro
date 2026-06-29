import { Link } from 'react-router-dom'
import { MapPin, Maximize, Crown, ImageOff } from 'lucide-react'
import { formatPriceShort, resolveImageUrl } from '../../utils/format'
import { POST_TYPE_LABEL } from '../../utils/constants'

export default function PostCard({ post }) {
  const thumb = resolveImageUrl(post.images?.[0])
  const location = [post.ward?.name, post.district?.name, post.province?.name].filter(Boolean).join(', ')

  return (
    <Link
      to={`/phong-tro/${post.id}`}
      className="group card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {thumb ? (
          <img
            src={thumb}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ImageOff size={40} />
          </div>
        )}
        {post.isVip && (
          <span className="badge absolute left-2.5 top-2.5 bg-amber-400 text-amber-950 shadow">
            <Crown size={12} /> VIP
          </span>
        )}
        <span className="badge absolute right-2.5 top-2.5 bg-white/90 text-slate-700 backdrop-blur">
          {POST_TYPE_LABEL[post.type] || post.type}
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 min-h-[2.6rem] font-semibold text-slate-800 group-hover:text-primary-600">
          {post.title}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">{formatPriceShort(post.price)}/tháng</span>
          <span className="inline-flex items-center gap-1 text-sm text-slate-500">
            <Maximize size={14} /> {Number(post.area)} m²
          </span>
        </div>
        <p className="mt-2 line-clamp-2 flex items-start gap-1 text-sm text-slate-500">
          <MapPin size={14} className="mt-0.5 shrink-0" /> {location || 'Chưa cập nhật địa chỉ'}
        </p>
      </div>
    </Link>
  )
}
