import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment'; // Import moment to handle date formatting
import { ProfileItemDTO } from './types';

const { Option } = Select;
const API_URL = `${process.env.REACT_APP_API}/Home`;

interface ProfileFormProps {
    profile: ProfileItemDTO | null;
    onClose: () => void;
    onSave: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onClose, onSave }) => {
    const [form] = Form.useForm();
    const [genders, setGenders] = useState<any[]>([]);
    const [interests, setInterests] = useState<any[]>([]);
    const [lookingFor, setLookingFor] = useState<any[]>([]);
    const [sexualOrientations, setSexualOrientations] = useState<any[]>([]);
    const [image, setImage] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gendersRes, interestsRes, lookingForRes, sexualOrientationsRes] = await Promise.all([
                    axios.get(`${API_URL}/genders`),
                    axios.get(`${API_URL}/interests`),
                    axios.get(`${API_URL}/looking-for`),
                    axios.get(`${API_URL}/sexual-orientation`),
                ]);
                setGenders(gendersRes.data);
                setInterests(interestsRes.data);
                setLookingFor(lookingForRes.data);
                setSexualOrientations(sexualOrientationsRes.data);
            } catch (error) {
                message.error('Failed to load data');
            }
        };
        fetchData();

        if (profile) {
            // Pre-fill form if editing an existing profile
            form.setFieldsValue({
                name: profile.name,
                birthDay: profile.birthDay ? moment(profile.birthDay) : null, // Convert birthDay to moment object if present
                genderId: profile.gender,
                interestedInId: profile.interestedIn,
                lookingForId: profile.lookingFor,
                sexualOrientationId: profile.sexualOrientation,
                interests: profile.interests,
            });
            // Handle image if any
            if (profile.imagePath) {
                setImage(profile.imagePath);
            }
        } else {
            form.resetFields();
        }
    }, [profile, form]);

    const onFinish = async (values: any) => {
        try {
            const formData = new FormData();
            formData.append("Name", values.name);
            formData.append("BirthDay", values.birthDay ? values.birthDay.format("YYYY-MM-DD") : "");
            formData.append("GenderId", values.genderId.toString());
            formData.append("InterestedInId", values.interestedInId.toString());
            formData.append("LookingForId", values.lookingForId.toString());
            formData.append("SexualOrientationId", values.sexualOrientationId.toString());

            // Додаємо масив `InterestIds`
            if (values.interests && values.interests.length > 0) {
                values.interests.forEach((interestId: number) => {
                    formData.append("InterestIds", interestId.toString());
                });
            }

            // Додаємо зображення, якщо воно вибране
            if (image) {
                formData.append("Image", image);
            }

            console.log("FormData content:");
            for (const [key, value] of formData as any) {
                console.log(key, value);
            }



            if (profile && profile.id) {
                await axios.put(`${API_URL}/${profile.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                message.success("Profile updated successfully");
            } else {
                await axios.post(`${API_URL}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                message.success("Profile created successfully");
            }

            onSave();
        } catch (error: any) {
            console.error("Error saving profile:", error.response?.data || error.message);
            message.error("Failed to save profile");
        }
    };



    const handleImageChange = (info: any) => {
        if (info.file && info.file.originFileObj) {
            setImage(info.file.originFileObj);
        }
    };


    return (
        <Form form={form} onFinish={onFinish} layout="vertical" encType="multipart/form-data">
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="birthDay"
                label="Birthday"
                rules={[{ required: true, message: 'Please select your birthday!' }]}
            >
                <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
                name="genderId"
                label="Gender"
                rules={[{ required: true, message: 'Please select your gender!' }]}
            >
                <Select>
                    {genders.map((gender) => (
                        <Option key={gender.id} value={gender.id}>
                            {gender.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="interestedInId"
                label="Interested In"
                rules={[{ required: true, message: 'Please select what you are interested in!' }]}
            >
                <Select>
                    {lookingFor.map((option) => (
                        <Option key={option.id} value={option.id}>
                            {option.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="lookingForId"
                label="Looking For"
                rules={[{ required: true, message: 'Please select what you are looking for!' }]}
            >
                <Select>
                    {lookingFor.map((option) => (
                        <Option key={option.id} value={option.id}>
                            {option.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="sexualOrientationId"
                label="Sexual Orientation"
                rules={[{ required: true, message: 'Please select your sexual orientation!' }]}
            >
                <Select>
                    {sexualOrientations.map((orientation) => (
                        <Option key={orientation.id} value={orientation.id}>
                            {orientation.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item name="interests" label="Interests">
                <Select mode="multiple" placeholder="Select your interests">
                    {interests.map((interest) => (
                        <Option key={interest.id} value={interest.id}>
                            {interest.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item label="Profile Image">
                <Upload
                    showUploadList={false}
                    beforeUpload={(file) => {
                        setImage(file);
                        return false; // Зупиняємо автоматичне завантаження Ant Design
                    }}
                    onChange={handleImageChange}
                    accept="image/*"
                >
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {profile ? 'Update Profile' : 'Create Profile'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ProfileForm;
