import React, { useEffect, useState } from "react";
import { ProfileInfo } from "../types";
import { Button, message, Modal, Table, Typography } from "antd";
import { ProfileInfoService } from "../../../services/profile.info.service";
import InterestedInForm from "./form";
import Navbar from "../../profile/adminPage/Navbar";

const { Title } = Typography;

const InteresedInList: React.FC = () => {
    const [interesedsIn, setInteresedsIn] = useState<ProfileInfo[]>([]);
    const [selectedInterestedIn, setSelectedInterestedIn] = useState<ProfileInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchInteresedsIn();
    }, []);

    const fetchInteresedsIn = async () => {
        setLoading(true);
        try {
            const data = await ProfileInfoService.getInterestedIn();
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
                await ProfileInfoService.deleteInterestedIn(id.toString());
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
            render: (_: any, interestedIn: ProfileInfo) => (
                <>
                    <Button
                        type="link"
                        onClick={() => {
                            setSelectedInterestedIn(interestedIn);
                            setModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(interestedIn.id)}>
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
                <Title level={2}>Interested In</Title>
                <Button
                    type="primary"
                    onClick={() => {
                        setSelectedInterestedIn({ id: 0, name: "" });
                        setModalVisible(true);
                    }}
                    style={{ marginBottom: "20px" }}
                >
                    Create New Profile
                </Button>
                <Table dataSource={interesedsIn} columns={columns} rowKey="id" loading={loading} />

                {modalVisible && (
                    <InterestedInForm
                        interestedIn={selectedInterestedIn}
                        onSave={() => {
                            setModalVisible(false);
                            fetchInteresedsIn();
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default InteresedInList;