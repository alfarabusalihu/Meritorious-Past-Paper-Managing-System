import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading, isSuperAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (!isSuperAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
