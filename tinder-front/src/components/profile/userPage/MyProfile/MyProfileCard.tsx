import React, { useState, useEffect } from "react";
import "../Card/Card.css";
import "./MyProfileCard.css"
import {Profile, ProfileService} from "../../../../services/profile.service";
import {calculateAge} from "../Card/Card";
import {JwtService} from "../../../../services/jwt.service";
import ArrowLeft from "../Chat/img/Arrow-left.svg";
import ArrowRight from "../Chat/img/Arrow-right.svg";

interface EditProps {
    onEditProfile: () => void;
    onClose: () => void;
}

const MyProfileCard: React.FC<EditProps> = ({ onEditProfile, onClose }) => {
    const [photoIndex, setPhotoIndex] = useState(0);
    const [profile, setProfile] = useState<Profile | null>(null);
    const cardRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = token ? JwtService.getUserIdFromToken(token) : null;

                if (userId) {
                    const userProfile = await ProfileService.getProfileById(userId);
                    setProfile(userProfile || null);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        setPhotoIndex(0);
    }, [profile]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleNextPhoto = () => {
        if (profile!.photos.length > 1) {
            setPhotoIndex((prevIndex) => (prevIndex + 1) % profile!.photos.length);
        }
    };

    const handlePrevPhoto = () => {
        setPhotoIndex((prevIndex) =>
            prevIndex === 0 ? profile!.photos.length - 1 : prevIndex - 1
        );
    };

    if (!profile) {
        return <p>Loading profile...</p>;
    }

    const hasMultiplePhotos = profile.photos?.length > 1;

    return (
        <div className="card" ref={cardRef}>
            {hasMultiplePhotos && (
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
                    src={`http://localhost:7034${profile.photos?.[photoIndex] || ""}`}
                    alt={profile.name}
                />
                <div className="card-overlay" />

                {hasMultiplePhotos && (
                    <>
                        <div className="my-profile-allow-left-btn" onClick={handlePrevPhoto}>
                            <img src={ArrowLeft} alt="Previous" />
                        </div>
                        <div className="my-profile-allow-right-btn" onClick={handleNextPhoto}>
                            <img src={ArrowRight} alt="Next" />
                        </div>
                    </>
                )}
            </div>

            {profile.interests?.length > 0 && (
                <div className="card-interests">
                    {profile.interests.map((interest, index) => (
                        <div key={`${interest.id}-${index}`} className="card-interest">
                            {interest.name}
                        </div>
                    ))}
                </div>
            )}

            <div className="card-name-status">
                <div className="card-status-online">
                    ♡ Online
                </div>
                <div className="card-name-age">
                    <div className="card-name">{profile.name}</div>
                    <div className="card-age">{calculateAge(profile.birthDay)}</div>
                </div>
            </div>

            <button className="Bnt-profile-edit">
                <div className="Bnt-profile-edit-text" onClick={onEditProfile}>Edit info</div>
            </button>
        </div>
    );
};

export default MyProfileCard;