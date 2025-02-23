import React, { useEffect, useState } from "react";
import { Modal, Table, Button, message, Typography } from "antd";
import { ProfileItemDTO } from "./types";
import ProfileForm from "./ProfileForm";
import { ProfileService } from "../../services/profile.service";
import { useNavigate } from "react-router-dom";
import {RoleService} from "../../services/role.service";

const { Title } = Typography;

const ProfileList: React.FC = () => {
    const [profiles, setProfiles] = useState<ProfileItemDTO[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<ProfileItemDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [userRoles, setUserRoles] = useState<string[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const data = await ProfileService.getProfiles();
            console.log("Fetched profiles data:", data); // Перевірка API-відповіді

            setProfiles(data.map((profile: any) => (profile)));
        } catch (error: any) {
            console.error("Error fetching profiles:", error);
            message.error("Failed to load profiles");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem("token");
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

    // Тестові функції для роботи з ролями
    const testGetRoles = async () => {
        try {
            const roles = await RoleService.getUserRoles("puzyrko2007@gmail.com");
            setUserRoles(roles);
            message.success(`Roles: ${roles.join(", ")}`);
        } catch (error) {
            console.error("Error fetching roles:", error);
            message.error("Failed to fetch roles");
        }
    };

    const testAddRole = async () => {
        try {
            await RoleService.addRoleToUser("puzyrko2007@gmail.com", "Admin");
            message.success("Role added successfully.");
            testGetRoles(); // Оновлення списку ролей
        } catch (error) {
            console.error("Error adding role:", error);
            message.error("Failed to add role");
        }
    };

    const testRemoveRole = async () => {
        try {
            await RoleService.removeRoleFromUser("puzyrko2007@gmail.com", "Admin");
            message.success("Role removed successfully.");
            testGetRoles(); // Оновлення списку ролей
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

            <button onClick={handleLogout} className="w-full text-left">
                Logout
            </button>
            <Table dataSource={profiles} columns={columns} rowKey="id" loading={loading} />

            {/* Кнопки для тестування сервісу ролей */}
            <div style={{ marginTop: "20px" }}>
                <Title level={4}>Test Role Service</Title>
                <Button onClick={testGetRoles} type="primary" style={{ marginRight: "10px" }}>
                    Get User Roles
                </Button>
                <Button onClick={testAddRole} type="default" style={{ marginRight: "10px" }}>
                    Add Admin Role
                </Button>
                <Button onClick={testRemoveRole} type="dashed">
                    Remove Admin Role
                </Button>
            </div>

            {/* Відображення отриманих ролей */}
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
    );
};

export default ProfileList;
