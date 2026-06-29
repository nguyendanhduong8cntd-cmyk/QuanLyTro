import axiosClient from './axiosClient'

const dashboardApi = {
  admin: () => axiosClient.get('/dashboard/admin').then((r) => r.data),
  staff: () => axiosClient.get('/dashboard/staff').then((r) => r.data),
  revenue: (year) =>
    axiosClient.get('/dashboard/revenue', { params: year ? { year } : {} }).then((r) => r.data),
}

export default dashboardApi
