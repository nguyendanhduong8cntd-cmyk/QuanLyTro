import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './common/Spinner'

/**
 * Bao ve route theo dang nhap & vai tro.
 * @param {string[]} roles - danh sach vai tro duoc phep (bo trong = chi can dang nhap)
 */
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/403" replace />
  }

  return children
}
