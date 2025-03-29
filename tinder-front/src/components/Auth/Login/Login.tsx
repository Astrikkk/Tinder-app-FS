import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/auth.service";
import { GoogleOutlined } from "@ant-design/icons";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "../GoogleLoginButton";
import {JwtService} from "../../../services/jwt.service";

import Google from "../img/Google.svg";
import Sparkii from "../img/Sparkii.svg";
import Eye from "../img/eye.svg";
import Stars from "../img/Stars.svg";
import Bow from "../img/Bow.svg";
import "./Login.css";
import ingBack from "../img/pexels-photo-1378723.png";

const CLIENT_ID = '799604217377-hjdjqa368b4tlt2p40gpvmmf5boq4615.apps.googleusercontent.com';

const Login: React.FC = () => {
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
                if(role?.includes("Admin")) {
                    navigate("/admin-view");
                } else {
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

    const onLoginGoogleResult = async (idToken: string) => {
        console.log("Google ID Token", idToken);
        try {
            const response = await fetch("http://localhost:7034/api/Auth/login/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: idToken }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Server Response:", data);
                localStorage.setItem("token", data.token);
                const role = JwtService.getRoleFromToken(data.token);
                if(role?.includes("Admin")) {
                    navigate("/admin-view");
                } else {
                    navigate("/user-view");
                }
            } else {
                throw new Error(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Google login error:", error);
            alert("Google login failed. Please try again.");
        }
    };

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <div className="login-container">
                <div className="background">
                    <img className="background-image" src={ingBack} alt="background"/>
                    <div className="stars">
                        <img src={Stars} alt="stars"/>
                    </div>
                    <div className="login-bow">
                        <img src={Bow} alt="bow"/>
                    </div>
                    <div className="gradient-bar"/>
                </div>
                <div className="login-form">
                    <div className="form-fields">
                        <div className="email-field">
                            <label className="email-label">Email</label>
                            <input
                                type="email"
                                className="email-input"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="password-field">
                            <label className="password-label">Password</label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="password-input"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <img src={Eye} alt="toggle password visibility"/>
                                </button>
                            </div>
                            <div className="remember-forgot">
                                <label className="remember-me">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    Remember me
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button className="login-button" onClick={handleLogin}>Log In</button>

                        <button className="google-login-button">
                            <GoogleLoginButton
                                icon={<GoogleOutlined />}
                                title="Увійти з Google"
                                onLogin={onLoginGoogleResult}
                            />
                        </button>

                        <div className="sign-up-link">
                            Don't have an account? <a href="/register">Sign Up</a>
                        </div>
                    </div>
                </div>
                <div className="login-header">
                    <div className="heart">♡</div>
                    <div className="login-title">˗ˋˏ Log in to your account ˎˊ˗</div>
                </div>
                <div className="sparkii-logo">
                    <img src={Sparkii} alt="Sparkii"/>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;