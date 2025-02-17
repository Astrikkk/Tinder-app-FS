import "./Register.css"
import React, { useState } from "react";
import Google from "../img/Google.svg";
import Sparkii from "../img/Sparkii.svg";
import Eye from "../img/eye.svg";
import Stars from "../img/Stars.svg";
import Bow from "../img/Bow.svg";
import ingBack from "./img/image.png";
import { useNavigate } from "react-router-dom";
import {register} from "../../../services/auth.service";

const Register: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleRegister = () => {
        try {
             register(email, password);
            console.log("Registration successful!");
            alert("Registration successful! You can now log in.");
        } catch (error: any) {
            console.error("Registration error:", error);
            alert(error.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="register-container">
            <div className="background">
                <img className="background-image" src={ingBack} alt="background"/>
                <div className="stars">
                    <img src={Stars} alt="stars"/>
                </div>
                <div className="bow">
                    <img src={Bow} alt="bow"/>
                </div>
                <div className="gradient-bar"/>
            </div>
            <div className="register-form">
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
                            >
                                <img src={Eye} alt="toggle password visibility"/>
                            </button>
                        </div>

                    </div>
                    <div className="remember-forgot">
                        <input
                            type="checkbox"
                            id="agree"
                            className="checkbox"
                        />
                        <label className="agree">
                            I agree to the collection and processing of my personal data
                        </label>
                    </div>
                </div>
                <div className="form-actions">
                    <div className="sign-up-but">
                        <button className="login-button" onClick={handleRegister}>Sign Up</button>
                        <button className="google-login-button">
                            <img src={Google} alt="Google"/>
                            Sign Up with Google
                        </button>
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
                <img src={Sparkii} alt="Sparkii"/>
            </div>
        </div>
    );
};

export default Register;