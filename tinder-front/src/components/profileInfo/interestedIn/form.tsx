import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { ProfileInfo } from "../types";
import { ProfileInfoService } from "../../../services/profile.info.service";
import { useNavigate } from "react-router-dom";

interface InterestedInFormProps {
    interestedIn: ProfileInfo | null;
    onSave: () => void;
}

const InterestedInForm: React.FC<InterestedInFormProps> = ({ interestedIn, onSave }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (interestedIn) {
            form.setFieldsValue({ name: interestedIn.name });
        } else {
            form.resetFields();
        }
    }, [interestedIn, form]);

    const handleSubmit = async (values: { name: string }) => {
        setLoading(true);
        try {
            if (interestedIn && interestedIn.id) {
                await ProfileInfoService.updateInterestedIn(interestedIn.id.toString(), { name: values.name });
                message.success("Updated successfully");
            } else {
                await ProfileInfoService.createInterestedIn({ name: values.name });
                message.success("Created successfully");
            }

            onSave();
            navigate("/interested-in");
        } catch (error) {
            message.error("Failed to save data");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", background: "#fff", borderRadius: "8px" }}>
            <h2>{interestedIn ? "Edit Interested In" : "Create Interested In"}</h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter a name" }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {interestedIn ? "Update" : "Create"}
                    </Button>
                    <Button style={{ marginLeft: "10px" }} onClick={() => navigate("/interested-in")}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default InterestedInForm;
