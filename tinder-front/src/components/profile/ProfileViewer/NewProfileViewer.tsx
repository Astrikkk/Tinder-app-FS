import React, { useEffect, useState } from "react";
import { Button, message, Spin, Modal } from "antd";
import { ProfileService, Profile } from "../../../services/profile.service";
import Card from "./Card/Card";
import "./ProfileViewer.css";
import Pf1 from "./img/Pf-photo1.svg";
import Pf2 from "./img/Pf-photo2.svg";
import Heart from "./img/♡.svg";
import { jwtDecode } from "jwt-decode";
import { ProfileItemDTO } from "../types";
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import ChatWindow from "./Chat/ChatWindow";
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
import { useNavigate } from "react-router-dom";

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
                console.warn("SignalR підключення закрилося. Перепідключення...");
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
                console.log("numericUserId:", numericUserId);
                console.log("Fetched profiles:", data);

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
            console.log("Підключено до SignalR");
            setConnection(connection);
        } catch (e) {
            console.error("Помилка підключення до чату:", e);
            message.error("Не вдалося підключитися до чату. Спробуйте пізніше.");
        }
    };

    const createPrivateChat = async (participantId: number) => {
        if (!conn || !myProfile) {
            console.warn("Підключення до хабу не встановлено або не знайдено профіль користувача");
            return;
        }
        try {
            await conn.invoke("CreatePrivateChat", myProfile.userId, participantId);
            console.log(`Приватний чат між ${myProfile.userId} та ${participantId} створено`);
        } catch (e) {
            console.error("Помилка створення приватного чату:", e);
        }
    };

    const handleMessageClick = (profileId: number) => {
        createPrivateChat(profileId);
    };

    const handleDislike = () => {
        setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length);
    };

    const handleLike = async () => {
        const currentProfile = profiles[currentProfileIndex];
        const token = localStorage.getItem("token");
        let userId = JwtService.getUserIdFromToken(token);
    
        if (userId && currentProfile) {
            try {
                await ProfileService.likeUser(currentProfile.userId, Number(userId));
                message.success(`You liked ${currentProfile.name}`);
            } catch (error) {
                message.error("Failed to like the profile");
            }
        }
    
        setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length);
    };

    const SetChats = async (userId: string) => {
        try {
            const chats = await ProfileService.getUserChats(userId);
            console.log("Fetched chats:", chats);

            const chatPromises = chats.map(async (chat) => {
                let profile: ProfileItemDTO | null = null;

                try {
                    if (chat.creatorId.toString() === userId) {
                        console.log(`Fetching profile for participantId: ${chat.participantId}`);
                        profile = await ProfileService.getProfileById(chat.participantId);
                    } else if (chat.participantId.toString() === userId) {
                        console.log(`Fetching profile for creatorId: ${chat.creatorId}`);
                        profile = await ProfileService.getProfileById(chat.creatorId);
                    }

                    console.log("Fetched profile:", profile);

                    if (!profile) {
                        console.warn("Profile not found for chat:", chat);
                        return null;
                    }

                    return {
                        chatRoom: chat.chatRoom,
                        profile,
                    };
                } catch (error) {
                    console.error("Error fetching profile:", error);
                    return null;
                }
            });

            const newChats = (await Promise.all(chatPromises)).filter(
                (chat): chat is ChatDTO => chat !== null
            );

            console.log("Processed newChats:", newChats);
            setUserChats(newChats);
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    const openChat = (chat: ChatDTO) => {
        setActiveChat(chat);
        joinChatRoom(chat.chatRoom);
    };

    const joinChatRoom = async (chatRoom: string) => {
        if (!conn) {
            console.warn("SignalR підключення не встановлено.");
            return;
        }

        if (conn.state !== HubConnectionState.Connected) {
            console.warn("SignalR підключення ще не готове. Очікуємо...");
            await conn.start();
        }

        try {
            await conn.invoke("JoinSpecificChatRoom", { username: myProfile?.name, chatRoom });
            console.log(`Приєднано до чату: ${chatRoom}`);
        } catch (e) {
            console.error("Помилка приєднання до чату:", e);
        }
    };

    const sendMessage = async (message: string) => {
        try {
            if (conn && activeChat) {
                await conn.invoke("SendMessage", activeChat.chatRoom, myProfile?.name, message);
                console.log(`Message sent to ${activeChat.chatRoom}: ${message}`);
            }
        } catch (e) {
            console.error("Error sending message:", e);
        }
    };

    const handleButtonClick = (buttonName: string) => {
        setSelectedButton(buttonName);
    };

    const getMatchInfoContent = () => {
        if (selectedButton === "Chats") {
            return (
                <>
                    {userChats.length > 0 ? (
                        <div className="Chat-Match">
                            <div className="Chats">
                                {userChats.map((chat, index) => (
                                    <button
                                        key={`${chat.chatRoom}-${index}`}
                                        className="Chat-Item"
                                        onClick={() => openChat(chat)}
                                    >
                                        <img
                                            className="Prifile-Image"
                                            src={`http://localhost:7034${chat.profile.imagePath}`}
                                            alt="Chat Avatar"
                                        />
                                        <div className="Name-Messages">
                                            <div className="Name-Status">
                                                <div className="Profile-Text">{chat.profile.name}</div>
                                                <img src={Heart} />
                                            </div>
                                            <div className="Friend-Message">Tap to start chatting...</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="Chat-Match no-chats">
                            <h2 className="match-info-h2">No Chats Yet</h2>
                            <p className="match-info-p">
                                Start conversations with your matches! When you and another user mutually
                                like each other, you'll be able to chat here.
                            </p>
                        </div>
                    )}
                </>
            );
        }

        return (
            <div className="Chat-Match no-chats">
                <h2 className="match-info-h2">It's a Match!</h2>
                <p className="match-info-p">
                    See who likes you back! When you and another user mutually like each other, you'll become a match and appear in this section. Start chatting and see where it goes!
                </p>
                <img src={Kitty} alt="Kitty" className="kitty-image" />
            </div>
        );
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
                            <button onClick={showSettingsModal}><img src={Setting} /></button>
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
                    <div>
                        {getMatchInfoContent()}
                    </div>
                </div>
            </div>

            <div className="logo">
                <img src={Sparkii} />
                <div className="gradient-right"></div>
            </div>

            {loading ? (
                <Spin size="large" />
            ) : activeChat ? (
                <ChatWindow chat={activeChat} onClose={() => setActiveChat(null)} sendMessage={sendMessage} connection={conn} />
            ) : profiles.length > 0 ? (
                <Card
                    profile={profiles[currentProfileIndex]}
                    onMessageClick={handleMessageClick}
                    onDislike={handleDislike}
                    onLike={handleLike}
                />
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

                <div className="key" onClick={handleLike}>
                    <div className="key-box">
                        <img src={Like} />
                    </div>
                    <span className="key-text">super like</span>
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

            <Modal
                title="Settings"
                visible={isSettingsModalVisible}
                onCancel={handleSettingsModalCancel}
                footer={null}
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