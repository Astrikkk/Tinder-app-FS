import React from "react";
import "./AboutUs.css"; 
import { useNavigate } from "react-router-dom";
import sparkiiFooter from "./mainPage/sparkiiFooter.svg";
import instagram from "./mainPage/instagram.svg";
import tiktok from "./mainPage/TikTok-Logo.svg";
import youtube from "./mainPage/Youtube.svg";
import separator from "./mainPage/Separator.svg";
import line from "./mainPage/line.svg";
import missionImage from "./AboutUs/AboutImage1.png"; 
import communityImage from "./AboutUs/AboutImage2.png"; 
import language from "./mainPage/language.svg";
import { Typography } from "antd";

const { Text } = Typography;

const AboutUs: React.FC = () => {
    const navigate = useNavigate();
    return (
        <><div className="about-us-container">
            <meta name="viewport" content="width=1200, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
            {/* Header */}
            <div className="About-ImageBG">
                <div className="about-us-header">
                    <div className="logo-menubar">
                        <img src={sparkiiFooter} alt="Sparkii Logo" className="sparkii-logo" />
                        <nav className="menubar">
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
                            <img src={language} alt="Language" />
                        </button>
                        <button className="log-in-header" onClick={() => navigate("/login")}>
                            <span className="text-default">Log In</span>
                            <span className="text-hover">L o g I n</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="about-us-content">
                {/* First Section */}
                <div className="content-section">
                    <div className="image-container1">
                        <img src={missionImage} alt="Couple near Christmas tree" />
                    </div>
                    <div className="text-container">
                        <Text className="section-title-1">Our Mission</Text>
                        <Text className="section-description-1">
                            To help people find lasting love and meaningful connections.
                            We believe everyone deserves to find happiness, and we're
                            committed to providing a safe and supportive environment.
                        </Text>

                        <Text className="section-title-2">What Sets Us Apart</Text>
                        <Text className="section-description-2">
                            We stand out with our advanced matching algorithm, which connects
                            you with people who are truly compatible. Our dedicated customer
                            support team is always here to help, ensuring an enjoyable
                            dating experience.
                        </Text>
                    </div>
                </div>

                {/* Second Section */}
                <div className="content-section">
                    <div className="text-container">
                        <Text className="section-title-3">Our Community</Text>
                        <Text className="section-description-3">
                            Join our vibrant community of singles who are looking for love.
                            Whether you're seeking a casual relationship or a long-term commitment,
                            you'll find like-minded individuals on our platform.
                        </Text>

                        <Text className="section-title-4">Why Choose Us?</Text>
                        <Text className="section-description-4">
                            Our dating site offers a wide range of features, including
                            advanced search filters, personalized recommendations, and a
                            secure messaging system. With our commitment to privacy,
                            you can feel confident meeting new people.
                        </Text>
                    </div>
                    <div className="image-container2">
                        <img src={communityImage} alt="Couple on the beach" />
                    </div>
                </div>
            </div>

        </div>
        <div>
                {/* Footer */}
                <footer className="about-us-footer">
                    <div className="logo-text-footer">
                        <img src={sparkiiFooter} alt="Footer Logo" className="sparkii-footer" />
                        <p className="text-footer">
                            © 2025 Sparkii. By creating a Sparkii account, you agree to be bound
                            by our Terms of Use. These terms outline your rights, responsibilities,
                            and the rules governing your use of our platform.
                        </p>
                    </div>
                    <div className="line-footer"><img src={line} alt="Line" /></div>
                    <nav className="site-navigation-elements-footer">
                        <a href="#" className="faq-footer">FAQ</a>
                        <img src={separator} alt="Separator" className="separator" />
                        <a href="#" className="faq-footer">Contact</a>
                        <img src={separator} alt="Separator" className="separator" />
                        <a href="#" className="faq-footer">Privacy</a>
                        <img src={separator} alt="Separator" className="separator" />
                        <a href="#" className="faq-footer"><img src={youtube} alt="Youtube" />Sparkii</a>
                        <img src={separator} alt="Separator" className="separator" />
                        <a href="#" className="faq-footer"><img src={instagram} alt="Instagram" />@sparkii</a>
                        <img src={separator} alt="Separator" className="separator" />
                        <a href="#" className="faq-footer"><img src={tiktok} alt="TikTok" />@sparkii</a>
                    </nav>
                </footer>
            </div></>
    );
};

export default AboutUs;
