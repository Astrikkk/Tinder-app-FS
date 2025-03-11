import React, { useState } from "react";
import { Button, Input, Form } from "antd";

interface JoinChatFormProps {
    joinChatRoom: (username: string, chatroom: string) => void;
}

const JoinChatForm: React.FC<JoinChatFormProps> = ({ joinChatRoom }) => {
    const [username, setUsername] = useState<string>("");
    const [chatroom, setChatroom] = useState<string>("");

    const handleJoin = () => {
        if (username.trim() && chatroom.trim()) {
            joinChatRoom(username, chatroom);
        }
    };

    return (
        <Form
            onFinish={handleJoin}
            layout="vertical"
            style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}
        >
            <Form.Item label="Username">
                <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                />
            </Form.Item>

            <Form.Item label="Chatroom">
                <Input
                    value={chatroom}
                    onChange={(e) => setChatroom(e.target.value)}
                    placeholder="Enter chatroom name"
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" disabled={!username.trim() || !chatroom.trim()}>
                    Join Chat
                </Button>
            </Form.Item>
        </Form>
    );
};

export default JoinChatForm;
