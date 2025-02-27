import React, {useState} from "react";
import CustomMessage from "./message";

interface ChatProps {
    messages: { id: string; text: string; user: string }[];
    chatRoom: string;
    sendMessage: (message: string) => void;
    closeChat: () => void;
}

export const Chat: React.FC<ChatProps> = ({ messages, chatRoom, closeChat, sendMessage }) => {

    const[message,setMessage] = useState("");

    const onSendMessage = () =>{
        sendMessage(message);
        setMessage("");
    }

    return (
        <div className="">
            <div className="flex flex-row justify-between mb-5">
                <h2 className="text-xl font-bold">{chatRoom}</h2>
                <button
                    onClick={closeChat}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    X
                </button>
            </div>
            <div className="flex flex-col overflow-auto scroll-smooth h-96 gap-3 pb-3">
                {messages.map(({ id, text, user }) => (
                    <CustomMessage key={id} messageInfo={{ userName: user, message: text }} />
                ))}
            </div>
            <div>
                <input type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter a message..."/>
                <button onClick={onSendMessage}>Send</button>

            </div>
        </div>
    );
};
