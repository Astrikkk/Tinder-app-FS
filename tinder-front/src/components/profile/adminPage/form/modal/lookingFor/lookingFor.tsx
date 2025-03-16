import React, { useState } from "react";
import Smile1 from "../../img/Smile1.svg";
import Smile2 from "../../img/Smile2.svg";
import Smile3 from "../../img/Smile3.svg";
import Smile4 from "../../img/Smile4.svg";
import Smile5 from "../../img/Smile5.svg";
import Smile6 from "../../img/Smile6.svg";
import "./lookingFor.css";

interface RelationshipOption {
    id: number;
    name: string;
    imgSrc: string;
    text: string;
}

interface LookingForProps {
    onClose: (selectedId: number | null) => void;
}

const relationshipOptions: RelationshipOption[] = [
    { id: 1, name: "long-term", imgSrc: Smile1, text: "Long-Term Relationship" },
    { id: 2, name: "short-term", imgSrc: Smile2, text: "Short-term romance" },
    { id: 3, name: "serious", imgSrc: Smile3, text: "Serious relationship" },
    { id: 4, name: "friends", imgSrc: Smile4, text: "New friends" },
    { id: 5, name: "non-serious", imgSrc: Smile5, text: "Non-serious relationship" },
    { id: 6, name: "unsure", imgSrc: Smile6, text: "I'm not sure yet" },
];

const LookingFor: React.FC<LookingForProps> = ({ onClose }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const handleSelect = (id: number) => {
        setSelectedOption(id);
    };

    const handleSave = () => {
        onClose(selectedOption);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2 className="modal-text">What are you looking for?</h2>
                <div className="relationship-goals">
                    {relationshipOptions.map((option) => (
                        <div
                            key={option.id}
                            className={`relationship-goal ${selectedOption === option.id ? "selected" : ""}`}
                            onClick={() => handleSelect(option.id)}
                        >
                            <button className="Relationship-Goal-Text">
                                <img src={option.imgSrc} alt={option.text} className="icon" />
                                <p className="goal-text">{option.text}</p>
                            </button>
                        </div>
                    ))}
                </div>
                <button className="save-btn" onClick={handleSave}>Save Changes</button>
            </div>
        </div>
    );
};

export default LookingFor;
