import React, { useEffect, useState } from "react";
import { Modal, Table, Button, message, Typography } from "antd";
import { ProfileItemDTO } from "../../profile/types";
import ProfileForm from "../../profile/ProfileForm";
import { ProfileService } from "../../../services/profile.service";
import { useNavigate } from "react-router-dom";
import { RoleService } from "../../../services/role.service";
import EmailCell from "../../profile/EmailCell";
import { jwtDecode } from "jwt-decode";
import Navbar from "../../Navbar";

const { Title } = Typography;

const ReportedList: React.FC = () => {
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
            const data = await ProfileService.getReportedProfiles();
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

    const testGetRoles = async (userId: string) => {
        try {
            const roles = await RoleService.getUserRoles(`${userId}`);
            setUserRoles(roles);
            message.success(`Roles: ${roles.join(", ")}`);
        } catch (error) {
            console.error("Error fetching roles:", error);
            message.error("Failed to fetch roles");
        }
    };

    const testAddRole = async (userId: string) => {
        try {
            await RoleService.addRoleToUser(`${userId}`, "Admin");
            message.success("Role added successfully.");
        } catch (error) {
            console.error("Error adding role:", error);
            message.error("Failed to add role");
        }
    };

    const testRemoveRole = async (userId: string) => {
        try {
            await RoleService.removeRoleFromUser(`${userId}`, "Admin");
            message.success("Role removed successfully.");
        } catch (error) {
            console.error("Error removing role:", error);
            message.error("Failed to remove role");
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
        {
            title: "Role",
            key: "role",
            render: (_: any, profile: ProfileItemDTO) => (
                <>
                    <Button type="link" onClick={() => testGetRoles(profile.userId.toString())}>
                        Get Roles
                    </Button>
                    <Button type="link" onClick={() => testAddRole(profile.userId.toString())}>
                        Add Admin Role
                    </Button>
                    <Button type="link" danger onClick={() => testRemoveRole(profile.userId.toString())}>
                        Remove Admin Role
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

export default ReportedList;
