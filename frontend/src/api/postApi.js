import axiosClient from './axiosClient'

const postApi = {
  search: (params) => axiosClient.get('/posts', { params }).then((r) => r.data),
  getById: (id) => axiosClient.get(`/posts/${id}`).then((r) => r.data),

  // AI: dan van ban -> trich xuat dien san form
  aiExtract: (text) => axiosClient.post('/posts/ai-extract', { text }).then((r) => r.data),

  // Staff / Admin
  myPosts: (params) => axiosClient.get('/posts/my', { params }).then((r) => r.data),
  adminSearch: (params) => axiosClient.get('/posts/admin', { params }).then((r) => r.data),
  create: (payload) => axiosClient.post('/posts', payload).then((r) => r.data),
  update: (id, payload) => axiosClient.put(`/posts/${id}`, payload).then((r) => r.data),
  remove: (id) => axiosClient.delete(`/posts/${id}`).then((r) => r.data),
  markRented: (id) => axiosClient.patch(`/posts/${id}/rented`).then((r) => r.data),
  buyVip: (id, days) => axiosClient.post(`/posts/${id}/vip`, { days }).then((r) => r.data),

  // Admin moderation
  approve: (id) => axiosClient.patch(`/posts/${id}/approve`).then((r) => r.data),
  reject: (id, reason) => axiosClient.patch(`/posts/${id}/reject`, { reason }).then((r) => r.data),
}

export default postApi
