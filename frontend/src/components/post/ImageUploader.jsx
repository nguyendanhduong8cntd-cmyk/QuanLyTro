import { useRef, useState } from 'react'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import fileApi from '../../api/fileApi'
import { getErrorMessage } from '../../api/axiosClient'
import { resolveImageUrl } from '../../utils/format'

/** value = string[] (image urls). onChange(nextUrls). */
export default function ImageUploader({ value = [], onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    try {
      const uploaded = []
      for (const f of files) {
        const res = await fileApi.upload(f)
        uploaded.push(res.data.url)
      }
      onChange([...value, ...uploaded])
      toast.success(`Đã tải lên ${uploaded.length} ảnh`)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Tải ảnh thất bại'))
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeAt = (idx) => onChange(value.filter((_, i) => i !== idx))

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {value.map((url, idx) => (
          <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200">
            <img src={resolveImageUrl(url)} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white opacity-0 transition group-hover:opacity-100"
            >
              <X size={14} />
            </button>
            {idx === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-primary-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                Ảnh bìa
              </span>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-primary-400 hover:text-primary-500"
        >
          {uploading ? <Loader2 size={22} className="animate-spin" /> : <UploadCloud size={22} />}
          <span className="text-xs font-medium">{uploading ? 'Đang tải...' : 'Thêm ảnh'}</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
      <p className="mt-2 text-xs text-slate-400">Ảnh đầu tiên sẽ là ảnh bìa. Định dạng jpg, png, webp.</p>
    </div>
  )
}
