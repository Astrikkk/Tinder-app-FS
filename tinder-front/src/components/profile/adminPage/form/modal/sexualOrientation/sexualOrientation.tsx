import React, {useEffect, useState} from "react";
import "./sexualOrientation.css";
import {ProfileInfoService} from "../../../../../../services/profile.info.service";

export interface Orientation {
    id: number;
    name: string;
}

interface SexualOrientationProps {
    onClose: (selectedId: number | Orientation | null) => void;
    initialSelected: number | Orientation | null;
    isJobTitle: boolean;
}

const SexualOrientation: React.FC<SexualOrientationProps> = ({ onClose, initialSelected, isJobTitle }) => {
    const [sexualOrientations, setSexualOrientations] = useState<Orientation[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | Orientation | null>(initialSelected);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrientations = async () => {
            try {
                if(!isJobTitle) {
                    const data = await ProfileInfoService.getSexualOrientation();
                    setSexualOrientations(data);
                } else {
                    const data = await ProfileInfoService.getJobPositions();
                    setSexualOrientations(data);
                }
            } catch (error) {
                console.error("Error fetching orientations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrientations();
    }, [isJobTitle]);

    useEffect(() => {
        setSelectedOption(initialSelected);
    }, [initialSelected]);

    const handleSelect = (option: Orientation) => {
        setSelectedOption(isJobTitle ? option : option.id);
    };

    const handleSave = () => {
        onClose(selectedOption);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="modal">
            <div className="modal-content">

                <div className="sexual-orientation-list">
                    <h2 className="modal-text">
                        {isJobTitle ? "What is your job title?" : "What is your sexual orientation?"}
                    </h2>
                    {sexualOrientations.map((option) => (
                        <button
                            key={option.id}
                            className={`sexual-orientation ${
                                (isJobTitle
                                    ? (selectedOption as Orientation)?.id === option.id
                                    : selectedOption === option.id)
                                    ? "selected" : ""
                            }`}
                            onClick={() => handleSelect(option)}
                        >
                            <p className="orientation-text">{option.name}</p>
                        </button>
                    ))}
                </div>
                <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={selectedOption === null}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default SexualOrientation;