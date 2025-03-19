import React, { useState, useEffect } from "react";
import "./Card.css";

import Group from "./img/Group.svg";
import Dislike from "./img/icon_dislike.svg";
import Star from "./img/icon_star-super-like.svg";
import Message from "./img/icon_message.svg";
import {Profile} from "../../../../services/profile.service";

interface CardProps {
    profile: Profile;
    onDislike: () => void;
    onLike: () => void;
    onInfoClick: (profileId: number) => void;
}

export const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

const Card: React.FC<CardProps> = ({ profile, onDislike, onLike, onInfoClick }) => {
    const [photoIndex, setPhotoIndex] = useState(0);

    const handleNextPhoto = () => {
        if (profile.photos.length > 1) {
            setPhotoIndex((prevIndex) => (prevIndex + 1) % profile.photos.length);
        }
    };

    useEffect(() => {
        setPhotoIndex(0);
        console.log("is Online",profile)
    }, [profile]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                event.preventDefault();
                handleNextPhoto();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [profile.photos.length]);

    return (
        <div className="card">
            {profile.photos.length > 1 && (
                <div className="photo-indicators">
                    {profile.photos.map((_, index) => (
                        <div
                            key={index}
                            className={`photo-indicator ${index === photoIndex ? "active" : ""}`}
                            style={{ width: `${100 / profile.photos.length}%` }}
                        />
                    ))}
                </div>
            )}


            <div className="card-background">
                <img
                    className="card-image"
                    src={`http://localhost:7034${profile.photos[photoIndex]}`}
                    alt={profile.name}
                />
                <div className="card-overlay" />
            </div>

            <div className="card-buttons">
                <button className="dislike" onClick={onDislike}>
                    <img src={Dislike} alt="Dislike" />
                </button>

                <button className="star-like" onClick={onLike}>
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

            <button className="card-info-icon" onClick={() => onInfoClick(profile.id)}>
                <img src={Group} alt="More Info" />
            </button>

            <div className="card-name-status">
                <div className={profile.isOnline ? "card-status-online" : "card-status-offline"}>
                    {profile.isOnline ? "♡ Online" : "♡ Offline"}
                </div>
                <div className="card-name-age">
                    <div className="card-name">{profile.name}</div>
                    <div className="card-age">{calculateAge(profile.birthDay)}</div>
                </div>
            </div>
        </div>
    );
};

export default Card;
