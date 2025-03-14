import React, { useEffect, useState } from "react";
import { Modal, Table, Button, message, Typography } from "antd";
import { ProfileItemDTO } from "./types";
import ProfileForm from "./ProfileForm";
import { ProfileService } from "../../services/profile.service";
import { useNavigate } from "react-router-dom";
import { RoleService } from "../../services/role.service";
import EmailCell from "./EmailCell";
import { jwtDecode } from "jwt-decode";
import Navbar from "../Navbar"; // Імпортуємо Navbar

const { Title } = Typography;

const ProfileList: React.FC = () => {
    const [profiles, setProfiles] = useState<ProfileItemDTO[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<ProfileItemDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [userRoles, setUserRoles] = useState<string[]>([]);


    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const data = await ProfileService.getProfiles();
            console.log("Fetched profiles data:", data); // Check API response

            setProfiles(data.map((profile: any) => (profile)));
        } catch (error: any) {
            console.error("Error fetching profiles:", error);
            message.error("Failed to load profiles");
        } finally {
            setLoading(false);
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
                imagePath ? <img src={`http://localhost:7034${imagePath}`} alt="Photo" width={50} /> : "No Image"
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Gender",
            dataIndex: ["gender", "name"],
            key: "gender",
        },
        {
            title: "Looking For",
            dataIndex: ["lookingFor", "name"],
            key: "lookingFor",
        },
        {
            title: "Email",
            key: "email",
            render: (_: any, profile: ProfileItemDTO) => <EmailCell userId={profile.userId} />,
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
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Navbar зліва */}
            <Navbar />

            {/* Основний контент */}
            <div style={{ flex: 1, padding: "20px" }}>
                <Title level={2}>Profiles</Title>



                <Table dataSource={profiles} columns={columns} rowKey="id" loading={loading} />

                {userRoles.length > 0 && (
                    <div style={{ marginTop: "10px" }}>
                        <Title level={5}>User Roles:</Title>
                        <p>{userRoles.join(", ")}</p>
                    </div>
                )}

                {selectedProfile && selectedProfile.id !== 0 && (
                    <Modal
                        open={!!selectedProfile}
                        title="Edit Profile"
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
        </div>
    );
};

export default ProfileList;
