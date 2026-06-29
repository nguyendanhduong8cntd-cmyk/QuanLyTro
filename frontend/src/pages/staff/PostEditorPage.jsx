import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, Loader2, ChevronLeft, Sparkles, Wand2 } from 'lucide-react'
import toast from 'react-hot-toast'
import postApi from '../../api/postApi'
import { getErrorMessage } from '../../api/axiosClient'
import LocationSelect from '../../components/post/LocationSelect'
import AmenityCheckboxGroup from '../../components/post/AmenityCheckboxGroup'
import ImageUploader from '../../components/post/ImageUploader'
import { PageLoader } from '../../components/common/Spinner'
import { POST_TYPES } from '../../utils/constants'

const initialForm = {
  title: '', description: '', price: '', area: '', addressDetail: '', type: 'PHONG_TRO',
  provinceId: '', districtId: '', wardId: '', amenityIds: [], imageUrls: [],
}

export default function PostEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    postApi.getById(id)
      .then((r) => {
        const p = r.data
        setForm({
          title: p.title, description: p.description, price: p.price, area: p.area,
          addressDetail: p.addressDetail, type: p.type,
          provinceId: p.province?.id || '', districtId: p.district?.id || '', wardId: p.ward?.id || '',
          amenityIds: (p.amenities || []).map((a) => a.id),
          imageUrls: p.images || [],
        })
      })
      .catch(() => toast.error('Không tải được tin đăng'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const runAi = async () => {
    if (!aiText.trim()) {
      toast.error('Vui lòng dán nội dung tin đăng')
      return
    }
    setAiLoading(true)
    try {
      const res = await postApi.aiExtract(aiText)
      const d = res.data
      setForm((f) => ({
        ...f,
        title: d.title || f.title,
        description: d.description || f.description,
        price: d.price ?? f.price,
        area: d.area ?? f.area,
        addressDetail: d.addressDetail || f.addressDetail,
        type: d.type || f.type,
        provinceId: d.province?.id || '',
        districtId: d.district?.id || '',
        wardId: d.ward?.id || '',
        amenityIds: d.amenityIds || [],
      }))
      toast.success(d.note || 'AI đã điền sẵn form, vui lòng rà soát')
      if (d.unmatched?.length) {
        toast(`Chưa khớp tự động: ${d.unmatched.join(' · ')}`, { icon: '⚠️', duration: 6000 })
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Phân tích AI thất bại'))
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.provinceId || !form.districtId || !form.wardId) {
      toast.error('Vui lòng chọn đầy đủ khu vực (Tỉnh / Quận / Phường)')
      return
    }
    if (form.imageUrls.length === 0) {
      toast.error('Vui lòng tải lên ít nhất 1 ảnh')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        area: Number(form.area),
      }
      if (isEdit) {
        await postApi.update(id, payload)
        toast.success('Cập nhật tin thành công (tin sẽ được duyệt lại)')
      } else {
        await postApi.create(payload)
        toast.success('Đăng tin thành công, vui lòng chờ duyệt')
      }
      navigate('/staff/tin-dang')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600">
        <ChevronLeft size={16} /> Quay lại
      </button>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">{isEdit ? 'Chỉnh sửa tin đăng' : 'Đăng tin mới'}</h1>

      {!isEdit && (
        <div className="mb-6 rounded-xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-5 shadow-card">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Sparkles size={18} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-800">Đăng tin nhanh bằng AI</h2>
              <p className="text-xs text-slate-500">Dán nguyên đoạn tin (Facebook/Zalo...) → AI tự điền form bên dưới</p>
            </div>
          </div>
          <textarea
            className="input"
            rows={4}
            placeholder="VD: Cho thuê phòng trọ 25m2 khép kín, full nội thất, có điều hòa máy giặt wifi, gần ĐH Bách Khoa, giá 3tr5/tháng, địa chỉ số 12 ngõ 34 Tạ Quang Bửu, Hà Nội..."
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <button type="button" className="btn-primary" onClick={runAi} disabled={aiLoading}>
              {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <><Wand2 size={16} /> Phân tích & điền form</>}
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thong tin co ban */}
        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Thông tin cơ bản</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Tiêu đề *</label>
              <input className="input" placeholder="VD: Phòng trọ giá rẻ gần ĐH Bách Khoa" value={form.title} onChange={(e) => set('title', e.target.value)} required maxLength={255} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">Loại hình *</label>
                <select className="select" value={form.type} onChange={(e) => set('type', e.target.value)}>
                  {POST_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Giá thuê (đ/tháng) *</label>
                <input type="number" className="input" placeholder="2500000" value={form.price} onChange={(e) => set('price', e.target.value)} required min={1} />
              </div>
              <div>
                <label className="label">Diện tích (m²) *</label>
                <input type="number" className="input" placeholder="25" value={form.area} onChange={(e) => set('area', e.target.value)} required min={1} step="0.1" />
              </div>
            </div>
            <div>
              <label className="label">Mô tả chi tiết *</label>
              <textarea className="input" rows={5} placeholder="Mô tả về phòng, nội thất, môi trường xung quanh..." value={form.description} onChange={(e) => set('description', e.target.value)} required />
            </div>
          </div>
        </div>

        {/* Dia chi */}
        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Địa chỉ</h2>
          <div className="space-y-4">
            <LocationSelect
              includeLabels
              value={{ provinceId: form.provinceId, districtId: form.districtId, wardId: form.wardId }}
              onChange={(loc) => setForm((f) => ({ ...f, ...loc }))}
            />
            <div>
              <label className="label">Địa chỉ chi tiết (số nhà, tên đường) *</label>
              <input className="input" placeholder="VD: Số 12, ngõ 34 đường Trần Phú" value={form.addressDetail} onChange={(e) => set('addressDetail', e.target.value)} required />
            </div>
          </div>
        </div>

        {/* Tien ich */}
        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Tiện ích</h2>
          <AmenityCheckboxGroup value={form.amenityIds} onChange={(ids) => set('amenityIds', ids)} />
        </div>

        {/* Hinh anh */}
        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Hình ảnh *</h2>
          <ImageUploader value={form.imageUrls} onChange={(urls) => set('imageUrls', urls)} />
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" className="btn-ghost" onClick={() => navigate('/staff/tin-dang')}>Hủy</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> {isEdit ? 'Lưu thay đổi' : 'Đăng tin'}</>}
          </button>
        </div>
      </form>
    </div>
  )
}
