import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import amenityApi from '../../api/amenityApi'

/** value = number[] (amenity ids). onChange(nextIds). */
export default function AmenityCheckboxGroup({ value = [], onChange }) {
  const [amenities, setAmenities] = useState([])

  useEffect(() => {
    amenityApi.getAll().then((r) => setAmenities(r.data || [])).catch(() => {})
  }, [])

  const toggle = (id) => {
    if (value.includes(id)) onChange(value.filter((x) => x !== id))
    else onChange([...value, id])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {amenities.map((a) => {
        const active = value.includes(a.id)
        return (
          <button
            type="button"
            key={a.id}
            onClick={() => toggle(a.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              active
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            {active && <Check size={14} />}
            {a.name}
          </button>
        )
      })}
      {amenities.length === 0 && <p className="text-sm text-slate-400">Đang tải tiện ích...</p>}
    </div>
  )
}
