import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
    const token = localStorage.getItem("token");

    // If there's no token, redirect to the login page
    if (!token) {
        return <Navigate to="/auth" />;
    }

    // If token exists, allow access to the protected route
    return <Outlet />;
};

export default PrivateRoute;
