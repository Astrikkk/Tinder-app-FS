import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { ProfileInfo } from "../types";
import { ProfileInfoService } from "../../../services/profile.info.service";
import { useNavigate } from "react-router-dom";

interface LookingForFormProps {
    lookingFor: ProfileInfo | null;
    onSave: () => void;
}

const LookingForForm: React.FC<LookingForFormProps> = ({ lookingFor, onSave }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (lookingFor) {
            form.setFieldsValue({ name: lookingFor.name });
        } else {
            form.resetFields();
        }
    }, [lookingFor, form]);

    const handleSubmit = async (values: { name: string }) => {
        setLoading(true);
        try {
            if (lookingFor && lookingFor.id) {
                await ProfileInfoService.updateLookingFor(lookingFor.id.toString(), { name: values.name });
                message.success("Updated successfully");
            } else {
                await ProfileInfoService.createLookingFor({ name: values.name });
                message.success("Created successfully");
            }

            onSave();
            navigate("/looking-for");
        } catch (error) {
            message.error("Failed to save data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", background: "#fff", borderRadius: "8px" }}>
            <h2>{lookingFor ? "Edit Looking For" : "Create Looking For"}</h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter a name" }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {lookingFor ? "Update" : "Create"}
                    </Button>
                    <Button style={{ marginLeft: "10px" }} onClick={() => navigate("/looking-for")}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LookingForForm;
