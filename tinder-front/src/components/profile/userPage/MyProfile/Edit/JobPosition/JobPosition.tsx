import React, { useEffect, useState } from "react";
import "./JobPosition.css";
import { ProfileInfoService } from "../../../../../../services/profile.info.service";

export interface JobTitle {
    id: number;
    name: string;
}

interface JobPositionProps {
    onClose: (selectedId: number | JobTitle | null) => void;
    initialSelected: number | JobTitle | null;
}

const JobPosition: React.FC<JobPositionProps> = ({ onClose, initialSelected }) => {
    const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | JobTitle | null>(initialSelected);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchJobTitles = async () => {
            try {
                const data = await ProfileInfoService.getJobPositions();
                setJobTitles(data);
            } catch (error) {
                console.error("Error fetching job titles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobTitles();
    }, []);

    useEffect(() => {
        setSelectedOption(initialSelected);
    }, [initialSelected]);

    const handleSelect = (option: JobTitle) => {
        setSelectedOption(option);
    };

    const handleSave = () => {
        onClose(selectedOption);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="form-2-container absolute w-[400px] left-[367px] top-[1099px] flex flex-col gap-6">

        <div className="job-position-modal">
            <div className="job-position-modal-content">
                <div className="job-position-list">
                    <h2 className="modal-text">
                        What is your job title?
                    </h2>
                    {jobTitles.map((option) => (
                        <button
                            key={option.id}
                            className={`job-position ${
                                (typeof selectedOption === 'object'
                                    ? selectedOption?.id === option.id
                                    : selectedOption === option.id)
                                    ? "selected" : ""
                            }`}
                            onClick={() => handleSelect(option)}
                        >
                            <p className="position-text">{option.name}</p>
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

        </div>
    );
};

export default JobPosition;