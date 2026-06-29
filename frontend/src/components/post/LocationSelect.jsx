import { useEffect, useState } from 'react'
import locationApi from '../../api/locationApi'

/**
 * Bo chon dia diem 3 cap: Tinh -> Quan/Huyen -> Phuong/Xa.
 * value = { provinceId, districtId, wardId }; onChange tra ve object moi.
 * compact = hien thi ngang gon (cho bo loc).
 */
export default function LocationSelect({ value, onChange, compact = false, includeLabels = false }) {
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  useEffect(() => {
    locationApi.provinces().then((r) => setProvinces(r.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (value.provinceId) {
      locationApi.districts(value.provinceId).then((r) => setDistricts(r.data || [])).catch(() => setDistricts([]))
    } else {
      setDistricts([])
    }
  }, [value.provinceId])

  useEffect(() => {
    if (value.districtId) {
      locationApi.wards(value.districtId).then((r) => setWards(r.data || [])).catch(() => setWards([]))
    } else {
      setWards([])
    }
  }, [value.districtId])

  const handleProvince = (e) => onChange({ provinceId: e.target.value, districtId: '', wardId: '' })
  const handleDistrict = (e) => onChange({ ...value, districtId: e.target.value, wardId: '' })
  const handleWard = (e) => onChange({ ...value, wardId: e.target.value })

  const wrap = compact ? 'space-y-3' : 'grid gap-4 sm:grid-cols-3'

  return (
    <div className={wrap}>
      <div>
        {includeLabels && <label className="label">Tỉnh / Thành phố</label>}
        <select className="select" value={value.provinceId || ''} onChange={handleProvince}>
          <option value="">-- Tỉnh / Thành phố --</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div>
        {includeLabels && <label className="label">Quận / Huyện</label>}
        <select className="select" value={value.districtId || ''} onChange={handleDistrict} disabled={!value.provinceId}>
          <option value="">-- Quận / Huyện --</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>
      <div>
        {includeLabels && <label className="label">Phường / Xã</label>}
        <select className="select" value={value.wardId || ''} onChange={handleWard} disabled={!value.districtId}>
          <option value="">-- Phường / Xã --</option>
          {wards.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
