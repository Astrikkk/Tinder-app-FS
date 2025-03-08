import React from "react";
import { useNavigate } from "react-router-dom";
import "./HowItWorks.css";
import sparkiiFooter from "./mainPage/sparkiiFooter.svg";
import line from "./mainPage/line.svg";
import instagram from "./mainPage/instagram.svg";
import tiktok from "./mainPage/TikTok-Logo.svg";
import youtube from "./mainPage/Youtube.svg";
import separator from "./mainPage/Separator.svg";
import language from "./mainPage/language.svg";

import ContentImage1 from "./HowItWorks/howitworks-image1.png"
import ContentImage2 from "./HowItWorks/howitworks-image2.png"
import SignImage from "./HowItWorks/icon-sign-in-fill.png"
import ProfileImage from "./HowItWorks/icon-profile-bold.png"
import BrowseImage from "./HowItWorks/icon-click.png"
import ChatImage from "./HowItWorks/icon-chat-12-regular.png"
import HeartImage from "./HowItWorks/icon-heart.png"

import { Typography } from "antd";
const { Text } = Typography;

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="how-it-works">
      <header className="how-it-works-header">
        <div className="logo-menubar">
          <img src={sparkiiFooter} alt="Sparkii Logo" className="logo" />
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
      </header>

      <main className="main-content">
        <div className="top-section">
          <div className="image-container">
            <img src={ContentImage2} alt="How it works" className="howitworks-image" />
            <img src={ContentImage1} alt="How it works" className="howitworks-image" />
          </div>
          <div className="text-container">
            <h1 className="main-title">
              Finding <span className="highlight">love</span> has never been easier with our user-friendly dating platform
            </h1>
            <button onClick={() => navigate("/Login")} className="join-button">
              Join Now
            </button>
          </div>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step">
              <img src={step.icon} alt={step.title} className="step-icon" />
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </main>
      
      <footer className="how-it-works-footer">
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
    </div>
  );
};

const steps = [
  {
    icon: SignImage,
    title: "Sign Up",
    description: "Joining our community is quick and easy. Simply create an account using your email or social media profile."
  },
  {
    icon: ProfileImage,
    title: "Create Your Profile",
    description: "Make a great first impression by creating a detailed profile. Upload your best photos and share your interests."
  },
  {
    icon: BrowseImage,
    title: "Browse Profiles",
    description: "Discover potential matches with our easy-to-use search and browse features. Use filters to find singles that match your criteria."
  },
  {
    icon: ChatImage,
    title: "Start Chatting",
    description: "Once you've found someone you're interested in, start a conversation using our secure messaging system."
  },
  {
    icon: HeartImage,
    title: "Go On A Date",
    description: "When you're ready, take your relationship to the next level and meet your match in person securely."
  }
];

export default HowItWorks;
