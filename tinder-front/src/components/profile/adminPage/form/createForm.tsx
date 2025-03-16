import React, {useState} from 'react';
import Hand from "./img/Hand.svg";
import Vector from "./img/Vector.svg";
import Stars from "./img/Stars.svg";
import Sparkii from "./img/Sparkii.svg";

import Vector1 from "./img/Vector1.svg";
import Vector2 from "./img/Vector2.svg";

import IconAdd from "./img/IconAdd.svg";


import './createForm.css';
import LookingFor from "./modal/lookingFor/lookingFor";
import Interests from "./modal/interests/interests";
import SexualOrientation from "./modal/sexualOrientation/sexualOrientation";
import {jwtDecode} from "jwt-decode";
import {Form, message} from "antd";
import {ProfileService} from "../../../../services/profile.service";
import lookingFor from "./modal/lookingFor/lookingFor";
import sexualOrientation from "./modal/sexualOrientation/sexualOrientation";
import {useNavigate} from "react-router-dom";
import {RoleService} from "../../../../services/role.service";
import interests from "./modal/interests/interests";

const getUserIdFromToken = (token: string | null): string | null => {
    if (!token) return null;

    try {
        const decoded: any = jwtDecode(token);
        console.log("Decoded token:", decoded);
        console.log(decoded.role);
        return decoded.nameid || null; // Спробуйте використати 'sub'
    } catch (error) {
        console.error("Помилка декодування JWT", error);
        return null;
    }
};

const CreateForm: React.FC = () => {

    const [form] = Form.useForm();

    const [images, setImages] = useState<(File | string | null)[]>([null, null, null, null]);

    const [openModal, setOpenModal] = useState<string | null>(null);
    const [selectedRelationship, setSelectedRelationship] = useState<number | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
    const [selectedSexualOrientation, setSelectedSexualOrientation] = useState<number | null>(null);
    const [gender, setGender] = useState<number | null>(null);
    const [interestedIn, setInterestedIn] = useState<number | null>(null);

    const [name, setName] = useState<string>("");
    const [dob, setDob] = useState<Date | null>(null);

    const navigate = useNavigate();


    const handleOpenModal = (modal: string) => {
        setOpenModal(modal);
    };

    const handleCloseModal = () => {
        setOpenModal(null);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            setImages((prevImages) => {
                const newImages = [...prevImages];
                newImages[index] = file; // Now valid due to updated state type
                return newImages;
            });
        }
    };

    const handleRelationshipSelect = (selectedId: number | null) => {
        setSelectedRelationship(selectedId);
        handleCloseModal();
    };

    const handleInterestsSelect = (selectedIds: number[]) => {
        setSelectedInterests(selectedIds);
        handleCloseModal();
    };
    const handleOrientationSelect = (selectedId: number | null) => {
        setSelectedSexualOrientation(selectedId);
        handleCloseModal();
    };


    const handleDobChange = (field: "day" | "month" | "year", value: string) => {
        setDob((prevDob) => {
            const currentDob = prevDob || new Date(); // Якщо prevDob === null, створюємо новий об'єкт дати

            const updatedDob = {
                day: field === "day" ? value : currentDob.getDate().toString(),
                month: field === "month" ? value : (currentDob.getMonth() + 1).toString(),
                year: field === "year" ? value : currentDob.getFullYear().toString(),
            };

            const { day, month, year } = updatedDob;

            if (day && month && year) {
                const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

                if (!isNaN(parsedDate.getTime())) {
                    return parsedDate;
                }
            }

            return prevDob;
        });
    };






    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken(token);

        if (!userId) {
            message.error("Не вдалося отримати ID користувача. Увійдіть знову.");
            return;
        } else {
            message.success(`Отримано userId: ${userId}`);
        }

        const formData = new FormData();
        formData.append("UserId", userId);
        formData.append("Name", name);
        formData.append("BirthDay", dob ? dob.toISOString().split("T")[0] : "");
        if (gender !== null) formData.append("GenderId", gender.toString());
        if (interestedIn !== null) formData.append("InterestedInId", interestedIn.toString());
        if (selectedRelationship !== null) formData.append("LookingForId", selectedRelationship.toString());
        if (selectedSexualOrientation !== null) formData.append("SexualOrientationId", selectedSexualOrientation.toString());

        selectedInterests.forEach((interest) => {
            if (interest) { // TypeScript now recognizes this as valid
                formData.append("InterestIds", interest.toString());
            }
        });
// Додаємо масив фотографій
        images.forEach((image) => {
            if (image instanceof File) { // TypeScript now recognizes this as valid
                formData.append("Images", image);
            }
        });


