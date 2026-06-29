import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  MapPin, Maximize, Crown, Phone, User, CalendarClock, ImageOff, ChevronLeft, Tag, Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import postApi from '../../api/postApi'
import appointmentApi from '../../api/appointmentApi'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage } from '../../api/axiosClient'
import { PageLoader } from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import { formatCurrency, formatDate, resolveImageUrl, toDateTimeLocalValue } from '../../utils/format'
import { POST_TYPE_LABEL } from '../../utils/constants'

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [bookingOpen, setBookingOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    postApi.getById(id)
      .then((r) => { setPost(r.data); setActiveImg(0) })
      .catch(() => setPost(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageLoader />
  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-xl font-semibold">Không tìm thấy tin đăng</h2>
        <Link to="/phong-tro" className="btn-primary mt-4">Quay lại danh sách</Link>
      </div>
    )
  }

  const images = post.images || []
  const cover = resolveImageUrl(images[activeImg])
  const location = [post.addressDetail, post.ward?.name, post.district?.name, post.province?.name].filter(Boolean).join(', ')
  const isOwner = user && post.staff && user.id === post.staff.id

  const openBooking = () => {
    if (!isAuthenticated) {
      toast('Vui lòng đăng nhập để đặt lịch', { icon: '🔒' })
      navigate('/login')
      return
    }
    setBookingOpen(true)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600">
        <ChevronLeft size={16} /> Quay lại
      </button>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Left */}
        <div>
          {/* Gallery */}
          <div className="overflow-hidden rounded-2xl bg-slate-100">
            <div className="relative aspect-[16/10]">
              {cover ? (
                <img src={cover} alt={post.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300"><ImageOff size={56} /></div>
              )}
              {post.isVip && (
                <span className="badge absolute left-3 top-3 bg-amber-400 text-amber-950"><Crown size={12} /> VIP</span>
              )}
            </div>
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 ${idx === activeImg ? 'border-primary-600' : 'border-transparent'}`}
                >
                  <img src={resolveImageUrl(img)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Info */}
          <div className="mt-6">
            <span className="badge bg-primary-50 text-primary-700"><Tag size={12} /> {POST_TYPE_LABEL[post.type]}</span>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">{post.title}</h1>
            <p className="mt-2 flex items-start gap-1.5 text-slate-500">
              <MapPin size={18} className="mt-0.5 shrink-0" /> {location}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
              <Stat label="Giá thuê" value={`${formatCurrency(post.price)}/tháng`} highlight />
              <Stat label="Diện tích" value={`${Number(post.area)} m²`} />
              <Stat label="Ngày đăng" value={formatDate(post.createdAt)} />
            </div>

            {post.amenities?.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 font-semibold">Tiện ích</h3>
                <div className="flex flex-wrap gap-2">
                  {post.amenities.map((a) => (
                    <span key={a.id} className="badge bg-primary-50 text-primary-700">{a.name}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="mb-3 font-semibold">Mô tả chi tiết</h3>
              <p className="whitespace-pre-line leading-relaxed text-slate-600">{post.description}</p>
            </div>
          </div>
        </div>

        {/* Right - contact */}
        <div>
          <div className="card sticky top-20 p-5">
            <p className="text-sm text-slate-500">Giá thuê</p>
            <p className="text-3xl font-extrabold text-primary-600">{formatCurrency(post.price)}</p>
            <p className="text-sm text-slate-400">mỗi tháng</p>

            <div className="my-5 border-t border-slate-100" />

            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">
                {post.staff?.fullName?.charAt(0)?.toUpperCase() || <User size={20} />}
              </span>
              <div>
                <p className="text-xs text-slate-400">Người đăng tin</p>
                <p className="font-semibold text-slate-800">{post.staff?.fullName || 'Ẩn danh'}</p>
              </div>
            </div>

            {post.staff?.phone && (
              <a href={`tel:${post.staff.phone}`} className="btn-outline mt-4 w-full">
                <Phone size={16} /> {post.staff.phone}
              </a>
            )}

            {!isOwner && (
              <button onClick={openBooking} className="btn-primary mt-3 w-full">
                <CalendarClock size={16} /> Đặt lịch xem phòng
              </button>
            )}
            {isOwner && (
              <p className="mt-3 rounded-lg bg-slate-50 p-3 text-center text-sm text-slate-500">
                Đây là tin đăng của bạn
              </p>
            )}
          </div>
        </div>
      </div>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} post={post} />
    </div>
  )
}

function Stat({ label, value, highlight }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-0.5 font-semibold ${highlight ? 'text-primary-600' : 'text-slate-800'}`}>{value}</p>
    </div>
  )
}

function BookingModal({ open, onClose, post }) {
  const [date, setDate] = useState(toDateTimeLocalValue(new Date(Date.now() + 86400000)))
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      await appointmentApi.create({ postId: post.id, appointmentDate: date, note })
      toast.success('Đặt lịch thành công! Chủ nhà sẽ liên hệ với bạn.')
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Đặt lịch thất bại'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Đặt lịch xem phòng"
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={loading}>Hủy</button>
          <button className="btn-primary" onClick={submit} disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Xác nhận đặt lịch'}
          </button>
        </>
      }
    >
      <p className="mb-4 rounded-lg bg-primary-50 p-3 text-sm text-primary-700">{post.title}</p>
      <div className="space-y-4">
        <div>
          <label className="label">Thời gian mong muốn</label>
          <input type="datetime-local" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="label">Ghi chú (tùy chọn)</label>
          <textarea className="input" rows={3} placeholder="Lời nhắn cho chủ nhà..." value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>
    </Modal>
  )
}
