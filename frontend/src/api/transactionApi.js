import axiosClient from './axiosClient'

const transactionApi = {
  deposit: (payload) => axiosClient.post('/transactions/deposit', payload).then((r) => r.data),
  my: (params) => axiosClient.get('/transactions/my', { params }).then((r) => r.data),
  admin: (params) => axiosClient.get('/transactions/admin', { params }).then((r) => r.data),
}

export default transactionApi
