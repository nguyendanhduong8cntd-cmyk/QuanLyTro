// Nhan hien thi cho cac enum tu backend

export const POST_TYPES = [
  { value: 'PHONG_TRO', label: 'Phòng trọ' },
  { value: 'NGUYEN_CAN', label: 'Nhà nguyên căn' },
  { value: 'CHUNG_CU_MINI', label: 'Chung cư mini' },
  { value: 'O_GHEP', label: 'Ở ghép' },
]

export const POST_TYPE_LABEL = Object.fromEntries(POST_TYPES.map((t) => [t.value, t.label]))

export const POST_STATUS = {
  PENDING: { label: 'Chờ duyệt', className: 'bg-amber-100 text-amber-700' },
  APPROVED: { label: 'Đã duyệt', className: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { label: 'Bị từ chối', className: 'bg-red-100 text-red-700' },
  RENTED: { label: 'Đã cho thuê', className: 'bg-slate-200 text-slate-700' },
}

export const APPOINTMENT_STATUS = {
  PENDING: { label: 'Chờ xác nhận', className: 'bg-amber-100 text-amber-700' },
  CONFIRMED: { label: 'Đã xác nhận', className: 'bg-primary-100 text-primary-700' },
  CANCELLED: { label: 'Đã hủy', className: 'bg-red-100 text-red-700' },
  DONE: { label: 'Hoàn thành', className: 'bg-emerald-100 text-emerald-700' },
}

export const TRANSACTION_TYPE = {
  DEPOSIT: { label: 'Nạp tiền', className: 'bg-emerald-100 text-emerald-700' },
  BUY_VIP: { label: 'Mua VIP', className: 'bg-primary-100 text-primary-700' },
  RENT_PAYMENT: { label: 'Thanh toán cọc', className: 'bg-amber-100 text-amber-700' },
}

export const TRANSACTION_STATUS = {
  PENDING: { label: 'Đang xử lý', className: 'bg-amber-100 text-amber-700' },
  SUCCESS: { label: 'Thành công', className: 'bg-emerald-100 text-emerald-700' },
  FAILED: { label: 'Thất bại', className: 'bg-red-100 text-red-700' },
}

export const ROLE_LABEL = {
  ADMIN: 'Quản trị viên',
  STAFF: 'Nhân viên',
  USER: 'Người dùng',
}

export const USER_STATUS = {
  ACTIVE: { label: 'Hoạt động', className: 'bg-emerald-100 text-emerald-700' },
  BLOCKED: { label: 'Đã khóa', className: 'bg-red-100 text-red-700' },
}

export const VIP_PRICE_PER_DAY = 10000
