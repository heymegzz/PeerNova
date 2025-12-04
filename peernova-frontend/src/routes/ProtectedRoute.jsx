import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/states/LoadingSpinner';

function ProtectedRoute() {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (token === null) {
    // While checking (during SSR-like or very first mount), show spinner
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;


