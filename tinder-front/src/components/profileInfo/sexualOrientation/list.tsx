import React, { useEffect, useState } from "react";
import { ProfileInfo } from "../types";
import { Button, message, Modal, Table, Typography } from "antd";
import { ProfileInfoService } from "../../../services/profile.info.service";
import SexualOrientationForm from "./form";
import Navbar from "../../profile/adminPage/Navbar";

const { Title } = Typography;

const SexualOrientationList: React.FC = () => {
    const [sexualOrientations, setSexualOrientations] = useState<ProfileInfo[]>([]);
    const [selectedSexualOrientation, setSelectedSexualOrientation] = useState<ProfileInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchSexualOrientations();
    }, []);

    const fetchSexualOrientations = async () => {
        setLoading(true);
        try {
            const data = await ProfileInfoService.getSexualOrientation();
            setSexualOrientations(data);
        } catch (error) {
            message.error("Failed to load sexual orientations");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure? This action cannot be undone.")) {
            try {
                await ProfileInfoService.deleteSexualOrientation(id.toString());
                message.success("Sexual orientation deleted successfully");
                fetchSexualOrientations();
            } catch (error) {
                message.error("Failed to delete sexual orientation");
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
            render: (_: any, sexualOrientation: ProfileInfo) => (
                <>
                    <Button
                        type="link"
                        onClick={() => {
                            setSelectedSexualOrientation(sexualOrientation);
                            setModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(sexualOrientation.id)}>
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
                <Title level={2}>Sexual Orientation</Title>
                <Button
                    type="primary"
                    onClick={() => {
                        setSelectedSexualOrientation({ id: 0, name: "" });
                        setModalVisible(true);
                    }}
                    style={{ marginBottom: "20px" }}
                >
                    Create New Sexual Orientation
                </Button>
                <Table dataSource={sexualOrientations} columns={columns} rowKey="id" loading={loading} />

                {modalVisible && (
                    <SexualOrientationForm
                        sexualOrientation={selectedSexualOrientation}
                        onSave={() => {
                            setModalVisible(false);
                            fetchSexualOrientations();
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default SexualOrientationList;