import React, { useEffect, useState } from "react";
import {Modal, Table, Button, message, Typography } from "antd";
import { ProfileItemDTO } from "./types";
import ProfileForm from "./ProfileForm";
import { ProfileService } from "../../services/profile.service";
import {useNavigate} from "react-router-dom";

const { Title } = Typography;

const ProfileList: React.FC = () => {
    const [profiles, setProfiles] = useState<ProfileItemDTO[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<ProfileItemDTO | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const data = await ProfileService.getProfiles();
            setProfiles(data.map(profile => ({
                ...profile,
                id: profile.id ? Number(profile.id) : 0,
                imagePath: profile.imagePath || "",
                photos: profile.photos || [],
                birthDay: new Date(profile.birthDay),
            })));
        } catch (error) {
            message.error("Failed to load profiles");
        } finally {
            setLoading(false);
        }
    };
    const handleLogout = async () => {
        try {
            localStorage.removeItem("token");
            console.log("Logout successful!");
            navigate("/auth");
        } catch (error: any) {
            console.error("Logout error:", error);
            alert(error.message || "An unexpected error occurred.");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure? This action cannot be undone.")) {
            try {
                await ProfileService.deleteProfile(id.toString());
                message.success("Profile deleted successfully");
                fetchProfiles();
            } catch (error) {
                message.error("Failed to delete profile");
            }
        }
    };

    const columns = [
        {
            title: "Profile Image",
            dataIndex: "imagePath",
            key: "imagePath",
            render: (imagePath: string) => (
                imagePath ? <img src={`http://localhost:7034${imagePath}`} alt="Profile" width={50}/> : "No Image"
            ),
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
        <div style={{padding: "20px"}}>
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
                style={{marginBottom: "20px"}}
            >
                Create New Profile
            </Button>

            <button onClick={handleLogout} className="w-full text-left">
                Logout
            </button>
            <Table dataSource={profiles} columns={columns} rowKey="id" loading={loading}/>

            {selectedProfile && (
                <Modal
                    open={!!selectedProfile}
                    title={selectedProfile.id ? "Edit Profile" : "Create Profile"}
                    onCancel={() => setSelectedProfile(null)}
                    footer={null}
                >
                    <ProfileForm
                        profile={selectedProfile}
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