import React, { useEffect, useState } from "react";
import { ProfileInfo } from "../types";
import { Button, message, Modal, Table, Typography } from "antd";
import { ProfileInfoService } from "../../../services/profile.info.service";
import LookingForForm from "./form";
import Navbar from "../../Navbar";

const { Title } = Typography;

const LookingForList: React.FC = () => {
    const [lookingForList, setLookingForList] = useState<ProfileInfo[]>([]);
    const [selectedLookingFor, setSelectedLookingFor] = useState<ProfileInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchLookingFor();
    }, []);

    const fetchLookingFor = async () => {
        setLoading(true);
        try {
            const data = await ProfileInfoService.getLookingFor();
            setLookingForList(data);
        } catch (error) {
            message.error("Failed to load looking for");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure? This action cannot be undone.")) {
            try {
                await ProfileInfoService.deleteLookingFor(id.toString());
                message.success("Looking for deleted successfully");
                fetchLookingFor();
            } catch (error) {
                message.error("Failed to delete looking for");
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
            render: (_: any, lookingFor: ProfileInfo) => (
                <>
                    <Button
                        type="link"
                        onClick={() => {
                            setSelectedLookingFor(lookingFor);
                            setModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(lookingFor.id)}>
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
                <Title level={2}>Looking For</Title>
                <Button
                    type="primary"
                    onClick={() => {
                        setSelectedLookingFor({ id: 0, name: "" });
                        setModalVisible(true);
                    }}
                    style={{ marginBottom: "20px" }}
                >
                    Create New Looking For
                </Button>
                <Table dataSource={lookingForList} columns={columns} rowKey="id" loading={loading} />

                {modalVisible && (
                    <LookingForForm
                        lookingFor={selectedLookingFor}
                        onSave={() => {
                            setModalVisible(false);
                            fetchLookingFor();
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default LookingForList;