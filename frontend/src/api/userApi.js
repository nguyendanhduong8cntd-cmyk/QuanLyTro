import axiosClient from './axiosClient'

const userApi = {
  getMe: () => axiosClient.get('/users/me').then((r) => r.data),
  updateMe: (payload) => axiosClient.put('/users/me', payload).then((r) => r.data),
  changePassword: (payload) => axiosClient.put('/users/me/password', payload).then((r) => r.data),

  // Admin
  search: (params) => axiosClient.get('/users', { params }).then((r) => r.data),
  getById: (id) => axiosClient.get(`/users/${id}`).then((r) => r.data),
  create: (payload) => axiosClient.post('/users', payload).then((r) => r.data),
  update: (id, payload) => axiosClient.put(`/users/${id}`, payload).then((r) => r.data),
  remove: (id) => axiosClient.delete(`/users/${id}`).then((r) => r.data),
}

export default userApi
