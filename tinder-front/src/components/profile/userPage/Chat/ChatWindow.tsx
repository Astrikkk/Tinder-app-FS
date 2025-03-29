import React, { useState, useEffect } from "react";
import "./ChatWindow.css";
import { ProfileItemDTO } from "../../types";
import Img1 from "./img/Group.svg";
import Img2 from "./img/Group (1).svg";
import Img3 from "./img/Group (2).svg";
import ChatStar from "./img/Chat-star.svg";
import ChatRose from "./img/Chat-rose.svg";

import Clear from "./img/Clear.svg";
import Delete from "./img/Delete.svg";
import Block from "./img/Block.svg";
import OutlineLink from "./img/icon-park-outline_link.svg";
import Fluent from "./img/fluent_gif-16-regular.svg";
import { HubConnection } from "@microsoft/signalr";
import {ChatService, MessageInfo} from "../../../../services/chat.service";
import {ProfileService} from "../../../../services/profile.service";
import ShowProfile from "./ShowProfile/ShowProfile";
import {JwtService} from "../../../../services/jwt.service";

interface ChatDTO {
    chatRoom: string;
    profile: ProfileItemDTO;
}

interface ChatWindowProps {
    chat: ChatDTO;
    onClose: () => void;
    sendMessage: (message: string) => void;
    connection: HubConnection | null;
    messages?: MessageInfo[]; // Отримуємо масив повідомлень з пропсів

}


const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onClose, sendMessage, connection, messages }) => {
    const [message, setMessage] = useState("");
    const [localMessages, setLocalMessages] = useState<MessageInfo[]>(messages || []);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<ProfileItemDTO | null>(null);


    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };


    const fetchChatInfo = async () => {
        try {
            const data = await ChatService.getChatInfoByKey(chat.chatRoom);
            setLocalMessages(data.messages);
            console.log(localMessages);
        } catch (error) {
            console.error("Error fetching chat info:", error);
        }
    };


    useEffect(() => {
        const interval = setInterval(() => {
            fetchChatInfo();
        }, 1000);

        return () => clearInterval(interval);
    });

    useEffect(() => {
        setLocalMessages(messages || []);
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isModalOpen && !document.getElementById("more-options")?.contains(event.target as Node)) {
                //setIsModalOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isModalOpen]);



    useEffect(() => {
        if (!connection) return;

        const handleReceiveMessage = async (id: number, msg: string) => {
            console.log("Received message:", id, msg);

            // Оновлюємо локальний стан
            setLocalMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: new Date().getTime(),
                    content: msg,
                    sender: { id: id, userName: "" },
                    readed: false,
                    createdAt: new Date(),
                },
            ]);

            // Динамічно оновлюємо історію чату після отримання нового повідомлення
            await fetchChatInfo();
        };

        connection.on("ReceiveMessage", handleReceiveMessage);

        return () => {
            connection.off("ReceiveMessage", handleReceiveMessage);
        };
    }, [connection, chat.chatRoom]);


    const clearMessage = async () => {
        console.log("Clear history clicked");
        try {
            await ChatService.clearChat(chat.chatRoom);
            setLocalMessages([]);
            await fetchChatInfo(); // Оновлюємо після очищення
        } catch (error) {
            console.error("Помилка очищення історії чату:", error);
        }
        setIsModalOpen(false);
    };


    const deleteChat = async () => {
        console.log("Delete chat clicked");
        try {
            await ChatService.deleteChat(chat.chatRoom);
            await fetchChatInfo(); // Оновлюємо історію
            onClose();
        } catch (error) {
            console.error("Помилка видалення чату:", error);
        }
        setIsModalOpen(false);
    };

    const blockUser = async ()=>{
        try {
            const token = localStorage.getItem("token");
            const myUserId = JwtService.getUserIdFromToken(token);
            if(myUserId)
            {
                await ProfileService.blockUser(myUserId ,chat.profile.userId.toString());
            }
            onClose();

            console.log("BlockUser:", chat.profile.userId);
        }
        catch (error) {
            console.error("Помилка блоку юзера:", error);
        }
        setIsModalOpen(false);
    }



    const handleSendMessage = async () => {
        if (message.trim() !== "") {
            await sendMessage(message);
            setMessage("");

            await fetchChatInfo();
        }
    };

    const openProfile = async () => {
        try {

            setIsProfileOpen(true);
        } catch (error) {
            console.error("Помилка завантаження профілю:", error);
        }
    };
    const backgroundClass = localMessages.length === 0 ? "chat-star-img" : "chat-rose-img";
    return (
        <div className={`chat-window ${backgroundClass}`}>
            <div className="chat-header">
                <div className="header-info">
                    <div className="header-name">{chat.profile.name}</div>
                    <div className={chat.profile.isOnline ? "card-status-online" : "card-status-offline"}>
                        {chat.profile.isOnline ? "♡ Online" : "♡ Offline"}
                    </div>
                </div>
                <div className="header-settings">
                    <button onClick={openProfile}><img src={Img1} alt="settings" /></button>
                    <button onClick={toggleModal}><img src={Img2} alt="options" /></button>
                    <button onClick={onClose}><img src={Img3} alt="close" /></button>
                </div>
            </div>
            {isProfileOpen && chat.profile && (
                <ShowProfile profile={chat.profile} onClose={() => setIsProfileOpen(false)} />
            )}


            {isModalOpen && (
                <div className="More-Select">
                    <div className="More-chat-item">
                            <div onClick={clearMessage} className="More-chat-item-text white"><img src={Clear}/>Clear history</div>
                    </div>
                    <div className="More-chat-item">
                        <div onClick={deleteChat} className="More-chat-item-text red"><img src={Delete}/>Delete chat</div>
                    </div>
                    <div className="More-chat-item">
                        <div onClick={blockUser} className="More-chat-item-text red"><img src={Block}/>Block user</div>
                    </div>
                </div>
            )}


            {localMessages.length === 0 ? (
                <div className="friend-info">
                    <div className="friend-title">You Matched with {chat.profile.name}</div>
                    <img className="friend-photo" src={`http://localhost:7034${chat.profile.imagePath}`} alt="profile" />
                </div>
            ) : (
                <div
                    className="chat-messages"

                >
                    {localMessages.map((msg, index) => {
                        // Переконуємось, що createdAt є об'єктом Date
                        const messageDate = new Date(msg.createdAt);

                        return (
                            <div key={index} className={`message ${msg.sender.id === chat.profile.userId ? "mine" : "theirs"}`}>
                                {msg.content}
                                <div className="message-date">
                                    {messageDate.toLocaleTimeString('uk-UA', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false // 24-годинний формат
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="chat-form">
                <div className="chat-form1">
                    {/*<div className="import-file">*/}
                    {/*    <button><img src={OutlineLink} alt="attach" /></button>*/}
                    {/*    <button><img src={Fluent} alt="gif" /></button>*/}
                    {/*</div>*/}
                    <input
                        type="text"
                        className="input-text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault(); // Запобігає створенню нового рядка
                                handleSendMessage();
                            }
                        }}
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
