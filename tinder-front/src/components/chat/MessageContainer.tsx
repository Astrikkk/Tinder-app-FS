import React from "react";

interface Message {
    username: string;
    msg: string;
}

interface MessageContainerProps {
    messages?: Message[];
}

const MessageContainer: React.FC<MessageContainerProps> = ({ messages = [] }) => {
    return (
        <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th style={{ border: "1px solid black", padding: "8px" }}>Message</th>
                </tr>
                </thead>
                <tbody>
                {messages.map((msg, index) => (
                    <tr key={index}>
                        <td style={{ border: "1px solid black", padding: "8px" }}>
                            {msg.msg} - <strong>{msg.username}</strong>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MessageContainer;
