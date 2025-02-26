import { Navigate, Outlet } from "react-router-dom";
import React from "react";

interface PublicRouteProps {
    isAuthenticated: boolean | null;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ isAuthenticated }) => {
    console.log(isAuthenticated);
    if (isAuthenticated === null) {
        return <div className="text-center text-lg font-semibold">Завантаження...</div>;
    }

    return isAuthenticated ? <Navigate to="/user-view" replace /> : <Outlet />;
};

export default PublicRoute;
