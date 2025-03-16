import React, { useEffect, useState } from "react";
import { ProfileInfo } from "../types";
import { Button, message, Modal, Table, Typography } from "antd";
import { ProfileInfoService } from "../../../services/profile.info.service";
import InterestsForm from "./form";
import Navbar from "../../profile/adminPage/Navbar";

const { Title } = Typography;

const InterestsList: React.FC = () => {
    const [interests, setInterests] = useState<ProfileInfo[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<ProfileInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchInterests();
    }, []);

    const fetchInterests = async () => {
        setLoading(true);
        try {
            const data = await ProfileInfoService.getInterests();
            setInterests(data);
        } catch (error) {
            message.error("Failed to load interests");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure? This action cannot be undone.")) {
            try {
                await ProfileInfoService.deleteInterests(id.toString());
                message.success("Interest deleted successfully");
                fetchInterests();
            } catch (error) {
                message.error("Failed to delete interest");
            }
        }
    };

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, interest: ProfileInfo) => (
                <>
                    <Button
                        type="link"
                        onClick={() => {
                            setSelectedInterests(interest);
                            setModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(interest.id)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Navbar />
            <div style={{ flex: 1, padding: "20px" }}>
                <Title level={2}>Interests</Title>
                <Button
                    type="primary"
                    onClick={() => {
                        setSelectedInterests({ id: 0, name: "" });
                        setModalVisible(true);
                    }}
                    style={{ marginBottom: "20px" }}
                >
                    Create New Interest
                </Button>
                <Table dataSource={interests} columns={columns} rowKey="id" loading={loading} />

                {modalVisible && (
                    <InterestsForm
                        interests={selectedInterests}
                        onSave={() => {
                            setModalVisible(false);
                            fetchInterests();
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default InterestsList;