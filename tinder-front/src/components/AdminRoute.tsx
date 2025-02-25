import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface AdminRouteProps {
    isAdmin: boolean;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ isAdmin }) => {
    return isAdmin ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default AdminRoute;
