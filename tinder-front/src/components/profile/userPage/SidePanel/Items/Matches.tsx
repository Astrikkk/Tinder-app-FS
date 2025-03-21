import React, { useEffect, useState } from "react";
import Kitty from "../../img/Kitty.svg";
import "./Matches.css";
import { Profile, ProfileService } from "../../../../../services/profile.service";
import { JwtService } from "../../../../../services/jwt.service";
import RedHeart from "./img/RedHeart.svg";
import MatchBorder from "./img/MatchBorder.svg";
import YellowBorder from "./img/YellowBorder.svg";
import YellowHeart from "./img/YellowHeart.svg";

interface MatchesProps {
    setProfiles: (profiles: Profile[]) => void;
    setCurrentProfileIndex: (index: number) => void;
    setViewingMatches: (viewing: boolean) => void;
}

const Matches: React.FC<MatchesProps> = ({ setProfiles, setCurrentProfileIndex, setViewingMatches }) => {
    const [likedBy, setLikedBy] = useState<Profile[]>([]);
    const [superLikedBy, setSuperLikedBy] = useState<Profile[]>([]);

    useEffect(() => {
        fetchLikes();
        fetchSuperLikes();
    }, []);

    const fetchLikes = async () => {
        const token = localStorage.getItem("token");
        const userId = JwtService.getUserIdFromToken(token);
        if (userId) {
            const data = await ProfileService.getUserLikes(userId);
            setLikedBy(data);
        }
    };

    const fetchSuperLikes = async () => {
        const token = localStorage.getItem("token");
        const userId = JwtService.getUserIdFromToken(token);
        if (userId) {
            const data = await ProfileService.getUserSuperLikes(userId);
            setSuperLikedBy(data);
        }
    };

    const handleViewMatches = (profiles: Profile[]) => {
        setProfiles(profiles); // Передаємо список анкет
        setCurrentProfileIndex(0); // Починаємо перегляд з першого профілю
        setViewingMatches(true); // Включаємо режим перегляду матчів
    };

    return (
        <>
            {likedBy.length > 0 || superLikedBy.length > 0 ? (
                <div className="Match-Cards-Mini">
                    {likedBy.length > 0 && (
                        <div className="Match-Card-Mini-1" onClick={() => handleViewMatches(likedBy)}>
                            <div className="Match-Border">
                                <img src={MatchBorder} alt="Border" />
                                <img className="Match-Avatar" src={`http://localhost:7034${likedBy[0]?.photos[0]}`} alt="Liked User" />
                                <img className="red-heart" src={RedHeart} alt="Red Heart" />
                                <div className="Match-Text">{likedBy.length} Likes</div>
                            </div>
                        </div>
                    )}

                    {superLikedBy.length > 0 && (
                        <div className="Match-Card-Mini-2" onClick={() => handleViewMatches(superLikedBy)}>
                            <div className="Match-Border">
                                <img src={YellowBorder} alt="Border" />
                                <img className="Match-Avatar" src={`http://localhost:7034${superLikedBy[0]?.photos[0]}`} alt="Liked User" />
                                <img className="red-heart" src={YellowHeart} alt="Yellow Heart" />
                                <div className="Match-Text">{superLikedBy.length} Super Likes</div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="Chat-Match no-chats">
                    <h2 className="match-info-h2">It's a Match!</h2>
                    <p className="match-info-p">
                        See who likes you back! When you and another user mutually like each other, you'll become a match and appear in this section.
                    </p>
                    <img src={Kitty} alt="Kitty" className="kitty-image" />
                </div>
            )}
        </>
    );
};

export default Matches;
