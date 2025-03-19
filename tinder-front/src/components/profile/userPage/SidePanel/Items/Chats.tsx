import React from "react";
import Heart from "../../img/♡.svg";
import "../../ProfileViewer.css";
import {ChatDTO} from "../../NewProfileViewer";



interface ChatsProps {
    userChats: ChatDTO[];
    activeChat: ChatDTO | null;
    openChat: (chat: ChatDTO) => void;
}

const Chats: React.FC<ChatsProps> = ({ userChats, activeChat, openChat }) => {
    return (
        <>
            {userChats.length > 0 ? (
                <div className="Chat-Match">
                    <div className="Chats">
                        {userChats.map((chat, index) => (
                            <button
                                key={`${chat.chatRoom}-${index}`}
                                className={`Chat-Item ${activeChat?.chatRoom === chat.chatRoom ? "selected" : ""}`}
                                onClick={() => {
                                    console.log("Chat clicked:", chat);
                                    openChat(chat);
                                }}
                            >
                                <img
                                    className="Prifile-Image"
                                    src={`http://localhost:7034${chat.profile.photos[0]}`}
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
};

export default Chats;