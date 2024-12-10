import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Content from "./components/Content";
import CreateProfile from "./components/CreateProfile";

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <div className="flex">
                    <Navbar />
                    <div className="flex-1 p-4">
                        <Routes>
                            <Route path="/" element={<Content />} />
                            <Route path="/profile" element={<CreateProfile />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;
