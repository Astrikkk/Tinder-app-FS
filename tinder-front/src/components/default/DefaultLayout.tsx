import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";
import sparkiiHeader from "./mainPage/sparkiiHeader.svg";
import sparkiiFooter from "./mainPage/sparkiiFooter.svg";

import instagram from "./mainPage/instagram.svg"
import tiktok from "./mainPage/TikTok-Logo.svg"
import youtube from "./mainPage/Youtube.svg"
import separator from "./mainPage/Separator.svg"
import line from "./mainPage/line.svg"




import language from "./mainPage/language.svg";
import {Button, Typography} from "antd";
const { Text } = Typography;

const DefPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="main-container">
            {/* Header */}

            <div className="imagebg-custom">


            <header className="custom-header">
                <div className="logo-menubar-header">
                    <img className="sparkii-img" alt="Sparkii" src={sparkiiHeader}/>
                    <nav className="menubar-header">
                            <Text
                                className="menu-item"
                                onClick={() => navigate("/AboutUs")} 
                            >
                                About Us
                            </Text>
                            <Text 
                                className="menu-item"
                                onClick={() => navigate("/HowItWorks")} 
                            >
                                How It Works
                            </Text>
                            <Text 
                                className="menu-item"
                                onClick={() => navigate("/SubscriptionTiers")}
                            >
                                Subscription Tiers
                            </Text>
                    </nav>
                </div>
                <div className="lang-login-header">
                    <button className="language-header">
                        <img src={language}/>
                    </button>
                    <button className="log-in-header" onClick={() => navigate("/login")}>Log In</button>
                </div>
            </header>

            {/* Main Section */}
            <main className="main-custom">
                <Text className="custom-text">
                    Ready to find love and feel the {" "}
                    <span className="custom-text-spark">spark</span>?
                </Text>
                <Button  className="custom-button"
                         onClick={() => navigate("/register")}>
                    <Text className="Create-Account-Button-1">Create Account</Text>
                </Button>
            </main>
            </div>

            {/* Footer */}
            <footer className="custom-footer">
                <div className="logo-text-footer">
                    <img src={sparkiiFooter} alt="Footer Logo" className="sparkii-footer" />
                    <p className="text-footer">© 2025 Sparkii. By creating a Sparkii account, you agree to be bound by our Terms of Use. These terms outline your rights, responsibilities, and the rules governing your use of our platform. Your agreement is essential for maintaining a safe and enjoyable community, so please review them thoroughly before proceeding.</p>
                </div>
                <div className="Line-Footer"><img src={line}/></div>
                <nav className="site-navigation-elements-footer">
                    <a href="#" className="faq-footer">FAQ</a>
                    <a href="#" className="faq-footer"><img src={separator}/></a>
                    <a href="#" className="faq-footer">Contact</a>
                    <a href="#" className="faq-footer"><img src={separator}/></a>
                    <a href="#" className="faq-footer">Privacy</a>
                    <a href="#" className="faq-footer"><img src={separator}/></a>
                    <a href="#" className="faq-footer"><img src={youtube}/>Sparkii</a>
                    <a href="#" className="faq-footer"><img src={separator}/></a>
                    <a href="#" className="faq-footer"><img src={instagram}/>@sparkii</a>
                    <a href="#" className="faq-footer"><img src={separator}/></a>
                    <a href="#" className="faq-footer"><img src={tiktok}/>@sparkii</a>
                </nav>
            </footer>
        </div>
    );
};

export default DefPage;
