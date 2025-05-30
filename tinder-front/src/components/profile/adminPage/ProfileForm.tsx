import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import {ProfileCreateDTO, ProfileItemDTO} from '../types';
import { ProfileService } from "../../../services/profile.service";
import { ProfileInfoService } from "../../../services/profile.info.service";
import { jwtDecode } from "jwt-decode";

import JwtPayload from "jwt-decode";

import { useLocation } from 'react-router-dom';
import {JwtService} from "../../../services/jwt.service";
const { Option } = Select;
interface ProfileFormProps {
    profile: ProfileCreateDTO | null;
    onSave: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSave }) => {
    const [form] = Form.useForm();
    const [genders, setGenders] = useState<any[]>([]);
    const [interests, setInterests] = useState<any[]>([]);
    const [interestedIn, setInterestedIn] = useState<any[]>([]);
    const [lookingFor, setLookingFor] = useState<any[]>([]);
    const [sexualOrientations, setSexualOrientations] = useState<any[]>([]);
    const [image, setImage] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gendersRes, interestsRes, interestedInRes, lookingForRes, sexualOrientationsRes] = await Promise.all([
                    ProfileInfoService.getGenders(),
                    ProfileInfoService.getInterests(),
                    ProfileInfoService.getInterestedIn(),
                    ProfileInfoService.getLookingFor(),
                    ProfileInfoService.getSexualOrientation(),
                ]);
                setGenders(gendersRes);
                setInterests(interestsRes);
                setInterestedIn(interestedInRes);
                setLookingFor(lookingForRes);
                setSexualOrientations(sexualOrientationsRes);
            } catch (error) {
                message.error('Failed to load data');
            }
        };
        fetchData();

        if (profile) {
            console.log("profile",profile);
            form.setFieldsValue({
                name: profile.name,
                birthDay: profile.birthDay ? moment(profile.birthDay) : null,
                genderId: profile.gender.id,
                interestedInId: profile.interestedIn.id,
                lookingForId: profile.lookingFor.id,
                sexualOrientationId: profile.sexualOrientation.id,
                interests: profile.interests,
            });
            if (profile.imagePath) {
                setImage(profile.imagePath);
            }
        } else {
            form.resetFields();
        }
    }, [profile, form]);

    const onFinish = async (values: any) => {

        console.log("Values send server:", values);
        const token = localStorage.getItem("token");
        const userId = JwtService.getUserIdFromToken(token);

        if (!userId) {
            message.error("Не вдалося отримати ID користувача. Увійдіть знову.");
            return;
        } else {
            message.success(`Отримано userId: ${userId}`);
        }
    
        const formData = new FormData();
        formData.append("UserId", userId); // Додаємо userId
        formData.append("Name", values.name);
        formData.append("BirthDay", values.birthDay ? values.birthDay.format("YYYY-MM-DD") : "");
        formData.append("GenderId", values.genderId);
        formData.append("InterestedInId", values.interestedInId);
        formData.append("LookingForId", values.lookingForId.toString());
        formData.append("SexualOrientationId", values.sexualOrientationId.toString());
    
        if (values.interests && values.interests.length > 0) {
            values.interests.forEach((interestId: number) => {
                formData.append("InterestIds", interestId.toString());
            });
        }
    
        if (image) {
            formData.append("Image", image);
        }
        console.log("FormData contains:");
        formData.forEach((value, key) => {
            console.log(key, value);
        });


        try {

            if (profile && profile.id) {
                await ProfileService.updateProfile(profile.id.toString(), formData);
                message.success("Profile updated successfully");
            } else {

                message.error("id not found");
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

    const gendersData = genders.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    return (
        <div className="profile-form-container">

            <Form form={form} onFinish={onFinish} layout="vertical" encType="multipart/form-data">
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input your name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="birthDay" label="Birthday" rules={[{ required: true, message: 'Please select your birthday!' }]}>
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    label="Gender"
                    name="genderId"
                    htmlFor="genderId"
                    rules={[{ required: true, message: "Це поле є обов'язковим!" }]}
                >
                    <Select placeholder="Оберіть категорію: " options={gendersData} />
                </Form.Item>
                {/*<Form.Item name="genderId" label="Gender" rules={[{ required: true, message: 'Please select your gender!' }]}>*/}
                {/*    <Select>*/}
                {/*        {genders.map((gender) => (*/}
                {/*            <Option key={gender.id} value={gender.id}>{gender.name}</Option>*/}
                {/*        ))}*/}
                {/*    </Select>*/}
                {/*</Form.Item>*/}
                <Form.Item name="interestedInId" label="Interested In" rules={[{ required: true, message: 'Please select what you are interested in!' }]}>
                    <Select>
                        {interestedIn.map((item) => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="lookingForId" label="Looking For" rules={[{ required: true, message: 'Please select what you are looking for!' }]}>
                    <Select>
                        {lookingFor.map((option) => (
                            <Option key={option.id} value={option.id}>{option.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="sexualOrientationId" label="Sexual Orientation" rules={[{ required: true, message: 'Please select your sexual orientation!' }]}>
                    <Select>
                        {sexualOrientations.map((orientation) => (
                            <Option key={orientation.id} value={orientation.id}>{orientation.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="interests" label="Interests">
                    <Select mode="multiple" placeholder="Select your interests">
                        {interests.map((interest) => (
                            <Option key={interest.id} value={interest.id}>{interest.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Profile Image">
                    <Upload showUploadList={false} beforeUpload={(file) => { setImage(file); return false; }} onChange={handleImageChange} accept="image/*">
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">{profile ? 'Update Profile' : 'Create Profile'}</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ProfileForm;
