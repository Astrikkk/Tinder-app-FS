import React, { useState } from "react";
import ChatForm from "./chatForm";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Chat } from "./chat";
import {sendMessage} from "@microsoft/signalr/dist/esm/Utils";

const WaitingRoom = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [messages, setMessages] = useState<{ id: string; text: string; user: string }[]>([]);
    const [chatRoom, setChatRoom] = useState<string>("");

    const joinChat = async (userName: string, chatRoom: string) => {
        var connected = new HubConnectionBuilder()
            .withUrl("http://localhost:7034/chathub", { withCredentials: true })
            .withAutomaticReconnect()
            .build();

        connected.on("ReceiveMessage", (userName, message) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: crypto.randomUUID(), text: message, user: userName }
            ]);
        });

        try {
            await connected.start();
            await connected.invoke("JoinChat", { userName, chatRoom });

            setConnection(connected);
            setChatRoom(chatRoom);
            console.log(connection);
        } catch (error) {
            console.log(error);
        }
    };

    const sendMessage = (message: string) => {
        connection?.invoke("SendMessage", message)
    }

    const closeChat = async () => {
        await connection?.stop();
        setConnection(null);
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg">
            {connection ? (
                <Chat messages={messages} chatRoom={chatRoom} sendMessage={sendMessage} closeChat={closeChat} />
            ) : (
                <ChatForm joinChat={joinChat} />
            )}
        </div>
    );
};

export default WaitingRoom;
