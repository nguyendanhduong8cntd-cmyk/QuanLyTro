import axiosClient from './axiosClient'

const appointmentApi = {
  create: (payload) => axiosClient.post('/appointments', payload).then((r) => r.data),
  my: (params) => axiosClient.get('/appointments/my', { params }).then((r) => r.data),
  staff: (params) => axiosClient.get('/appointments/staff', { params }).then((r) => r.data),
  admin: (params) => axiosClient.get('/appointments/admin', { params }).then((r) => r.data),
  updateStatus: (id, status) =>
    axiosClient.patch(`/appointments/${id}/status`, { status }).then((r) => r.data),
}

export default appointmentApi
