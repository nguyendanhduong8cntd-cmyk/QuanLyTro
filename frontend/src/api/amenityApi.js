import axiosClient from './axiosClient'

const amenityApi = {
  getAll: () => axiosClient.get('/amenities').then((r) => r.data),
  create: (payload) => axiosClient.post('/amenities', payload).then((r) => r.data),
  update: (id, payload) => axiosClient.put(`/amenities/${id}`, payload).then((r) => r.data),
  remove: (id) => axiosClient.delete(`/amenities/${id}`).then((r) => r.data),
}

export default amenityApi
