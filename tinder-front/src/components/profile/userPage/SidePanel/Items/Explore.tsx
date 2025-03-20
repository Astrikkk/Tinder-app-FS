import React, { useState } from "react";
import "./Explore.css";
import LookingForLove from "./img/LookingForLove.png";
import LetsBeFriends from "./img/Let’sBeFriends.png";
import FreeTonight from "./img/FreeTonight.png";
import CoffeeDate from "./img/CoffeeDate.png";
import { ProfileService } from "../../../../../services/profile.service";


interface ExploreProps {
    setProfiles: (profiles: any[]) => void;
    setCurrentProfileIndex: (index: number) => void;
    setViewingCategoryProfiles: (value: boolean) => void;
}

const Explore: React.FC<ExploreProps> = ({ setProfiles, setCurrentProfileIndex, setViewingCategoryProfiles }) => {
    const handleGetProfiles = async (categoryId: string) => {
        try {
            const response = await ProfileService.getProfilesByLookingFor(categoryId);
            setProfiles(response || []);
            setCurrentProfileIndex(0);
            setViewingCategoryProfiles(true); // Переходимо в режим перегляду категорійних профілів
        } catch (error) {
            console.error("Error fetching profiles:", error);
        }
    };

    return (
        <div className="Explore-Container">
            <div className="Explore-Title">
                <div className="For-you-text">For you</div>
                <div className="Description-text">
                    Here you can choose a group that includes people with similar interests or goals.
                </div>
                <div className="Looking-For-Block">
                    <img src={LookingForLove} alt="Looking for Love" onClick={() => handleGetProfiles('1')} />
                    <img src={FreeTonight} alt="Free Tonight" onClick={() => handleGetProfiles('2')} />
                    <img src={LetsBeFriends} alt="Let's Be Friends" onClick={() => handleGetProfiles('3')} />
                    <img src={CoffeeDate} alt="Coffee Date" onClick={() => handleGetProfiles('4')} />
                </div>
            </div>
        </div>
    );
};

export default Explore;