// Виведення вмісту formData у консоль
        formData.forEach((value, key) => {
            console.log(`${key}:`, value);
        });

        try {
            await ProfileService.createProfile(formData);
            await RoleService.addRoleToUser(userId, "user");
            message.success("Profile updated successfully");
            navigate(`/user-view`);
        } catch (error: any) {
            console.error("Error saving profile:", error.response?.data || error.message);
            message.error("Failed to save profile");
        }
    };


    return (
        <div className=" min-h-screen h-screen overflow-y-auto bg-stone-950 flex flex-col relative">
            {/* Background Elements */}
            <div className="bg-elements w-screen h-[1617px] absolute">
                <img src={Hand} alt="Hand" className="absolute left-[1167px] top-[1329px]"/>
                <img src={Vector} alt="Vector" className="absolute left-[62px] top-[768px]"/>
                <img src={Stars} alt="Stars" className="absolute left-[1454px] top-[435px]"/>
                <div className="gradient w-screen h-[54px] bg-gradient-to-t from-stone-950 to-rose-950 absolute"/>
            </div>

            {/* Title */}
            <div className="title absolute left-[50%] top-[54px] transform -translate-x-1/2 flex flex-col items-center gap-4">
                <span className="heart text-rose-950 text-4xl font-medium">♡</span>
                <h1 className="text-orange-300 text-4xl font-bold text-center">˗ˋˏ Complete your registration ˎˊ˗</h1>
            </div>

            {/* Profile Picture Upload */}
            <div className="profile-pic w-[456px] absolute left-[367px] top-[273px] flex flex-col gap-4">
                <h2 className="text-white text-xl font-medium">Add Profile Pictures</h2>
                <div className="grid grid-cols-2 gap-4">
                    {images.map((image, i) => (
                        <div key={i} className="relative w-[216px] h-[268px]">
                            {/* Рамка */}
                            <div
                                className="w-full h-full border-2 border-red-900 rounded-xl flex items-center justify-center overflow-hidden">
                                {image ? (
                                    <img
                                        src={image instanceof File ? URL.createObjectURL(image) : image || ""}
                                        alt={`Uploaded ${i}`}
                                        className="w-full h-full object-cover rounded-xl"
                                    />

                                ) : (
                                    <label htmlFor={`file-upload-${i}`} className="cursor-pointer">
                                        <img src={IconAdd} alt="Add" className="absolute left-[178px] top-[230px]"/>
                                    </label>
                                )}
                            </div>

                            {/* Поле вибору файлу (приховане) */}
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

            {/* Form Container */}
            <div className="form-container absolute left-[50%] top-[273px] flex flex-col gap-6">
                {/* Name Input */}
                <label className="form-label gap-[24px]">
                    <span>Name</span>
                    <input
                        type="text"
                        placeholder="Name"
                        className="input-field"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>

                {/* Date of Birth Inputs */}
                <label className="form-label">
                    Date of birth
                    <div className="flex gap-3">
                        <input
                            type="number"
                            placeholder="DD"
                            className="input-date w-[124px]"
                            min="1" max="31"
                            onChange={(e) => handleDobChange("day", e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="MM"
                            className="input-date w-[124px]"
                            min="1" max="12"
                            onChange={(e) => handleDobChange("month", e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="YYYY"
                            className="input-date w-[124px]"
                            min="1900" max="2100"
                            onChange={(e) => handleDobChange("year", e.target.value)}
                        />
                    </div>
                </label>


                {/* Gender Selection */}
                <label className="form-label">
                    Gender
                    <div className="flex gap-3">
                        {[
                            {label: "Male", value: 1},
                            {label: "Female", value: 2},
                        ].map(({label, value}) => (
                            <button
                                key={label}
                                className={`btn-option ${gender === value ? "active" : ""}`}
                                onClick={() => setGender(value)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </label>


                {/* Interested In Selection */}
                <label className="form-label">
                    I’m interested in
                    <div className="flex gap-3">
                        {[
                            {label: "Male", value: 1},
                            {label: "Female", value: 2},
                            {label: "Both", value: 3},
                        ].map(({label, value}) => (
                            <button
                                key={label}
                                className={`btn-option ${interestedIn === value ? "active" : ""}`}
                                onClick={() => setInterestedIn(value)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </label>
            </div>

            <div className="optional-container absolute left-[416px] top-[1003px] flex gap-3">
                <img src={Vector1} alt="Vector"/>
                <span className="optional-text">optional</span>
                <img src={Vector2} alt="Vector"/>
            </div>

            <div className="form-2-container absolute w-[400px] left-[367px] top-[1099px] flex flex-col gap-6">
                {[
                    {id: "relationship", label: "I'm looking for", placeholder: "+ Add a relationship goal"},
                    {id: "interests", label: "Interests", placeholder: "+ Add interests"},
                    {id: "orientation", label: "Sexual orientation", placeholder: "+ Add Sexual orientation"},
                ].map((item) => (
                    <label key={item.id} className="form-label">
                        {item.label}
                        <button className="btn-placeholder-form2" onClick={() => handleOpenModal(item.id)}>
                            <span>{item.placeholder}</span>
                        </button>
                    </label>
                ))}

                {/* Відображення модальних вікон */}
                {openModal === "relationship" && <LookingFor onClose={handleRelationshipSelect}/>}

                {openModal === "interests" && <Interests onClose={handleInterestsSelect}/> }

                {openModal === "orientation" &&<SexualOrientation onClose={handleOrientationSelect}/>}
            </div>

            {/* Submit Button */}
            <button className="find-love-btn" onClick={handleSubmit}>
                Find your love!
            </button>

            {/* Logo */}
            <img src={Sparkii} alt="Logo" className="absolute left-[141px] top-[56px]"/>
        </div>
    );
};

export default CreateForm;
