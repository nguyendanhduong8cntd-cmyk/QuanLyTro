import axiosClient from './axiosClient'

const authApi = {
  login: (payload) => axiosClient.post('/auth/login', payload).then((r) => r.data),
  register: (payload) => axiosClient.post('/auth/register', payload).then((r) => r.data),
  refresh: (refreshToken) => axiosClient.post('/auth/refresh', { refreshToken }).then((r) => r.data),
}

export default authApi
