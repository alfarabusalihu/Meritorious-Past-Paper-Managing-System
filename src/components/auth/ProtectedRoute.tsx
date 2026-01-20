import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireSuperAdmin?: boolean;
}

export function ProtectedRoute({ children, requireSuperAdmin = false }: ProtectedRouteProps) {
    const { user, loading, isAdmin, isSuperAdmin } = useAuth();
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

    if (requireSuperAdmin && !isSuperAdmin) {
        return <Navigate to="/admin" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
