import React, {useEffect, useState} from "react";
import Kitty from "../../img/Kitty.svg";
import "./Matches.css";
import {Profile, ProfileService} from "../../../../../services/profile.service";
import {JwtService} from "../../../../../services/jwt.service";
import RedHeart from "./img/RedHeart.svg"
import MatchBorder from "./img/MatchBorder.svg"
import {ProfileItemDTO} from "../../../types";


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

    const fetchLikes  = async ()=>{
        const token = localStorage.getItem("token");
        const userId = JwtService.getUserIdFromToken(token);
        if(userId)
        {
            const data = await ProfileService.getUserLikes(userId);
            setLikedBy(data);
        }
    }
    const fetchSuperLikes  = async ()=>{
        const token = localStorage.getItem("token");
        const userId = JwtService.getUserIdFromToken(token);
        if(userId)
        {
            const data = await ProfileService.getUserSuperLikes(userId);
            setSuperLikedBy(data || []);

        }
    }

    const handleViewMatches = () => {
        setProfiles(likedBy); // Змінюємо список анкет на тих, хто лайкнув
        setCurrentProfileIndex(0); // Починаємо перегляд з першого профілю
        setViewingMatches(true); // Включаємо режим перегляду матчів
    };

    return (
        <>
            {likedBy.length > 0 ? (
                <div className="Match-Cards-Mini">
                    <div className="Match-Card-Mini-1" onClick={handleViewMatches}>
                        <div className="Match-Border">
                            <img src={MatchBorder} alt="Border" />
                            <img className="Match-Avatar" src={`http://localhost:7034${likedBy[0].photos[0]}`} alt="Liked User" />
                            <img className="red-heart" src={RedHeart} alt="Red Heart" />
                            <div className="Match-Text">{likedBy.length} Likes</div>
                        </div>
                    </div>
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