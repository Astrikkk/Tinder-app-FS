import React from "react";
import "./SubscriptionTiers.css";
import { useNavigate } from "react-router-dom";

import sparkiiFooter from "./mainPage/sparkiiFooter.svg";
import language from "./mainPage/language.svg";
import line from "./mainPage/line.svg";
import instagram from "./mainPage/instagram.svg";
import tiktok from "./mainPage/TikTok-Logo.svg";
import youtube from "./mainPage/Youtube.svg";
import separator from "./mainPage/Separator.svg";
import sparkiiSubscription from "./SubscriptionTiers/sparkii+.png"

import { Typography } from "antd";
const { Text } = Typography;

const SubscriptionTiers = () => {
  const navigate = useNavigate();

  return (
    <><div className="subscription-container">
      {/* Header */}
      <header className="subscription-tiers-header">
        <div className="logo-menubar">
          <img src={sparkiiFooter} alt="Sparkii Logo" className="sparkii-logo" />
          <nav className="menubar">
            <Text className="menu-item" onClick={() => navigate("/AboutUs")}>
              About Us
            </Text>
            <Text className="menu-item" onClick={() => navigate("/HowItWorks")}>
              How It Works
            </Text>
            <Text className="menu-item" onClick={() => navigate("/SubscriptionTiers")}>
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

      {/* Title Section */}
      <div className="subscription-title">
        <img src={sparkiiSubscription} alt="Sparkii Logo" />
        <p>
          Unlock a world of possibilities with our <span className="font-bold text-red-400">premium</span> subscription plans!
        </p>
      </div>

      {/* Subscription Plans */}
      <div className="subscription-plans">
        <div className="plan-card">
          <h3 className="plan-title1">Free Plan</h3>
          <ul className="plan-description">
            <li>Create a profile</li>
            <li>view users</li>
            <li>limited swipes</li>
            <li>match notifications</li>
            <li>1 super like per month</li>
          </ul>
        </div>
        <div className="plan-card">
          <h3 className="plan-title2">Monthly Subscription</h3>
          <p className="plan-price">$9.99</p>
          <ul className="plan-description">
            <li>Everything in Free Plan</li>
            <li>plus unlimited swipes,likes and super likes</li>
            <li>see who likes you</li>
            <li>Boost your profile 3 times in a mounth</li>
            <li>Rewind your accidental swipes</li>
          </ul>
        </div>
        <div className="plan-card">
          <h3 className="plan-title3">Annual Subscription</h3>
          <p className="plan-price">$89.99</p>
          <ul className="plan-description">
            <li>Everything in Monthly Plan</li>
            <li>Exclusive profile badge</li>
            <li>Premium chat features, like exclusive emojis and reactions</li>
            <li>Priority support</li>
          </ul>
        </div>
      </div>

    </div>
      <div className="main-Footer">
        {/* Footer */}
        <footer className="subscription-tiers-footer">
          <div className="logo-text-footer">
            <img src={sparkiiFooter} alt="Footer Logo" className="sparkii-footer" />
            <p className="text-footer">
              © 2025 Sparkii. By creating a Sparkii account, you agree to be bound by our Terms of Use. These terms outline your rights, responsibilities, and the rules governing your use of our platform.
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

export default SubscriptionTiers;