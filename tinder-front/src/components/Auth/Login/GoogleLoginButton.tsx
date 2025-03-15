import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "antd";
import { LoginButtonProps } from "../types";

const GoogleLoginButton: React.FC<LoginButtonProps> = ({ onLogin, title, icon }) => {
    return (
        <GoogleLogin
            onSuccess={(response) => {
                if (!response.credential) {
                    console.error("Google ID Token is undefined");
                    return;
                }
                console.log("Google ID Token:", response.credential);
                onLogin(response.credential); // Передаємо ID Token
            }}
            onError={() => {
                console.error("Google Login Failed");
            }}
        />
    );
};

export default GoogleLoginButton;
