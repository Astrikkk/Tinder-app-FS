import React from "react";
import { Row, Col, Typography } from "antd";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";

const { Title } = Typography;

interface Message {
    username: string;
    msg: string;
}

interface ChatRoomProps {
    messages: Message[];
    sendMessage: (message: string) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ messages, sendMessage }) => {
    return (
        <div style={{ padding: "20px" }}>
            <Row justify="center" style={{ marginBottom: "20px" }}>
                <Col span={20}>
                    <Title level={2}>Chat Room</Title>
                </Col>
            </Row>
            <Row justify="center" gutter={[16, 16]}>
                <Col span={20}>
                    <MessageContainer messages={messages} />
                </Col>
                <Col span={20}>
                    <SendMessageForm sendMessage={sendMessage} />
                </Col>
            </Row>
        </div>
    );
};

export default ChatRoom;
