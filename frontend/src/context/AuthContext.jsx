import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import authApi from '../api/authApi'
import userApi from '../api/userApi'
import { STORAGE_KEYS } from '../api/axiosClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Khoi phuc phien tu localStorage khi tai trang
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.accessToken)
    const savedUser = localStorage.getItem(STORAGE_KEYS.user)
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem(STORAGE_KEYS.user)
      }
    }
    setLoading(false)
  }, [])

  const persistSession = useCallback((data) => {
    localStorage.setItem(STORAGE_KEYS.accessToken, data.accessToken)
    localStorage.setItem(STORAGE_KEYS.refreshToken, data.refreshToken)
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user))
    setUser(data.user)
  }, [])

  const login = useCallback(
    async (payload) => {
      const res = await authApi.login(payload)
      persistSession(res.data)
      return res.data.user
    },
    [persistSession]
  )

  const register = useCallback(
    async (payload) => {
      const res = await authApi.register(payload)
      persistSession(res.data)
      return res.data.user
    },
    [persistSession]
  )

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.accessToken)
    localStorage.removeItem(STORAGE_KEYS.refreshToken)
    localStorage.removeItem(STORAGE_KEYS.user)
    setUser(null)
  }, [])

  // Cap nhat thong tin user trong context (vd sau khi sua ho so / nap tien)
  const updateUser = useCallback((partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial }
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(next))
      return next
    })
  }, [])

  // Lay lai thong tin moi nhat (vd so du vi) tu server
  const refreshProfile = useCallback(async () => {
    try {
      const res = await userApi.getMe()
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(res.data))
      setUser(res.data)
      return res.data
    } catch {
      return null
    }
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    role: user?.role || null,
    login,
    register,
    logout,
    updateUser,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phai duoc dung trong AuthProvider')
  return ctx
}
