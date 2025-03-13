import React, { useEffect, useState } from "react";
import { message, Spin, Modal, Button } from "antd"; // Import Modal and Button from Ant Design
import { ProfileService, Profile } from "../../../services/profile.service";
import Card from "./Card/Card";
import "./ProfileViewer.css";

import Nope from "./img/keys/nope.svg";
import Like from "./img/keys/like.svg";
import Close from "./img/keys/close.svg";
import SuperLike from "./img/keys/super-like.svg";
import Open from "./img/keys/open.svg";
import NextPh from "./img/keys/next.svg";
import Kitty from "./img/Kitty.svg";
import Setting from "./img/icon_settings.svg";
import Security from "./img/icon_security.svg";
import Sparkii from "./img/Sparkii.svg";
import { JwtService } from "../../../services/jwt.service";
import { useNavigate } from "react-router-dom"; // Import useNavigate for logout redirection

const NewProfileViewer: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [myProfile, setMyProfile] = useState<Profile | null>(null);
    const [selectedButton, setSelectedButton] = useState<string | null>("Matches");
    const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false); // State for modal visibility
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const data = await ProfileService.getProfiles();
            setProfiles(data);

            const token = localStorage.getItem("token");
            let userId = JwtService.getUserIdFromToken(token);

            if (userId) {
                const numericUserId = Number(userId); // Convert to number
                console.log("numericUserId:", numericUserId);
                console.log("Fetched profiles:", data);

                if (!isNaN(numericUserId)) {
                    const userProfile = data.find((profile: Profile) => profile.userId === numericUserId);
                    setMyProfile(userProfile || null);
                    console.log("Found myProfile:", userProfile);
                } else {
                    console.error("User ID is not a valid number:", userId);
                }
            }
        } catch (error) {
            message.error("Failed to load profiles");
        } finally {
            setLoading(false);
        }
    };

    const handleDislike = () => {
        setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length);
    };

    const handleButtonClick = (buttonName: string) => {
        setSelectedButton(buttonName);
    };

    // Open the settings modal
    const showSettingsModal = () => {
        setIsSettingsModalVisible(true);
    };

    // Close the settings modal
    const handleSettingsModalCancel = () => {
        setIsSettingsModalVisible(false);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove the token from localStorage
        navigate("/login"); // Redirect to the login page
    };

    return (
        <div className="custom-container">
            <div className="bg-left">
                <div className="left-header">
                    <div className="bg-left-3"></div>
                    <div className="section-1">
                        <div className="account">
                            <img
                                className="your-avatar"
                                src={`http://localhost:7034${myProfile?.imagePath}`}
                                alt="Your Avatar"
                            />
                            <div className="your-name">{myProfile?.name || "Unknown"}</div>
                        </div>

                        <div className="security-settings">
                            <button><img src={Security} /></button>
                            <button onClick={showSettingsModal}><img src={Setting} /></button> {/* Add onClick handler */}
                        </div>
                    </div>
                    <div className="bg-left-2"></div>
                </div>
                <div className="bg-left-1">
                    <div className="section-2">
                        {["Matches", "Chats", "Explore"].map((buttonName) => (
                            <button
                                key={buttonName}
                                className={`section-2-button ${selectedButton === buttonName ? "selected" : ""}`}
                                onClick={() => handleButtonClick(buttonName)}
                            >
                                <span className="button-text">{buttonName}</span>
                            </button>
                        ))}
                    </div>

                    <div className="match-info">
                        <h2 className="match-info-h2">It's a Match!</h2>
                        <p className="match-info-p">
                            See who likes you back! When you and another user mutually like each other, you'll become a
                            match and appear in this section. Start chatting and see where it goes!
                        </p>
                        <img src={Kitty} />
                    </div>
                </div>
            </div>

            <div className="logo">
                <img src={Sparkii} />
                <div className="gradient-right"></div>
            </div>

            {loading ? (
                <Spin size="large" />
            ) : profiles.length > 0 ? (
                <Card profile={profiles[currentProfileIndex]} onDislike={handleDislike} />
            ) : (
                <p>No profiles available</p>
            )}

            <div className="keys">
                <div className="key">
                    <div className="key-box">
                        <img src={Nope} />
                    </div>
                    <span className="key-text">nope</span>
                </div>

                <div className="key">
                    <div className="key-box">
                        <img src={Like} />
                    </div>
                    <span className="key-text">like</span>
                </div>

                <div className="key">
                    <div className="key-box">
                        <img src={Open} />
                    </div>
                    <span className="key-text">open profile</span>
                </div>

                <div className="key">
                    <div className="key-box">
                        <img src={Close} />
                    </div>
                    <span className="key-text">close profile</span>
                </div>

                <div className="key">
                    <div className="key-box">
                        <img src={SuperLike} />
                    </div>
                    <span className="key-text">super like</span>
                </div>

                <div className="key">
                    <div className="key-box">
                        <img src={NextPh} />
                    </div>
                    <span className="key-text">next photo</span>
                </div>
            </div>

            {/* Settings Modal */}
            <Modal
                title="Settings"
                visible={isSettingsModalVisible}
                onCancel={handleSettingsModalCancel}
                footer={null} // Remove default footer buttons
            >
                <div style={{ textAlign: "center" }}>
                    <Button type="primary" danger onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default NewProfileViewer;