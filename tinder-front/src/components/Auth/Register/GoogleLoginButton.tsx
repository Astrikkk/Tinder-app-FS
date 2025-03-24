import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'antd';
import React from 'react';
import {LoginButtonProps} from "./types";

const GoogleLoginButton: React.FC<LoginButtonProps> = ({ onLogin, title, icon }) => {

    //Викликаємо AccessToken для доступу до інформації
    const login = useGoogleLogin({
        onSuccess: async (authCodeResponse) => {
            onLogin(authCodeResponse.access_token);


        },
        onError: (error) => {
            console.error('Login Failed:', error);
        },
    });

    return (
        <Button className={"google-login-button"} icon={icon} onClick={()=>login()}>
            {title}
        </Button>
    );
};

export default GoogleLoginButton;