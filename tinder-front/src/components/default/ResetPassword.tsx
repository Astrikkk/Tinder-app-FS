import { useState } from "react";
import React from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/account/ForgotPassword", { email });
            setMessage(response.data.message);
        } catch (error: any) {
            setMessage(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div>
            <h2>Забыли пароль?</h2>
            <p>Введите email.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Введите ваш email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Отправить</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Пароли не совпадают");
            return;
        }

        try {
            const response = await axios.post("/api/account/ResetPassword", {
                email,
                code,
                password,
            });
            setMessage(response.data.message);
            setTimeout(() => navigate("/login"), 3000);
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Произошла ошибка");
        }
    };

    return (
        <div>
            <h2>Сброс пароля</h2>
            <p>Введите новый пароль.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Введите ваш email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Введите новый пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Подтвердите новый пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Сбросить</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

const ResetPasswordConfirmation = () => {
    return (
        <div>
            <h2>Подтверждение сброса пароля</h2>
            <p>
                Ваш пароль сброшен. Для входа в приложение перейдите по <a href="/login">ссылке</a>.
            </p>
        </div>
    );
};

export { ForgotPassword, ResetPassword, ResetPasswordConfirmation };
