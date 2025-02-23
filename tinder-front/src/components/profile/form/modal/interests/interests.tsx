import React, { useState, useEffect } from "react";
import "./interests.css";
import { ProfileInfoService } from "../../../../../services/profile.info.service";

interface Interest {
    id: number;
    name: string;
}

interface InterestsProps {
    onClose: (selectedIds: number[]) => void;
}

const Interests: React.FC<InterestsProps> = ({ onClose }) => {
    const [interests, setInterests] = useState<Interest[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const data = await ProfileInfoService.getInterests();
                setInterests(data);
            } catch (error) {
                console.error("Error fetching interests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInterests();
    }, []);

    const handleSelect = (id: number) => {
        setSelectedOptions((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(optionId => optionId !== id);
            } else if (prevSelected.length < 5) {
                return [...prevSelected, id];
            }
            return prevSelected;
        });
    };

    const handleSave = () => {
        onClose(selectedOptions);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            const foundInterest = interests.find(interest =>
                interest.name.toLowerCase() === searchTerm.toLowerCase()
            );
            if (foundInterest && !selectedOptions.includes(foundInterest.id) && selectedOptions.length < 5) {
                handleSelect(foundInterest.id);
                setSearchTerm(""); // Очистити поле після додавання
            }
        }
    };

    if (loading) {
        return <p>Loading interests...</p>;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="title-search">
                    <h2 className="modal-text">What are you interested in?</h2>
                    <input
                        type="text"
                        placeholder="⌕"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        className="search-input"
                    />
                </div>

                <div className="interest-list">
                    {interests.map((option) => (
                        <div
                            key={option.id}
                            className={`interest-add ${selectedOptions.includes(option.id) ? "selected" : ""}`}
                            onClick={() => handleSelect(option.id)}
                        >
                            <button className="interest-add-text">
                                <p className="add-text">{option.name}</p>
                            </button>
                        </div>
                    ))}
                </div>
                <button className="save-btn" onClick={handleSave} disabled={selectedOptions.length === 0}>
                    Save Changes ({selectedOptions.length}/5)
                </button>
            </div>
        </div>
    );
};

export default Interests;
