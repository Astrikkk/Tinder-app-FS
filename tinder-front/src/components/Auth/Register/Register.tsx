import "./Register.css";
import React, { useState } from "react";
import Google from "../img/Google.svg";
import Sparkii from "../img/Sparkii.svg";
import Eye from "../img/eye.svg";
import Stars from "../img/Stars.svg";
import Bow from "../img/Bow.svg";
import ingBack from "./img/image.png";
import { useNavigate } from "react-router-dom";
import { register } from "../../../services/auth.service";
import { GoogleOutlined } from "@ant-design/icons";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "./GoogleLoginButton";

const Register: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return gmailRegex.test(email);
    };

    const handleRegister = async () => {
        if (!validateEmail(email)) {
            setErrorMessage("Only @gmail.com emails are allowed.");
            return;
        }

        if (password !== repeatPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await register(email, password);

            if (response.token) {
                localStorage.setItem("token", response.token);
            }

            navigate(`/create-profile`);
        } catch (error: any) {
            console.error("Registration error:", error);
            setErrorMessage(error.message || "An unexpected error occurred.");
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
                navigate("/create-profile");
            } else {
                throw new Error(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Google login error:", error);
        }
    };

    // const onLoginGoogleResult = async (tokenGoogle:string) => {
    //     try {
    //         console.log("Register user", tokenGoogle);
    //         // const response = await googleLoginUser({token: tokenGoogle}).unwrap();
    //         // console.log("Користувача успішно зайшов через google", response);
    //         // navigate("..");
    //     } catch (error) {
    //         console.error("Поилка при реєстрації", error);
    //     }
    // }


    const CLIENT_ID = '592015176748-cmdok807okrq0bftv327p7n28hqv4aqv.apps.googleusercontent.com';

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <div className="register-container">
                <div className="background">
                    <img className="background-image" src={ingBack} alt="background" />
                    <div className="stars"><img src={Stars} alt="stars" /></div>
                    <div className="bow"><img src={Bow} alt="bow" /></div>
                    <div className="gradient-bar" />
                </div>

                <div className="register-form">
                    <div className="form-fields">
                        <div className="email-field">
                            <label className="email-label">Email</label>
                            <input
                                type="email"
                                autoComplete="off"
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
                                    type="button"
                                >
                                    <img src={Eye} alt="toggle password visibility" />
                                </button>
                            </div>
                        </div>
                        <div className="password-field">
                            <label className="password-label">Repeat Password</label>
                            <div className="password-input-container">
                                <input
                                    type={showRepeatPassword ? "text" : "password"}
                                    className="password-input"
                                    placeholder="Repeat Password"
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                />
                                <button
                                    className="toggle-password"
                                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                    type="button"
                                >
                                    <img src={Eye} alt="toggle password visibility" />
                                </button>
                            </div>
                        </div>

                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        <div className="remember-forgot">
                            <input type="checkbox" id="agree" className="checkbox" />
                            <label className="agree">
                                I agree to the collection and processing of my personal data
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <div className="sign-up-but">
                            <button className="login-button" onClick={handleRegister}>Sign Up</button>

                            <GoogleLoginButton icon={<GoogleOutlined />} title='Увійти Google' onLogin={onLoginGoogleResult} />
                        </div>
                        <div className="sign-up-link">
                            Already have an account? <a href="/login">Login</a>
                        </div>
                    </div>
                </div>

                <div className="register-header">
                    <div className="heart">♡</div>
                    <div className="register-title">˗ˋˏ Create an account ˎˊ˗</div>
                </div>

                <div className="sparkii-logo">
                    <img src={Sparkii} alt="Sparkii" />
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Register;
