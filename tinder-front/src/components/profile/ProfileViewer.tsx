import React, { useEffect, useState } from "react";
import { Button, Spin, Modal, message } from "antd";
import ProfileCard from "./Card";
import { ProfileService, Profile } from "../../services/profile.service";

const ProfileViewer: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const data = await ProfileService.getProfiles();
            setProfiles(data);
        } catch (error) {
            message.error("Failed to load profiles");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % profiles.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? profiles.length - 1 : prevIndex - 1
        );
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Open Profile Viewer
            </Button>

            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
                width={400}
            >
                {loading ? (
                    <Spin size="large" />
                ) : profiles.length > 0 ? (
                    <>
                        {/*<ProfileCard*/}
                        {/*    profile={{*/}
                        {/*        ...profiles[currentIndex],*/}
                        {/*        id: Number(profiles[currentIndex].id) || 0,*/}
                        {/*        birthDay: new Date(profiles[currentIndex].birthDay),*/}
                        {/*        imagePath: profiles[currentIndex].imagePath || "",*/}
                        {/*        interests: profiles[currentIndex].interests || [],*/}
                        {/*        photos: profiles[currentIndex].photos ?? [], // 🛠 Забезпечуємо масив*/}
                        {/*    }}*/}
                        {/*/>*/}

                        <div style={{ marginTop: "10px" }}>
                            <Button onClick={handlePrev} disabled={profiles.length <= 1}>
                                ⬅ Previous
                            </Button>
                            <Button onClick={handleNext} disabled={profiles.length <= 1} style={{ marginLeft: "10px" }}>
                                Next ➡
                            </Button>
                        </div>
                    </>
                ) : (
                    <p>No profiles available</p>
                )}
            </Modal>
        </div>
    );
};

export default ProfileViewer;
