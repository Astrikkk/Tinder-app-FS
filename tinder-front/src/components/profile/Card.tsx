import React from "react";
import { Image, Typography } from "antd";
import "./css/ProfileCard.css"; // Import your CSS file

const { Text } = Typography;

interface ProfileItemDTO {
    id: number;
    name: string;
    imagePath: string;
    gender: string;
    lookingFor: string;
    interestedIn: string;
    sexualOrientation: string;
    birthDay: Date;
    interests: string[];
    photos: string[];
    likedByUserIds: number[];
    matchedUserIds: number[];
}

const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

const ProfileCard: React.FC<{ profile: ProfileItemDTO }> = ({ profile }) => {
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <div
                style={{
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                }}
            >
                <div style={{ position: "relative", height: "100%" }}>
                    <Image
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "69%",
                            top: 0,
                            left: 0,
                            objectFit: "cover",
                        }}
                        alt="Photo"
                        src={profile.imagePath || "https://via.placeholder.com/414x554"}
                    />
                    <div
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "46.5%",
                            top: "53.5%",
                            left: 0,
                            borderRadius: "10px",
                            background:
                                "linear-gradient(180deg, rgba(36,0,0,0) 0%, rgb(33.15,0,0) 25.39%)",
                        }}
                    />
                    <div style={{ position: "absolute", bottom: 20, left: 20, color: "white" }}>
                        <Text strong style={{ fontSize: 24 }}>{profile.name}, {calculateAge(profile.birthDay)}</Text>
                        <div>
                            <Text>Liked by: {profile.likedByUserIds.length} users</Text>
                        </div>
                        <div>
                            <Text>Matched with: {profile.matchedUserIds.length} users</Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;