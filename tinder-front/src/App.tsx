import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter as Router, Navigate } from "react-router-dom";
import Navbar from "./components/profile/adminPage/Navbar";
import PrivateRoute from "./components/routes/PrivateRoute";
import AdminRoute from "./components/routes/AdminRoute"; // Доданий компонент для перевірки прав адміністратора
import ProfileList from "./components/profile/adminPage/Content";
import ProfileForm from "./components/profile/adminPage/ProfileForm";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import DefaultLayout from "./components/default/DefaultLayout";
import SexualOrientationList from "./components/profileInfo/sexualOrientation/list";
import InteresedInList from "./components/profileInfo/interestedIn/list";
import InterestedInForm from "./components/profileInfo/interestedIn/form";
import InterestsList from "./components/profileInfo/interests/list";
import InterestsForm from "./components/profileInfo/interests/form";
import LookingForList from "./components/profileInfo/lookingFor/list";
import LookingForForm from "./components/profileInfo/lookingFor/form";
import SexualOrientationForm from "./components/profileInfo/sexualOrientation/form";
import { useAuth } from "./components/Auth/AuthContext";
import CreateForm from "./components/profile/adminPage/form/createForm";
import NewProfileViewer from "./components/profile/userPage/NewProfileViewer";
import { jwtDecode } from "jwt-decode";
import { RoleService } from "./services/role.service";
import PublicRoute from "./components/routes/PublicRoute";
import {JwtService} from "./services/jwt.service";
import {HubConnectionBuilder} from "@microsoft/signalr";
import AboutUs from "./components/default/AboutUsComponent";
import HowItWorks from "./components/default/HowitWorksComponent"
import Page404 from "./components/pages/404Page";
import SubscriptionTiers from "./components/default/SubscriptionTiersComponent";
import ReportedList from "./components/profileInfo/reported/Content";
import {setOffline, setOnline} from "./services/auth.service";
import { ForgotPassword } from "./components/default/ResetPassword";
import { ResetPassword } from "./components/default/ResetPassword";
import { ResetPasswordConfirmation } from "./components/default/ResetPassword";


const App: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            const token = localStorage.getItem("token");
            const userId = JwtService.getUserIdFromToken(token);
            if (userId) {
                try {
                    const roles = await RoleService.getUserRoles(userId);
                    setIsAdmin(roles.includes("Admin"));
                } catch (error) {
                    console.error("Помилка отримання ролей", error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
        };

        fetchRoles();
    }, []);




    useEffect(() => {
        let timer: NodeJS.Timeout;

        const resetTimer = () => {
            clearTimeout(timer);
            setOnline() // Відправляємо запит про активність
            timer = setTimeout(() => {
                console.log("User inactive for 2 minutes. Logging out...");
                setOffline();
            }, 60 * 1000);
        };

        ["mousemove", "keydown", "click", "scroll"].forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        resetTimer();

        return () => {
            clearTimeout(timer);
            ["mousemove", "keydown", "click", "scroll"].forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [isAuthenticated]);




    if (isAdmin === null) {
        return <div className="text-center text-lg font-semibold">Завантаження...</div>;
    }

    return (
        <Router>
            <div className="min-h-screen bg-gray-100 flex">
                <div className="flex-1">
                    <Routes>
                        {/* Публічні маршрути */}
                        <Route path="/auth" element={<DefaultLayout />} />
                        <Route path="/AboutUs" element={<AboutUs />} />
                        <Route path="/HowItWorks" element={<HowItWorks />}/>
                        <Route path="/SubscriptionTiers" element={<SubscriptionTiers />} />
                        <Route path="/404" element={<Page404 />} />
                        <Route path="/ForgotPassword" element={<ForgotPassword />}/>
                        <Route path="/ResetPassword" element={<ResetPassword />}/>
                        <Route path="/ResetPasswordConfirmation" element={<ResetPasswordConfirmation />}/>
                        {/* Публічні маршрути (доступні лише для неавтентифікованих користувачів) */}
                        <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/create-profile" element={<CreateForm />} />
                        </Route>
                        {/* Приватні маршрути для авторизованих користувачів */}
                        <Route element={<PrivateRoute />}>
                            <Route path="/user-view" element={<NewProfileViewer />} />
                        </Route>

                        {/* Приватні маршрути для адміністратора */}
                        <Route element={<AdminRoute isAdmin={isAdmin} />}>
                            <Route path="/admin-view" element={<ProfileList />} />
                            <Route path="/profile" element={<ProfileForm profile={null} onSave={() => console.log("Profile saved")} />} />
                            <Route path="/interested-in" element={<InteresedInList />} />
                            <Route path="/reported" element={<ReportedList />} />
                            <Route path="/interested-in-form" element={<InterestedInForm interestedIn={null} onSave={() => console.log("Profile saved")} />} />
                            <Route path="/interests" element={<InterestsList />} />
                            <Route path="/interests-form" element={<InterestsForm interests={null} onSave={() => console.log("Profile saved")} />} />
                            <Route path="/looking-for" element={<LookingForList />} />
                            <Route path="/looking-for-form" element={<LookingForForm lookingFor={null} onSave={() => console.log("Profile saved")} />} />
                            <Route path="/sexual-orientation" element={<SexualOrientationList />} />
                            <Route path="/sexual-orientation-form" element={<SexualOrientationForm sexualOrientation={null} onSave={() => console.log("Profile saved")} />} />
                        </Route>

                        {/* Сторінка без доступу */}
                        <Route path="/unauthorized" element={<h1 className="text-center mt-10 text-red-500">Access Denied</h1>} />
                        {/* Редірект на головну сторінку при невідомому маршруті */}
                        <Route path="*" element={<Navigate to={isAuthenticated ? (isAdmin ? "/admin-view" : "/user-view") : "/auth"} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
