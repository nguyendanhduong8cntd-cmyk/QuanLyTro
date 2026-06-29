import axiosClient from './axiosClient'

const locationApi = {
  provinces: () => axiosClient.get('/locations/provinces').then((r) => r.data),
  districts: (provinceId) =>
    axiosClient.get(`/locations/provinces/${provinceId}/districts`).then((r) => r.data),
  wards: (districtId) =>
    axiosClient.get(`/locations/districts/${districtId}/wards`).then((r) => r.data),
}

export default locationApi
