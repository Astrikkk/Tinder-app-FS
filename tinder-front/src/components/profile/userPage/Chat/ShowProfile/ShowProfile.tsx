import React, {useEffect, useState} from 'react';
import { ProfileItemDTO } from "../../../types";
import ArrowLeft from "../img/Arrow-left.svg"
import ArrowRight from "../img/Arrow-right.svg"
import "./ShowProfile.css";
import {calculateAge} from "../../Card/Card"; // Підключаємо стилі

interface ShowProfileProps {
    profile: ProfileItemDTO;
    onClose: () => void;
}

const ShowProfile: React.FC<ShowProfileProps> = ({ profile, onClose }) => {
    const [photoIndex, setPhotoIndex] = useState(0);



    useEffect(() => {
        setPhotoIndex(0);
    }, [profile]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") {
                handleNextPhoto();
            } else if (event.key === "ArrowLeft") {
                handlePrevPhoto();
            } else if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [photoIndex, profile.photos.length]);

    const handleNextPhoto = () => {
        if (profile.photos.length > 1) {
            setPhotoIndex((prevIndex) => (prevIndex + 1) % profile.photos.length);
        }
    };
    const handlePrevPhoto = () => {
        setPhotoIndex((prevIndex) =>
            prevIndex === 0 ? profile.photos.length - 1 : prevIndex - 1
        );
    };

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };


    const getEmoji = (id: number): string => {
        const icons: Record<number, string> = {
            1: "⏳",
            2: "🥰",
            3: "🥂",
            4: "🕯",
            5: "🤙",
            6: "🤔"
        };
        return icons[id] || "❓";
    };
    return (
        <div className="show-prof-overlay" onClick={handleOverlayClick}>
            <div className="show-prof-modal">



                <div className="Card-bg">

                    <img
                        className="card-photo"
                        src={`http://localhost:7034${profile.photos[photoIndex]}`}
                        alt={profile.name}
                    />
                    {profile.photos.length > 1 && (
                        <div className="photo-indicators">
                            {profile.photos.map((_, index) => (
                                <div
                                    key={index}
                                    className={`photo-indicator ${index === photoIndex ? "active" : ""}`}
                                    style={{ width: `${100 / profile.photos.length}%` }}
                                />
                            ))}

                            <div className="allow-left-btn" onClick={handlePrevPhoto}>
                                <img src={ArrowLeft} alt="Previous" />
                            </div>
                            <div className="allow-right-btn" onClick={handleNextPhoto}>
                                <img src={ArrowRight} alt="Next" />
                            </div>

                        </div>



                    )}

                    <div className="BG-color">
                        <div className="BG-color-Gradient"></div>
                        <div className="Full-Info">
                            <div className="Name-status">
                                <div className="online-status">♡ Online</div>
                                <div className="Name-age">
                                    <div className="Card-name">{profile.name}</div>
                                    <div className="Card-age">{calculateAge(profile.birthDay)}</div>
                                </div>
                            </div>
                            <div className="Card-hr" />
                            <div className="More-info">
                                <div className="More-info-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="23" viewBox="0 0 20 23" fill="none">
                                        <path d="M10 9.29199C12.2091 9.29199 14 7.50113 14 5.29199C14 3.08285 12.2091 1.29199 10 1.29199C7.79086 1.29199 6 3.08285 6 5.29199C6 7.50113 7.79086 9.29199 10 9.29199Z" stroke="#B1A4A4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M19 21.292C19 16.3215 14.9705 12.292 10 12.292C5.0295 12.292 1 16.3215 1 21.292" stroke="#B1A4A4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <div className="prof-gender">{profile.gender?.name}</div>
                                </div>
                                <div className="More-info-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24" fill="none">
                                        <path d="M9 22.292C9 22.292 17 15.992 17 9.16699C17 4.81789 13.4181 1.29199 9 1.29199C4.58187 1.29199 1 4.81789 1 9.16699C1 15.992 9 22.292 9 22.292Z" stroke="#B1A4A4" stroke-width="2" stroke-linejoin="round"/>
                                        <path d="M9.00078 12.3171C9.42101 12.3171 9.83713 12.2356 10.2254 12.0773C10.6136 11.919 10.9664 11.687 11.2635 11.3945C11.5607 11.102 11.7964 10.7547 11.9572 10.3725C12.118 9.99037 12.2008 9.58075 12.2008 9.16709C12.2008 8.75343 12.118 8.34381 11.9572 7.96164C11.7964 7.57946 11.5607 7.23221 11.2635 6.9397C10.9664 6.6472 10.6136 6.41517 10.2254 6.25687C9.83713 6.09857 9.42101 6.01709 9.00078 6.01709C8.15209 6.01709 7.33816 6.34896 6.73804 6.9397C6.13792 7.53044 5.80078 8.33166 5.80078 9.16709C5.80078 10.0025 6.13792 10.8037 6.73804 11.3945C7.33816 11.9852 8.15209 12.3171 9.00078 12.3171Z" stroke="#B1A4A4" stroke-width="2" stroke-linejoin="round"/>
                                    </svg>
                                    <div className="prof-gender">{profile.location?.name || "Unknown"}</div>
                                </div>
                                <div className="Card-hr" />

                            </div>
                            <div className="Interests-box">
                                <div className="Interests-title">Interests</div>
                                <div className="show-prof-interests">
                                    {profile.interests.map((interest, index) => (
                                        <div key={`${interest.id}-${index}`} className="show-prof-interest">
                                            {interest.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="Relationship-Goal">
                                <div className="Interests-title">I’m looking for</div>
                                <div className="Relationship-Goal-details">
                                    <div className="Relationship-Goal-details-text">
                                        {getEmoji(profile.lookingFor.id)} {profile.lookingFor.name}
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>



            </div>
        </div>
    );
};

export default ShowProfile;
