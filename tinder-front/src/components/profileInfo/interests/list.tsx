import React, { useEffect, useState } from "react";
import { ProfileInfo } from "../types";
import { Button, message, Modal, Table, Typography } from "antd";
import { ProfileInfoService } from "../../../services/profile.info.service";
import InterestsForm from "./form";
const { Title } = Typography;

const InterestsList: React.FC = () => {
    const [interesedsIn, setInteresedsIn] = useState<ProfileInfo[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<ProfileInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchInteresedsIn();
    }, []);

    const fetchInteresedsIn = async () => {
        setLoading(true);
        try {
            const data = await ProfileInfoService.getInterests();
            setInteresedsIn(data);
        } catch (error) {
            message.error("Failed to load profiles");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure? This action cannot be undone.")) {
            try {
                await ProfileInfoService.deleteInterests(id.toString());
                message.success("Profile deleted successfully");
                fetchInteresedsIn();
            } catch (error) {
                message.error("Failed to delete profile");
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
            render: (_: any, interests: ProfileInfo) => (
                <>
                    <Button
                        type="link"
                        onClick={() => {
                            setSelectedInterests(interests);
                            setModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(interests.id)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <Title level={2}>Interests</Title>
            <Button
                type="primary"
                onClick={() => {
                    setSelectedInterests({ id: 0, name: "" });
                    setModalVisible(true);
                }}
                style={{ marginBottom: "20px" }}
            >
                Create New Profile
            </Button>
            <Table dataSource={interesedsIn} columns={columns} rowKey="id" loading={loading} />

            {modalVisible && (
                <InterestsForm
                    interests={selectedInterests}
                    onSave={() => {
                        setModalVisible(false);
                        fetchInteresedsIn();
                    }}
                />
            )}
        </div>
    );
};

export default InterestsList;
