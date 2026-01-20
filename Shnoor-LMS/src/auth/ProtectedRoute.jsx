import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Loader2 } from 'lucide-react';
import brandLogo from '../assets/just_logo.jpeg';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { currentUser, userRole, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="relative">
                    <div className="absolute inset-0 bg-brand-200 rounded-full animate-ping opacity-25"></div>
                    <img src={brandLogo} alt="Loading" className="w-16 h-16 rounded-xl shadow-lg relative z-10" />
                </div>
                <div className="mt-8 flex items-center gap-2 text-brand-700 font-medium">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Verifying access...</span>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect to their appropriate dashboard if they try to access wrong area
        const dashboardMap = {
            admin: '/admin/dashboard',
            instructor: '/instructor/dashboard',
            student: '/student/dashboard'
        };
        return <Navigate to={dashboardMap[userRole] || '/login'} replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;