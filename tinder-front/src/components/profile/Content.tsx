import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, message, Typography } from "antd";
import { ProfileItemDTO } from "./types";
import ProfileForm from "./ProfileForm";

const { Title } = Typography;
const API_URL = `${process.env.REACT_APP_API}/Home`;
const API_URL_IMG = `${process.env.REACT_APP}`;

const ProfileList: React.FC = () => {
    const [profiles, setProfiles] = useState<ProfileItemDTO[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<ProfileItemDTO | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setProfiles(response.data);
        } catch (error) {
            message.error("Failed to load profiles");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "This action cannot be undone.",
            okText: "Yes, delete",
            okType: "danger",
            cancelText: "Cancel",
            async onOk() {
                try {
                    await axios.delete(`${API_URL}/${id}`);
                    message.success("Profile deleted successfully");
                    fetchProfiles();
                } catch (error) {
                    message.error("Failed to delete profile");
                }
            },
        });
    };

    const columns = [
        {
            title: "Profile Image",
            dataIndex: "imagePath",
            key: "imagePath",
            render: (imagePath: string) => {
                console.log("Image Path:", `http://localhost:7034${imagePath}`); // Логування шляху до фото
                return imagePath ? <img src={`http://localhost:7034${imagePath}`} alt="Profile" width={50} /> : "No Image";
            },
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
        },
        {
            title: "Looking For",
            dataIndex: "lookingFor",
            key: "lookingFor",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, profile: ProfileItemDTO) => (
                <>
                    <Button type="link" onClick={() => setSelectedProfile(profile)}>
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(profile.id)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];


    return (
        <div style={{ padding: "20px" }}>
            <Title level={2}>Profiles</Title>
            <Button
                type="primary"
                onClick={() =>
                    setSelectedProfile({
                        id: 0,
                        name: "",
                        imagePath: "",
                        interests: [],
                        photos: [],
                        sexualOrientation: "",
                        gender: "",
                        lookingFor: "",
                        interestedIn: "",
                        birthDay: new Date(),
                    })
                }
                style={{ marginBottom: "20px" }}
            >
                Create New Profile
            </Button>
            <Table dataSource={profiles} columns={columns} rowKey="id" loading={loading} />

            {selectedProfile && (
                <Modal
                    open={!!selectedProfile}
                    title={selectedProfile.id ? "Edit Profile" : "Create Profile"}
                    onCancel={() => setSelectedProfile(null)}
                    footer={null}
                >
                    <ProfileForm
                        profile={selectedProfile}
                        onClose={() => setSelectedProfile(null)}
                        onSave={() => {
                            setSelectedProfile(null);
                            fetchProfiles();
                        }}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ProfileList;
