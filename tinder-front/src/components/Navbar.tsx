import React from 'react';
import { useNavigate } from 'react-router-dom';
import {logout} from "../services/auth.service";

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem("token");
            console.log("Logout successful!");
            navigate("/auth");
        } catch (error: any) {
            console.error("Logout error:", error);
            alert(error.message || "An unexpected error occurred.");
        }
    };


    return (
        <div className="h-screen w-64 bg-gray-800 text-white p-5">
            <ul>
                <li className="mb-4 hover:bg-gray-700 p-2 rounded">
                    <a href="/#">Home</a>
                </li>
                <li className="mb-4 hover:bg-gray-700 p-2 rounded">
                    <a href="#">Settings</a>
                </li>
                <li className="mb-4 hover:bg-gray-700 p-2 rounded">
                    <a href="/profile">Profile</a>
                </li>
                <li className="mb-4 hover:bg-gray-700 p-2 rounded">
                    <a href="#">Messages</a>
                </li>
                <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">
                    <button onClick={handleLogout} className="w-full text-left">
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Navbar;
