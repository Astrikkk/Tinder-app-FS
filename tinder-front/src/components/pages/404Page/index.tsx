import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { login } from "../../../services/auth.service";

import Google from "../img/Google.svg";
import Sparkii from "../img/Sparkii.svg";
import Eye from "../img/eye.svg";

import Stars from "../img/Stars.svg";
import Bow from "../img/Bow.svg";

import "./index.css";
import ingBack from "../img/pexels-photo-1378723.png";
import {JwtService} from "../../../services/jwt.service";

const Page404: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await login(email, password);
            if (response.token) {
                localStorage.setItem("token", response.token);
                console.log("Login successful!");
                const role = JwtService.getRoleFromToken(response.token);
                if(role?.includes("Admin"))
                {
                    navigate("/admin-view");
                }
                else{
                    navigate("/user-view");
                }
            } else {
                throw new Error("Invalid token received.");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            alert(error.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="login-container">


            <div className="background">
                <img className="background-image" src={ingBack} alt="background"/>
                {/*<div className="stars">*/}
                {/*    <img src={Stars} alt="stars"/>*/}
                {/*</div>*/}
                {/*<div className="bow">*/}
                {/*    <img src={Bow} alt="bow"/>*/}
                {/*</div>*/}
                <div className="gradient-bar"/>


            </div>

            <div className="my-404-form">
                    <div className="mybg">
                        <div className="love">
                            <svg xmlns="http://www.w3.org/2000/svg" width="512" height="213" viewBox="0 0 512 213" fill="none">
                                <path d="M100.26 208.506V72.9131L101.381 26.383H97.2173L31.8719 141.189V155.26L19.5396 143.588H156.957V170.45H0V139.11L77.9981 4.15731H130.851V208.506H100.26Z" fill="#FF4F4F"/>
                                <path d="M253.927 212.663C228.835 212.663 209.883 205.734 197.07 191.877C184.257 177.912 177.851 157.765 177.851 131.435V81.2277C177.851 54.898 184.204 34.8043 196.91 20.9465C209.722 6.98217 228.728 0 253.927 0C279.125 0 298.131 6.98217 310.944 20.9465C323.757 34.8043 330.163 54.898 330.163 81.2277V131.435C330.163 157.765 323.757 177.912 310.944 191.877C298.131 205.734 279.125 212.663 253.927 212.663ZM261.055 162.136C273.868 147.745 271.626 151.476 278.673 142.415C285.827 133.248 296.29 123.76 303.231 113.634C310.171 103.507 310.944 94.4459 310.944 94.4459C315.616 80.6948 305.366 56.6036 286.76 52.3397C279.712 43.1722 253.927 59.8015 253.927 59.8015C253.927 59.8015 234.896 41.6799 221.094 52.3397C202.863 58.7355 197.07 75.0451 197.07 92.3139L206.601 114.7L221.015 130.156C232.76 144.547 233.187 143.907 240.234 153.075C247.388 162.136 246.32 162.136 261.055 162.136Z" fill="#FF4F4F"/>
                                <path d="M455.303 208.506V72.9131L456.424 26.383H452.26L386.915 141.189V155.26L374.582 143.588H512V170.45H355.043V139.11L433.041 4.15731H485.894V208.506H455.303Z" fill="#FF4F4F"/>
                            </svg>
                        </div>

                        <div className="text-love">
                            Not Found
                        </div>

                        <div className="text-low-two">
                            The resource requested could not be found on this server!
                        </div>

                        <div className="button-love">
                            <div className={"button-love-content"}>
                                <Link to={"/"}>
                                    Go back
                                </Link>
                            </div>


                        </div>

                    </div>

            </div>

            <div className="sparkii-logo">
                <img src={Sparkii} alt="Sparkii"/>
            </div>
        </div>
    );
};

export default Page404;