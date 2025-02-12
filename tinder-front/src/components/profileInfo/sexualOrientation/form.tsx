import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { ProfileInfo } from "../types";
import { ProfileInfoService } from "../../../services/profile.info.service";
import { useNavigate } from "react-router-dom";

interface SexualOrientationFormProps {
    sexualOrientation: ProfileInfo | null;
    onSave: () => void;
}

const SexualOrientationForm: React.FC<SexualOrientationFormProps> = ({ sexualOrientation, onSave }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (sexualOrientation) {
            form.setFieldsValue({ name: sexualOrientation.name });
        } else {
            form.resetFields();
        }
    }, [sexualOrientation, form]);

    const handleSubmit = async (values: { name: string }) => {
        setLoading(true);
        try {
            if (sexualOrientation && sexualOrientation.id) {
                await ProfileInfoService.updateSexualOrientation(sexualOrientation.id.toString(), { name: values.name });
                message.success("Updated successfully");
            } else {
                await ProfileInfoService.createSexualOrientation({ name: values.name });
                message.success("Created successfully");
            }

            onSave();
            navigate("/sexual-orientation");
        } catch (error) {
            message.error("Failed to save data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", background: "#fff", borderRadius: "8px" }}>
            <h2>{sexualOrientation ? "Edit Sexual Orientation" : "Create Sexual Orientation"}</h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter a name" }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {sexualOrientation ? "Update" : "Create"}
                    </Button>
                    <Button style={{ marginLeft: "10px" }} onClick={() => navigate("/sexual-orientation")}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SexualOrientationForm;
