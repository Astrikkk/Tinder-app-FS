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
import IsMatchImg from "./img/IsMatchImg.svg";
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

    const [viewingMatches, setViewingMatches] = useState(false);

    const [viewingCategoryProfiles, setViewingCategoryProfiles] = useState(false);

    const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "">("");


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

    const handleBackToMainProfiles = async () => {
        setViewingMatches(false);
        await fetchProfiles(); // Завантажуємо звичайні профілі
        setCurrentProfileIndex(0);
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
        setSwipeDirection("left"); // Анімація вліво
        setTimeout(() => {
            setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length);
            setSwipeDirection(""); // Скидання після анімації
        }, 300); // Час відповідає CSS-анімації
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
                    }, 500);
                }, 3000);
            }

        } catch (error) {
            console.error("Error liking profile:", error);
            message.error("Failed to like the profile");
        }

        SetChats(userId);
        setSwipeDirection("right"); // Анімація вправо
        setTimeout(() => {
            setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length);
            setSwipeDirection(""); // Скидання після анімації
        }, 300);
    };


    const handleSuperLike = async () => {
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
            const response = await ProfileService.superLikeUser(currentProfile.userId, myProfile.userId);
            console.log(`You liked ${currentProfile.name}`);
            console.log("message", response.isMatch);
            message.success(`You super liked ${currentProfile.name}`);

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

    const handleReturn = () => {
        setCurrentProfileIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
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
                return <Matches setProfiles={setProfiles} setCurrentProfileIndex={setCurrentProfileIndex} setViewingMatches={setViewingMatches} />;
            case "Chats":
                return <Chats userChats={userChats} activeChat={activeChat} openChat={openChat} />;
            case "Explore":
                return <Explore setProfiles={setProfiles} setCurrentProfileIndex={setCurrentProfileIndex} setViewingCategoryProfiles={setViewingCategoryProfiles} />;
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

            <div className="info-block">
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
                    <>
                        {viewingMatches || viewingCategoryProfiles ? (
                            <button onClick={handleBackToMainProfiles} className="back-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                                    <path d="M4.34961 18H31.3496M4.34961 18L13.3496 27M4.34961 18L13.3496 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        ):null}
                        <div className={swipeDirection === "left" ? "swipe-left" : swipeDirection === "right" ? "swipe-right" : ""}>

                        <Card
                            profile={profiles[currentProfileIndex]}
                            onReturn={handleReturn}
                            onDislike={handleDislike}
                            onLike={handleLike}
                            onSuperLike={handleSuperLike}
                            onInfoClick={showInfoModal}
                            />
                        </div>

                    </>
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
                            <span className="key-text">like</span>
                        </div>

                        <div className="key">
                            <div className="key-box">
                                <img src={Close} />
                            </div>
                            <span className="key-text">return</span>
                        </div>
                        <div className="key">
                            <div className="key-box">
                                <img src={Open} />
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
            </div>



            {isMatch && (
                <div className={`is-match ${isMatchHiding ? "hide" : ""}`}>
                    <img
                        className="Prifile-Image"
                        src={`http://localhost:7034${myProfile?.photos[0]}`}
                        alt="My Profile"
                    />
                    <div className="is-match-block">
                        <img src={IsMatchImg}/>
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