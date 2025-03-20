import React, { useEffect, useState } from "react";
import {  message, Spin } from "antd";
import { ProfileService, Profile } from "../../../services/profile.service";
import Card from "./Card/Card";
import "./ProfileViewer.css";
import { ProfileItemDTO } from "../types";
import { HubConnection } from "@microsoft/signalr";
import ChatWindow from "./Chat/ChatWindow";
import Nope from "./img/keys/nope.svg";
import Like from "./img/keys/like.svg";
import Close from "./img/keys/close.svg";
import SuperLike from "./img/keys/super-like.svg";
import Open from "./img/keys/open.svg";
import NextPh from "./img/keys/next.svg";
import Sparkii from "./img/Sparkii.svg";
import { JwtService } from "../../../services/jwt.service";
import { useNavigate } from "react-router-dom";
import {ChatRoomInfo, ChatService} from "../../../services/chat.service";
import Matches from "./SidePanel/Items/Matches";
import Chats from "./SidePanel/Items/Chats";
import Explore from "./SidePanel/Items/Explore";
import LeftHeader from "./SidePanel/LeftHeader";

export interface ChatDTO {
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
    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // State for Info modal
    const [selectedProfileId, setSelectedProfileId] = useState<number >(0); // State for selected profile ID
    const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoomInfo| null>(null);
    const navigate = useNavigate();
    const [isMatch, setIsMatch] = useState(false);
    const [isMatchHiding, setIsMatchHiding] = useState(false);


    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSecurityOpen, setIsSecurityOpen] = useState(false);

    const showSettingsModal = () => setIsSettingsOpen(true);


    const showSecurityModal = () => setIsSecurityOpen(true);
    const closeSecurityModal = () => setIsSecurityOpen(false);

    useEffect(() => {
        const initialize = async () => {
            await fetchProfiles();
            if (!conn) {
                try {
                    const connection = await ChatService.initChatConnection();
                    setConnection(connection);
                    connection.onclose(async () => {
                        console.warn("SignalR підключення закрилося. Перепідключення...");
                        try {
                            const newConnection = await ChatService.initChatConnection();
                            setConnection(newConnection);
                        } catch (error) {
                            console.error("Помилка перепідключення до SignalR:", error);
                        }
                    });
                } catch (error) {
                    console.error("Помилка ініціалізації SignalR:", error);
                }
            }
        };
        initialize();
        return () => {
            if (conn) {
                conn.off("ReceiveMessage");
                conn.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (profiles.length > 0) {
            setSelectedProfileId(profiles[currentProfileIndex]?.userId);
        }
    }, [currentProfileIndex, profiles]);


    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            let userId = JwtService.getUserIdFromToken(token);


            if (userId) {
                UpdateProfiles(userId);
                const userProfile = await ProfileService.getProfileById(userId);
                setMyProfile(userProfile || null);

                SetChats(userId);
            }
        } catch (error) {
            message.error("Failed to load profiles");
        } finally {
            setLoading(false);
        }
    };

    const UpdateProfiles = async (userId:string)=>{
        const filteredProfiles = await ProfileService.getFilteredProfilesById(userId);
        setProfiles(filteredProfiles || null);
    }

    const closeSettingsModal = () => {
        setIsSettingsOpen(false);
        if (myProfile) {
            UpdateProfiles(myProfile.userId.toString());
        }
    };

    const handleDislike = () => {
        console.log("Dislike triggered");
        setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length);
    };

    const handleLike = async () => {
        const currentProfile = profiles[currentProfileIndex];
        if (!currentProfile || currentProfile.id === 0) {
            console.error("Invalid target profile:", currentProfile);
            return;
        }

        const token = localStorage.getItem("token");
        let userId = JwtService.getUserIdFromToken(token);
        if (!userId) {
            console.error("User ID not found from token");
            return;
        }

        try {
            const myProfile = await ProfileService.getProfileById(userId);
            if (!myProfile || myProfile.id === 0) {
                throw new Error("Logged-in user profile not found or invalid ID");
            }

            console.log("id", myProfile.userId, currentProfile.userId);
            const response = await ProfileService.likeUser(currentProfile.userId, myProfile.userId);
            console.log(`You liked ${currentProfile.name}`);
            console.log("message", response.isMatch);
            message.success(`You liked ${currentProfile.name}`);

            if (response.isMatch) {
                setIsMatch(true);
                setTimeout(() => {
                    setIsMatchHiding(true);
                    setTimeout(() => {
                        setIsMatch(false);
                        setIsMatchHiding(false);
                    }, 500); // Час повинен відповідати анімації `match-hide`
                }, 3000); // Час відображення перед зникненням
            }

        } catch (error) {
            console.error("Error liking profile:", error);
            message.error("Failed to like the profile");
        }

        SetChats(userId);
        setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length);
    };

    const showInfoModal = (profileId: number) => {
        setSelectedProfileId(profileId);
        setIsInfoModalVisible(true);
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

    const openChat = async (chat: ChatDTO) => {

        if (conn && myProfile) {
            try {
                await ChatService.joinChatRoom(conn, chat.chatRoom, myProfile.name);
            } catch (error) {
                console.error("Помилка приєднання до чату:", error);
            }
        }
        setActiveChat(chat);
    };

    const sendMessage = async (message: string) => {
        if (conn && activeChat && myProfile) {
            try {
                await ChatService.sendMessage(conn, activeChat.chatRoom, myProfile.userId, message);
            } catch (error) {
                console.error("Помилка надсилання повідомлення:", error);
            }
        }
    };

    const handleButtonClick = (buttonName: string) => {
        console.log("Clicked:", buttonName);
        setSelectedButton(buttonName);
    };

    const renderContent = () => {
        switch (selectedButton) {
            case "Matches":
                return <Matches />;
            case "Chats":
                return <Chats userChats={userChats} activeChat={activeChat} openChat={openChat} />;
            case "Explore":
                return <Explore />;
            default:
                return null;
        }
    };

    return (
        <div className="custom-container">
            <div className="bg-left">
                <LeftHeader
                    myProfile={myProfile}
                    selectedProfileId={selectedProfileId}
                    isSettingsOpen={isSettingsOpen}
                    isSecurityOpen={isSecurityOpen}
                    showSettingsModal={showSettingsModal}
                    showSecurityModal={showSecurityModal}
                    closeSettingsModal={closeSettingsModal}
                    closeSecurityModal={closeSecurityModal}
                />
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
                    <div className="Chat-Conatiner">
                        {renderContent()}
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
                <ChatWindow
                    chat={activeChat}
                    onClose={() => setActiveChat(null)}
                    sendMessage={sendMessage}
                    connection={conn}
                    messages={chatRoomInfo?.messages || []}
                />
            ) : profiles.length > 0 ? (
                <Card
                    profile={profiles[currentProfileIndex]}
                    onDislike={handleDislike}
                    onLike={handleLike}
                    onInfoClick={showInfoModal}
                />
            ) : (
                <p>No profiles available</p>
            )}

            {!activeChat && (
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
            )}

            {isMatch && (
                <div className={`is-match ${isMatchHiding ? "hide" : ""}`}>
                    <img
                        className="Prifile-Image"
                        src={`http://localhost:7034${myProfile?.photos[0]}`}
                        alt="My Profile"
                    />
                    <div className="is-match-block">
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" viewBox="0 0 23 24" fill="none">
                            <path d="M7.18783 3.85416C4.27689 3.85416 1.91699 6.21406 1.91699 9.125C1.91699 14.3958 8.14616 19.1875 11.5003 20.302C14.8545 19.1875 21.0837 14.3958 21.0837 9.125C21.0837 6.21406 18.7238 3.85416 15.8128 3.85416C14.0303 3.85416 12.4539 4.73919 11.5003 6.09379C11.0142 5.40158 10.3685 4.83665 9.61785 4.44681C8.86719 4.05697 8.03368 3.85369 7.18783 3.85416Z" stroke="#FF4F4F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <div className="is-match-text">It's a Match!</div>
                    </div>
                    <img
                        className="Prifile-Image"
                        src={`http://localhost:7034${profiles[currentProfileIndex]?.photos[0] || ""}`}
                        alt="Liked Profile"
                    />
                </div>
            )}






        </div>
    );
};

export default NewProfileViewer;