import React, { useState } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { Col, Row } from "antd";
import ChatRoom from "./ChatRoom";
import JoinChatForm from "./JoinChatForm";
import { Layout, Typography } from "antd"; // ✅ Додаємо Layout замість Container

const { Content } = Layout;
const { Title } = Typography;

interface Message {
    username: string;
    msg: string;
}

const WaitingRoom: React.FC = () => {
    const [conn, setConnection] = useState<HubConnection | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatRoom, setChatRoom] = useState<string>("");

    const joinChatRoom = async (username: string, chatroom: string) => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl("http://localhost:7034/Chat", { withCredentials: true })
                .configureLogging(LogLevel.Information)
                .build();

            connection.on("ReceiveMessage", (username: string, msg: string) => {
                setMessages((prevMessages) => [...prevMessages, { username, msg }]);
            });

            await connection.start();
            await connection.invoke("JoinSpecificChatRoom", { username, chatroom });

            setConnection(connection);
            setChatRoom(chatroom);
        } catch (e) {
            console.error(e);
        }
    };

    const sendMessage = async (message: string) => {
        try {
            if (conn) {
                await conn.invoke("SendMessage", message);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Layout style={{ minHeight: "100vh", padding: "20px" }}>
            <Content>
                <Row justify="center" style={{ marginBottom: "20px" }}>
                    <Col span={24}>
                        <Title level={2} style={{ textAlign: "center" }}>
                            Welcome to the F1 ChatApp
                        </Title>
                    </Col>
                </Row>
                <Row justify="center">
                    <Col span={24}>
                        {!conn ? (
                            <JoinChatForm joinChatRoom={joinChatRoom} />
                        ) : (
                            <ChatRoom messages={messages} sendMessage={sendMessage} />
                        )}
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default WaitingRoom;
