import React from "react";
import "./Card.css";

import Group from "./img/Group.svg";
import Dislike from "./img/icon_dislike.svg";
import Star from "./img/icon_star-super-like.svg";
import Message from "./img/icon_message.svg";
import { ProfileItemDTO } from "../../types";

interface CardProps {
    profile: ProfileItemDTO;
    onDislike: () => void;
    onLike: () => void;
    onInfoClick: (profileId: number) => void; // New prop for Info button
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

const Card: React.FC<CardProps> = ({ profile,  onDislike, onLike, onInfoClick }) => {
    return (
        <div className="card">
            <div className="card-background">
                <img className="card-image" src={`http://localhost:7034${profile?.imagePath}`} alt={profile.name} />
                <div className="card-overlay" />
            </div>
            <div className="card-buttons">
                <button className="dislike" onClick={() => { console.log("Dislike clicked"); onDislike(); }}>
                    <img src={Dislike} alt="Dislike" />
                </button>

                <button className="star-like" onClick={() => { console.log("Like clicked"); onLike(); }}>
                    <img src={Star} alt="Super Like" />
                </button>

                <button className="message-button">
                    <img src={Message} alt="Message" />
                </button>
            </div>
            <div className="card-interests">
                {profile.interests.map((interest, index) => (
                    <div key={`${interest.id}-${index}`} className="card-interest">
                        {interest.name}
                    </div>
                ))}
            </div>
            <button className="card-info-icon" onClick={() => {
                console.log("Profile ID:", profile.id); // Debugging log
                onInfoClick(profile.id);
            }}>
                <img src={Group} alt="More Info" />
            </button>
            <div className="card-name-status">
                <div className="card-status">♡ Online</div>
                <div className="card-name-age">
                    <div className="card-name">{profile.name}</div>
                    <div className="card-age">{calculateAge(profile.birthDay)}</div>
                </div>
            </div>
        </div>
    );
};

export default Card;