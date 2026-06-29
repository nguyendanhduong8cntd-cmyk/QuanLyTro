import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const STORAGE_KEYS = {
  accessToken: 'qlt_access_token',
  refreshToken: 'qlt_refresh_token',
  user: 'qlt_user',
}

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // Serialize mang dang amenityIds=1&amenityIds=2 (khong co dau ngoac []) de khop @RequestParam Spring
  paramsSerializer: { indexes: null },
})

// Gan access token vao moi request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.accessToken)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.accessToken)
  localStorage.removeItem(STORAGE_KEYS.refreshToken)
  localStorage.removeItem(STORAGE_KEYS.user)
}

let isRefreshing = false
let pendingQueue = []

function processQueue(error, token = null) {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  pendingQueue = []
}

// Tu dong lam moi token khi gap 401
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const url = originalRequest?.url || ''

    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/register')

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken)
      if (!refreshToken) {
        clearSession()
        redirectToLogin()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Cho phien refresh dang chay
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return axiosClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
        const data = res.data?.data
        const newAccess = data.accessToken
        const newRefresh = data.refreshToken
        localStorage.setItem(STORAGE_KEYS.accessToken, newAccess)
        if (newRefresh) localStorage.setItem(STORAGE_KEYS.refreshToken, newRefresh)
        if (data.user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user))

        processQueue(null, newAccess)
        originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return axiosClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearSession()
        redirectToLogin()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

function redirectToLogin() {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

/** Lay message loi than thien tu response cua backend */
export function getErrorMessage(error, fallback = 'Đã có lỗi xảy ra, vui lòng thử lại') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  )
}

export default axiosClient
