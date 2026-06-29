import axiosClient from './axiosClient'

const fileApi = {
  upload: (file) => {
    const form = new FormData()
    form.append('file', file)
    return axiosClient
      .post('/files/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data)
  },
  uploadMultiple: (files) => {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    return axiosClient
      .post('/files/upload-multiple', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data)
  },
}

export default fileApi
