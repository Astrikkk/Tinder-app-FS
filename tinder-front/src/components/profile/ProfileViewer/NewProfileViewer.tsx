import React, { useEffect, useState } from "react";
import { Button, message, Spin, Modal } from "antd";
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
import Heart from "./img/♡.svg";
import { JwtService } from "../../../services/jwt.service";
import { useNavigate } from "react-router-dom";
import { ProfileItemDTO } from "../types";
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import ChatWindow from "./Chat/ChatWindow";

interface ChatDTO {
    chatRoom: string;
    profile: ProfileItemDTO;
}

const NewProfileViewer: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [myProfile, setMyProfile] = useState<Profile | null>(null);
    const [selectedButton, setSelectedButton] = useState<string>("Matches");
    const [userChats, setUserChats] = useState<ChatDTO[]>([]);
    const [conn, setConnection] = useState<HubConnection | null>(null);
    const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
    const [activeChat, setActiveChat] = useState<ChatDTO | null>(null);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfiles();
        if (!conn) {
            initChatConnection();
        } else {
            conn.onclose(async () => {
                console.warn("SignalR connection closed. Reconnecting...");
                await initChatConnection();
            });
        }
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const data = await ProfileService.getProfiles();
            setProfiles(data);

            const token = localStorage.getItem("token");
            let userId = JwtService.getUserIdFromToken(token);

            if (userId) {
                const numericUserId = Number(userId);
                SetChats(userId);
                if (!isNaN(numericUserId)) {
                    const userProfile = data.find((profile: Profile) => profile.userId === numericUserId);
                    setMyProfile(userProfile || null);
                }
            }
        } catch (error) {
            message.error("Failed to load profiles");
        } finally {
            setLoading(false);
        }
    };

    const initChatConnection = async () => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl("http://localhost:7034/Chat")
                .configureLogging(LogLevel.Information)
                .build();

            connection.on("ReceiveMessage", (username: string, msg: string) => {
                console.log(`Message from ${username}: ${msg}`);
            });

            await connection.start();
            console.log("Connected to SignalR");
            setConnection(connection);
        } catch (e) {
            console.error("Error connecting to chat:", e);
            message.error("Failed to connect to chat. Try again later.");
        }
    };

    const handleDislike = () => {
        setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length);
    };

    const handleButtonClick = (buttonName: string) => {
        setSelectedButton(buttonName);
    };

    const showSettingsModal = () => {
        setIsSettingsModalVisible(true);
    };

    const handleSettingsModalCancel = () => {
        setIsSettingsModalVisible(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="custom-container">
            <div className="bg-left">
                <div className="left-header">
                    <div className="account">
                        <img className="your-avatar" src={`http://localhost:7034${myProfile?.imagePath}`} alt="Your Avatar" />
                        <div className="your-name">{myProfile?.name || "Unknown"}</div>
                    </div>
                    <div className="security-settings">
                        <button><img src={Security} /></button>
                        <button onClick={showSettingsModal}><img src={Setting} /></button>
                    </div>
                </div>
                <div className="section-2">
                    {["Matches", "Chats", "Explore"].map((buttonName) => (
                        <button key={buttonName} className={`section-2-button ${selectedButton === buttonName ? "selected" : ""}`} onClick={() => handleButtonClick(buttonName)}>
                            <span className="button-text">{buttonName}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="logo">
                <img src={Sparkii} />
            </div>
            {loading ? (
                <Spin size="large" />
            ) : profiles.length > 0 ? (
                <Card profile={profiles[currentProfileIndex]} onDislike={handleDislike} />
            ) : (
                <p>No profiles available</p>
            )}
            <Modal title="Settings" visible={isSettingsModalVisible} onCancel={handleSettingsModalCancel} footer={null}>
                <div style={{ textAlign: "center" }}>
                    <Button type="primary" danger onClick={handleLogout}>Logout</Button>
                </div>
            </Modal>
        </div>
    );
};

export default NewProfileViewer;
