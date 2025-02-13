import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Navbar from "./components/Navbar";
//import Content from "./components/profile/Content";
//import PrifileList from "./components/profile/Content";
// import CreateProfile from "./components/profile/ProfileForm";
import PrivateRoute from './components/PrivateRoute';  // Import the PrivateRoute component

import ProfileList from "./components/profile/Content";
import ProfileForm from "./components/profile/ProfileForm";
import InteresedInList from "./components/profileInfo/interestedIn/list";
import InterestedInForm from "./components/profileInfo/interestedIn/form";
import InterestsList from "./components/profileInfo/interests/list";
import InterestsForm from "./components/profileInfo/interests/form";
import LookingForList from "./components/profileInfo/lookingFor/list";
import LookingForForm from "./components/profileInfo/lookingFor/form";
import SexualOrientationList from "./components/profileInfo/sexualOrientation/list";
import SexualOrientationForm from "./components/profileInfo/sexualOrientation/form";
import ProfileViewer from "./components/profile/ProfileViewer";
import DefaultLayout from "./components/default/DefaultLayout";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <div className="flex">
                    {/*<Navbar />*/}
                    <div className="flex-1">
                        <Routes>
                            {/* Public Route for login/register */}
                            <Route path="/auth" element={<DefaultLayout />} />

                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            
                            {/* Protected Routes wrapped with PrivateRoute */}
                            <Route element={<PrivateRoute />}>
                                <Route path="/" element={<ProfileList />} />
                                <Route
                                    path="/profile"
                                    element={<ProfileForm profile={null} onSave={() => console.log('Profile saved')} />}
                                />

                                <Route path="/user-view" element={<ProfileViewer />} />

                                <Route path="/interested-in" element={<InteresedInList />} />
                                <Route
                                    path="/interested-in-form"
                                    element={<InterestedInForm interestedIn={null} onSave={() => console.log('Profile saved')} />}
                                />

                                <Route path="/interests" element={<InterestsList />} />
                                <Route
                                    path="/interests-form"
                                    element={<InterestsForm interests={null} onSave={() => console.log('Profile saved')} />}
                                />

                                <Route path="/looking-for" element={<LookingForList />} />
                                <Route
                                    path="/looking-for-form"
                                    element={<LookingForForm lookingFor={null} onSave={() => console.log('Profile saved')} />}
                                />

                                <Route path="/looking-for" element={<LookingForList />} />
                                <Route
                                    path="/looking-for-form"
                                    element={<LookingForForm lookingFor={null} onSave={() => console.log('Profile saved')} />}
                                />

                                <Route path="/sexual-orientation" element={<SexualOrientationList />} />
                                <Route
                                    path="/sexual-orientation-form"
                                    element={<SexualOrientationForm sexualOrientation={null} onSave={() => console.log('Profile saved')} />}
                                />

                            </Route>
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;
