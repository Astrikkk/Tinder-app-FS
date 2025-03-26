import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { ProfileInfo } from "../types";
import { ProfileInfoService } from "../../../services/profile.info.service";
import { useNavigate } from "react-router-dom";

interface InterestsFormProps {
    interests: ProfileInfo | null;
    onSave: () => void;
}

const InterestsForm: React.FC<InterestsFormProps> = ({ interests, onSave }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (interests) {
            form.setFieldsValue({ name: interests.name });
        } else {
            form.resetFields();
        }
    }, [interests, form]);

    const handleSubmit = async (values: { name: string }) => {
        setLoading(true);
        try {
            if (interests && interests.id) {
                await ProfileInfoService.updateInterests(interests.id.toString(), { name: values.name });
                message.success("Updated successfully");
            } else {
                await ProfileInfoService.createInterests({ name: values.name });
                message.success("Created successfully");
            }

            onSave();
            navigate("/interests");
        } catch (error) {
            message.error("Failed to save data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", background: "#fff", borderRadius: "8px" }}>
            <h2>{interests ? "MyProfile Interests" : "Create Interests"}</h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter a name" }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {interests ? "Update" : "Create"}
                    </Button>
                    <Button style={{ marginLeft: "10px" }} onClick={() => navigate("/interests")}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default InterestsForm;
