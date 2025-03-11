import { useState } from "react";
import React from "react";

import { Button, Input, Form } from "antd";

interface SendMessageFormProps {
    sendMessage: (message: string) => void;
}

const SendMessageForm: React.FC<SendMessageFormProps> = ({ sendMessage }) => {
    const [msg, setMessage] = useState<string>("");

    return (
        <Form
            onFinish={() => {
                if (msg.trim()) {
                    sendMessage(msg);
                    setMessage("");
                }
            }}
        >
            <Form.Item>
                <Input.Group compact>
                    <Input
                        value={msg}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                        style={{ width: "calc(100% - 90px)" }} // Задаємо ширину
                    />
                    <Button type="primary" htmlType="submit" disabled={!msg.trim()}>
                        Send
                    </Button>
                </Input.Group>
            </Form.Item>
        </Form>
    );
};

export default SendMessageForm;
