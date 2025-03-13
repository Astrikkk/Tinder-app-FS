import React, { useState } from "react";
import { useEffect } from "react";
import "./ChatWindow.css";
import { ProfileItemDTO } from "../../types";
import Img1 from "./img/Group.svg";
import Img2 from "./img/Group (1).svg";
import Img3 from "./img/Group (2).svg";
import OutlineLink from "./img/icon-park-outline_link.svg";
import Fluent from "./img/fluent_gif-16-regular.svg";
import {HubConnection} from "@microsoft/signalr";

interface ChatDTO {
    chatRoom: string;
    profile: ProfileItemDTO;
}

interface ChatWindowProps {
    chat: ChatDTO;
    onClose: () => void;
    sendMessage: (message: string) => void;
    connection: HubConnection | null;
}

interface Message {
    text: string;
    isMine: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onClose, sendMessage , connection}) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);


    useEffect(() => {
        if (!connection) return;

        const handleReceiveMessage = (username: string, msg: string) => {
            console.log("Received message:", username, msg);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: msg, isMine: username === chat.profile.name },
            ]);
        };

        connection.on("ReceiveMessage", handleReceiveMessage); // Додаємо новий обробник

        return () => {
            connection.off("ReceiveMessage", handleReceiveMessage);
        };
    }, [connection, chat.chatRoom]);


    useEffect(() => {
        setMessages([]); // Очищаємо повідомлення при зміні чату
    }, [chat.chatRoom]);


    const handleSendMessage = async () => {
        if (message.trim() !== "") {
            await sendMessage(message); // Надсилаємо повідомлення серверу
            setMessage(""); // Очищаємо поле вводу
        }
    };


    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="header-info">
                    <div className="header-name">{chat.profile.name}</div>
                    <div className="header-status">♡ Offline</div>
                </div>
                <div className="header-settings">
                    <button><img src={Img1} alt="settings" /></button>
                    <button><img src={Img2} alt="options" /></button>
                    <button onClick={onClose}><img src={Img3} alt="close" /></button>
                </div>
            </div>

            {messages.length === 0 ? (
                <div className="friend-info">
                    <div className="friend-title">You Matched with {chat.profile.name}</div>
                    <img className="friend-photo" src={`http://localhost:7034${chat.profile.imagePath}`} alt="profile" />
                </div>
            ) : (
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.isMine ? "mine" : "theirs"}`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
            )}

            <div className="chat-form">
                <div className="chat-form1">
                    <div className="import-file">
                        <button><img src={OutlineLink} alt="attach" /></button>
                        <button><img src={Fluent} alt="gif" /></button>
                    </div>
                    <input
                        type="text"
                        className="input-text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                </div>
                <div className="chat-form2">
                    <button className="Send-Button" onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
