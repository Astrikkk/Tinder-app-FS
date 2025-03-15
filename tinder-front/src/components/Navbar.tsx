import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
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
                    <Link to="/">Default Page</Link>
                </li>
                <li className="mb-4 hover:bg-gray-700 p-2 rounded">
                    <Link to="/admin-view">Admin Panel</Link>
                </li>
                <li className="mb-4 hover:bg-gray-700 p-2 rounded">
                    <Link to="/user-view">User Panel</Link>
                </li>
                <li className="mb-4 hover:bg-gray-700 p-2 rounded">
                    <Link to="/profile">Profile</Link>
                </li>
                <li className="mb-4 hover:bg-gray-700 p-2 rounded">
                    <Link to="/reported">Reported</Link>
                </li>
                <li className="mb-4 hover:bg-gray-700 p-2 rounded">
                    <Link to="/interested-in">Interested In</Link>
                </li>
                <li className="mb-4 hover:bg-gray-700 p-2 rounded">
                    <Link to="/interests">Interests</Link>
                </li>
                <li className="mb-4 hover:bg-gray-700 p-2 rounded">
                    <Link to="/looking-for">Looking For</Link>
                </li>
                <li className="mb-4 hover:bg-gray-700 p-2 rounded">
                    <Link to="/sexual-orientation">Sexual Orientation</Link>
                </li>
                {/* <li className="mb-4 hover:bg-gray-700 p-2 rounded">
                    <Link to="#">Messages</Link>
                </li>
                <li className="mb-4 hover:bg-gray-700 p-2 rounded">
                    <Link to="/user-view">Profile Viewer</Link>
                </li> */}
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