
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import ProfileList from "./components/profile/Content";
import ProfileForm from "./components/profile/ProfileForm";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import DefaultLayout from "./components/default/DefaultLayout";
import SexualOrientationList from "./components/profileInfo/sexualOrientation/list";
import ProfileViewer from "./components/profile/ProfileViewer";
import InteresedInList from "./components/profileInfo/interestedIn/list";
import InterestedInForm from "./components/profileInfo/interestedIn/form";
import InterestsList from "./components/profileInfo/interests/list";
import InterestsForm from "./components/profileInfo/interests/form";
import LookingForList from "./components/profileInfo/lookingFor/list";
import LookingForForm from "./components/profileInfo/lookingFor/form";
import SexualOrientationForm from "./components/profileInfo/sexualOrientation/form";
import {useAuth} from "./components/Auth/AuthContext";
import CreateForm from "./components/profile/form/createForm";

const App: React.FC = () => {
    const { isAuthenticated } = useAuth(); // Отримуємо статус авторизації

    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <div className="flex">
                    {/* Відображаємо Navbar тільки якщо користувач авторизований */}
                    {isAuthenticated && <Navbar />}

                    <div className="flex-1">
                        <Routes>
                            {/* Публічні сторінки */}
                            <Route path="/auth" element={<DefaultLayout />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/create-profile" element={<CreateForm/>} />


                            {/* Приватні сторінки */}
                            <Route element={<PrivateRoute />}>

                                <Route path="/" element={<ProfileList />} />
                                <Route path="/profile" element={<ProfileForm profile={null} onSave={() => console.log("Profile saved")} />} />

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