import React from "react";
import "./Card.css";

import Group from "./img/Group.svg"
import Dislike from "./img/icon_dislike.svg"
import Star from "./img/icon_star-super-like.svg"
import Message from "./img/icon_message.svg"
import {ProfileItemDTO} from "../../types";

interface CardProps {
    profile: ProfileItemDTO;
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


const Card: React.FC<CardProps> = ({ profile }) => {
    return (
        <div className="card">
            <div className="card-background">
                <img className="card-image" src={`http://localhost:7034${profile?.imagePath}`} alt={profile.name} />
                <div className="card-overlay" />
            </div>
            <div className="card-buttons">
                <button className="dislike">
                    <img src={Dislike} alt="Dislike" />
                </button>
                <button className="star-like">
                    <img src={Star} alt="Super Like" />
                </button>
                <button className="message">
                    <img src={Message} alt="Message" />
                </button>
            </div>
            <div className="card-interests">
                {profile.interests.map((interest) => (
                    <div key={interest.id} className="card-interest">
                        {interest.name}
                    </div>
                ))}
            </div>
            <button className="card-info-icon">
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

