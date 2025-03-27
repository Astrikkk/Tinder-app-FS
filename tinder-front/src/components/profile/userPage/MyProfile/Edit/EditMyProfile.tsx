import React, { useState, useEffect } from "react";
import "./EditMyProfile.css"
import {Profile, ProfileService} from "../../../../../services/profile.service";
import {JwtService} from "../../../../../services/jwt.service";
import IconAdd from "../../../adminPage/form/img/IconAdd.svg";
import Interests from "../../../adminPage/form/modal/interests/interests";
import {ProfileInfoService} from "../../../../../services/profile.info.service";
import SexualOrientation, {Orientation} from "../../../adminPage/form/modal/sexualOrientation/sexualOrientation";
import { AxiosError } from 'axios';
import {logout} from "../../../../../services/auth.service";
import ArrowLeft from "../../Chat/img/Arrow-left.svg";
import ArrowRight from "../../Chat/img/Arrow-right.svg";

interface EditProps {
    onClose: () => void;
}

interface ErrorResponse {
    message?: string;
}

interface ProfileInterest {
    id: number;
    name: string;
}

const EditMyProfile: React.FC<EditProps> = ({ onClose }) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [images, setImages] = useState<(File | string | null)[]>([null, null, null, null]);
    const [description, setDescription] = useState("");
    const [interests, setInterests] = useState<ProfileInterest[]>([]);
    const [selectedInterestIds, setSelectedInterestIds] = useState<number[]>([]);
    const [showInterestsModal, setShowInterestsModal] = useState(false);
    const [selectedJobTitleId, setSelectedJobTitleId] = useState<number | Orientation | null>(null);
    const [showJobTitleModal, setShowJobTitleModal] = useState(false);

    const [orientations, setOrientations] = useState<Orientation[]>([]);
    const [selectedOrientation, setSelectedOrientation] = useState<Orientation | null>(null);
    const [lookingFor, setLookingFor] = useState<Orientation[]>([]);
    const [selectedLookingFor, setSelectedLookingFor] = useState<Orientation | null>(null);
    const [showOrientationDropdown, setShowOrientationDropdown] = useState(false);
    const [showLookingForDropdown, setShowLookingForDropdown] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = token ? JwtService.getUserIdFromToken(token) : null;

                if (userId) {
                    const userProfile = await ProfileService.getProfileById(userId);
                    setProfile(userProfile || null);

                    if (userProfile?.photos && Array.isArray(userProfile.photos)) {
                        const formattedImages = userProfile.photos.map((img) => img || null);
                        setImages([...formattedImages, ...Array(4 - formattedImages.length).fill(null)]);
                    }

                    if (userProfile?.profileDescription) {
                        setDescription(userProfile.profileDescription);
                    }

                    // Initialize with empty array if no interests exist
                    setInterests(userProfile?.interests || []);
                    setSelectedInterestIds(userProfile?.interests?.map(interest => interest.id) || []);

                    // Load orientations and looking for options
                    const orientationData = await ProfileInfoService.getSexualOrientation();
                    const lookingForData = await ProfileInfoService.getLookingFor();
                    setOrientations(orientationData);
                    setLookingFor(lookingForData);

                    // Set current selections if they exist
                    if (userProfile?.sexualOrientation) {
                        const currentOrientation = orientationData.find(o => o.id === userProfile.sexualOrientation.id);
                        setSelectedOrientation(currentOrientation || userProfile.sexualOrientation);
                    }

                    if (userProfile?.lookingFor) {
                        const currentLookingFor = lookingForData.find(o => o.id === userProfile.lookingFor.id);
                        setSelectedLookingFor(currentLookingFor || userProfile.lookingFor);
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        return () => {
            // Очищаємо об'єктні URL при видаленні компонента
            images.forEach(image => {
                if (image instanceof File) {
                    URL.revokeObjectURL(URL.createObjectURL(image));
                }
            });
        };
    }, [images]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImages((prevImages) => {
                const newImages = [...prevImages];
                newImages[index] = file;
                return newImages;
            });
        }
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const handleImageRemove = (index: number) => {
        setImages((prevImages) => {
            const newImages = [...prevImages];
            newImages[index] = null;
            return newImages;
        });
    };

    const handleInterestsSelect = (selectedIds: number[]) => {
        setSelectedInterestIds(selectedIds);
        setShowInterestsModal(false);

        // Get all available interests from the backend
        ProfileInfoService.getInterests().then(allInterests => {
            // Filter to only keep selected ones
            const newInterests = allInterests.filter(interest =>
                selectedIds.includes(interest.id)
            );
            setInterests(newInterests);
        }).catch(error => {
            console.error("Error fetching interests:", error);
        });
    };

    const handleJobTitleSelect = (selectedId: number | Orientation | null) => {
        setSelectedJobTitleId(selectedId);
        setShowJobTitleModal(false);
        // Тут можна додати логіку для збереження вибраної посади
    };

    const handleOrientationSelect = (orientation: Orientation) => {
        setSelectedOrientation(orientation);
        setShowOrientationDropdown(false);
    };

    const handleLookingForSelect = (orientation: Orientation) => {
        setSelectedLookingFor(orientation);
        setShowLookingForDropdown(false);
    };


    const handleSaveChanges = async () => {
        if (!profile) return;

        try {
            // Validate required fields
            const missingFields = [];
            if (!profile.gender?.id) missingFields.push('Gender');
            if (!profile.interestedIn?.id) missingFields.push('Interested In');
            if (selectedLookingFor === null) missingFields.push('Looking For');
            if (selectedOrientation === null) missingFields.push('Sexual Orientation');

            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            const updateData = {
                jobPositionId: typeof selectedJobTitleId !== 'number' ? selectedJobTitleId!.id : Number(selectedJobTitleId),
                genderId: profile.gender.id,
                interestedInId: profile.interestedIn.id,
                lookingForId: selectedLookingFor!.id,
                sexualOrientationId: selectedOrientation!.id,
                images: images.filter((img): img is File => img instanceof File),
                interestIds: selectedInterestIds,
                profileDescription: description
            };

            await ProfileService.updateProfileWithData(profile.userId, updateData);
            alert("Profile updated successfully!");
            onClose(); // Додаємо закриття після успішного оновлення
        } catch (error) {
            let errorMessage = "Failed to update profile";
            if (error instanceof Error) {
                errorMessage = error.message;
                if ('response' in error) {
                    const axiosError = error as AxiosError<{message?: string}>;
                    errorMessage = axiosError.response?.data?.message || errorMessage;
                }
            }
            alert(errorMessage);
        }
    };

    if (!profile) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="Edit-Profile-Bg">
            <div className="Edit-Profile-Container">
                <div className="Edit-Profile-Element">
                    <h2 className="Edit-Profile-Title">Add/change profile pictures</h2>
                    <div className="Edit-Profile-Upload-Block">
                        // Оновлений код для відображення фото
                        {images.map((image, i) => (
                            <div key={i} className="Edit-Profile-Upload-Item">
                                <div className="">
                                    {image ? (
                                        <>
                                            <img
                                                src={
                                                    typeof image === "string"
                                                        ? `http://localhost:7034${image}`
                                                        : URL.createObjectURL(image)
                                                }
                                                alt={`Uploaded ${i}`}
                                                className="Edit-Profile-Upload-Item-Img"
                                            />
                                            <button
                                                className="Edit-Profile-Upload-Item-Btn-Delete"
                                                onClick={() => handleImageRemove(i)}
                                            >
                                                -
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="Edit-Profile-Upload-Item-Border"></div>
                                            <label htmlFor={`file-upload-${i}`} className="Edit-Profile-Upload-Item-Btn-Add">
                                                <img src={IconAdd} alt="Add" className=""/>
                                            </label>
                                        </>
                                    )}
                                </div>
                                <input
                                    id={`file-upload-${i}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e, i)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="Edit-Profile-Element">
                    <h2 className="Edit-Profile-Title">About me</h2>
                    <div className="Edit-Profile-Description-Block">
                        <textarea
                            className="Edit-Profile-Description-Text"
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Write something about yourself..."
                            maxLength={500}
                        />
                        <div className="Edit-Profile-Description-Grey-Text">{description.length}/500</div>
                    </div>
                </div>
                <div className="Edit-Profile-Element">
                    <h2 className="Edit-Profile-Title">Interests</h2>
                    <div className="Edit-Profile-Interests-Block">
                        <button
                            className="Edit-Profile-Interests-Block-Item Edit-Profile-Interests-Add-Button"
                            onClick={() => setShowInterestsModal(true)}
                        >
                            <div className="Edit-Profile-Interests-Block-Item-Text">+ Add New</div>
                        </button>
                        {interests.map((interest) => (
                            <div key={interest.id} className="Edit-Profile-Interests-Block-Item">
                                <div className="Edit-Profile-Interests-Block-Item-Text">{interest.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="Edit-Profile-Element">
                    <div className="Edit-Profile-Title">Job title</div>
                    <div className="Edit-Profile-Interests-Block">
                        <button
                            className="Edit-Profile-Job-Item"
                            onClick={() => setShowJobTitleModal(true)}
                        >
                            <div className="Edit-Profile-Interests-Block-Item-Text">
                                {selectedJobTitleId ? "Change Job Title" : "+ Add Job Title"}
                            </div>
                        </button>
                    </div>
                </div>
                <div className="Edit-Profile-Element">
                    <div className="Edit-Profile-Title">I am</div>
                    <div className="orientation-dropdown-container">
                        <div
                            className="Edit-Profile-Orientation-Block"
                            onClick={() => setShowOrientationDropdown(!showOrientationDropdown)}
                        >
                            <div className="Edit-Profile-Interests-Block-Item-Text">
                                {selectedOrientation?.name || profile?.sexualOrientation?.name || "Select orientation"}
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="5"
                                viewBox="0 0 14 5"
                                fill="none"
                                style={{ transform: showOrientationDropdown ? 'rotate(180deg)' : 'none' }}
                            >
                                <path d="M7 4.5L0.937822 -1.88258e-07L13.0622 8.71687e-07L7 4.5Z" fill="white"/>
                            </svg>
                        </div>

                        {showOrientationDropdown && (
                            <div className="orientation-dropdown-list">
                                {orientations.map((orientation) => (
                                    <div
                                        key={orientation.id}
                                        className={`orientation-dropdown-item ${
                                            (selectedOrientation?.id === orientation.id ||
                                                profile?.sexualOrientation?.id === orientation.id) ? "selected" : ""
                                        }`}
                                        onClick={() => handleOrientationSelect(orientation)}
                                    >
                                        {orientation.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="Edit-Profile-Element">
                    <div className="Edit-Profile-Title">I'm looking for</div>
                    <div className="orientation-dropdown-container">
                        <div
                            className="Edit-Profile-Orientation-Block"
                            onClick={() => setShowLookingForDropdown(!showLookingForDropdown)}
                        >
                            <div className="Edit-Profile-Interests-Block-Item-Text">
                                {selectedLookingFor?.name || profile?.lookingFor?.name || "Select preference"}
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="5"
                                viewBox="0 0 14 5"
                                fill="none"
                                style={{ transform: showLookingForDropdown ? 'rotate(180deg)' : 'none' }}
                            >
                                <path d="M7 4.5L0.937822 -1.88258e-07L13.0622 8.71687e-07L7 4.5Z" fill="white"/>
                            </svg>
                        </div>

                        {showLookingForDropdown && (
                            <div className="orientation-dropdown-list">
                                {lookingFor.map((orientation) => (
                                    <div
                                        key={orientation.id}
                                        className={`orientation-dropdown-item ${
                                            (selectedLookingFor?.id === orientation.id ||
                                                profile?.lookingFor?.id === orientation.id) ? "selected" : ""
                                        }`}
                                        onClick={() => handleLookingForSelect(orientation)}
                                    >
                                        {orientation.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="Edit-Profile-Btns">
                    <button className="Edit-Profile-Btn" onClick={handleSaveChanges}>
                        <div className="Edit-Profile-Btn-Text">Save changes</div>
                    </button>
                    <button className="Edit-Profile-Btn" onClick={onClose}>
                        <div className="Edit-Profile-Btn-Text">Cancel</div>
                    </button>
                </div>




                {showJobTitleModal && (
                    <SexualOrientation
                        onClose={handleJobTitleSelect}
                        initialSelected={selectedJobTitleId}
                        isJobTitle={true}
                    />
                )}
                {showInterestsModal && (
                    <Interests
                        onClose={handleInterestsSelect}
                        initialSelected={selectedInterestIds}
                    />
                )}
            </div>
        </div>
    );
};

export default EditMyProfile;