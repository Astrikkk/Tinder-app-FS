import React, {useEffect, useState} from "react";
import "./sexualOrientation.css";
import {ProfileInfoService} from "../../../../../../services/profile.info.service";

interface Orientation {
    id: number;
    name: string;
}

interface SexualOrientationProps {
    onClose: (selectedId: number | null) => void;
}


const SexualOrientation: React.FC<SexualOrientationProps> = ({ onClose }) => {
    const [sexualOrientations, setSexualOrientations] = useState<Orientation[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const data = await ProfileInfoService.getSexualOrientation()
                setSexualOrientations(data);
            } catch (error) {
                console.error("Error fetching interests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInterests();
    }, []);

    const handleSelect = (id: number) => {
        setSelectedOption(id);
    };

    const handleSave = () => {
        onClose(selectedOption);
    };

    if (loading) {
        return <p>Loading sexual orientations...</p>;
    }
    return (
        <div className="modal">
            <div className="modal-content">
                <h2 className="modal-text">What is your sexual orientation?</h2>
                <div className="sexual-orientation-list">
                    {sexualOrientations.map((option) => (
                        <button
                            key={option.id}
                            className={`sexual-orientation ${selectedOption === option.id ? "selected" : ""}`}
                            onClick={() => handleSelect(option.id)}
                        >
                            <p className="orientation-text">{option.name}</p>

                        </button>
                    ))}
                </div>
                <button className="save-btn" onClick={handleSave} disabled={selectedOption === null}>
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default SexualOrientation;
