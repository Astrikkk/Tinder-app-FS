import React, {useState} from 'react';
import Hand from "./img/Hand.svg";
import Vector from "./img/Vector.svg";
import Stars from "./img/Stars.svg";
import Sparkii from "./img/Sparkii.svg";

import Vector1 from "./img/Vector1.svg";
import Vector2 from "./img/Vector2.svg";

import IconAdd from "./img/IconAdd.svg";


import './createForm.css'; // Імпортуємо CSS файл

const CreateForm: React.FC = () => {

    const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);

    const [gender, setGender] = useState<string>("");
    const [interestedIn, setInterestedIn] = useState<string>("");

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file);

            setImages((prevImages) => {
                const newImages = [...prevImages];
                newImages[index] = imageUrl;
                return newImages;
            });
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
                                    <img src={image} alt={`Uploaded ${i}`}
                                         className="w-full h-full object-cover rounded-xl"/>
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
                    <input type="text" placeholder="Name" className="input-field"/>
                </label>

                {/* Date of Birth Inputs */}
                <label className="form-label">
                    Date of birth
                    <div className="flex gap-3">
                        <input type="number" placeholder="DD" className="input-date w-[124px]" min="1" max="31"/>
                        <input type="number" placeholder="MM" className="input-date w-[124px]" min="1" max="12"/>
                        <input type="number" placeholder="YYYY" className="input-date w-[124px]" min="1900"
                               max="2100"/>
                    </div>
                </label>

                {/* Gender Selection */}
                <label className="form-label">
                    Gender
                    <div className="flex gap-3">
                        {["Male", "Female"].map((option) => (
                            <button
                                key={option}
                                className={`btn-option ${gender === option ? "active" : ""}`}
                                onClick={() => setGender(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </label>

                {/* Interested In Selection */}
                <label className="form-label">
                    I’m interested in
                    <div className="flex gap-3">
                        {["Male", "Female", "Both"].map((option) => (
                            <button
                                key={option}
                                className={`btn-option ${interestedIn === option ? "active" : ""}`}
                                onClick={() => setInterestedIn(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </label>
            </div>

            <div className="optional-container absolute left-[416px] top-[1003px] flex gap-3">
                <img src={Vector1} alt="Vector"/>
                <span className="text-orange-300 text-2xl font-bold">optional</span>
                <img src={Vector2} alt="Vector"/>
            </div>

            <div className="form-2-container absolute w-[400px] left-[367px] top-[1099px] flex flex-col gap-6">
                {[
                    {label: "I'm looking for", placeholder: "+ Add a relationship goal"},
                    {label: "Interests", placeholder: "+ Add interests"},
                    {label: "Sexual orientation", placeholder: "+ Add Sexual orientation"},
                ].map((item, i) => (
                    <label key={i} className="form-label">
                        {item.label}
                        <button className="btn-placeholder-form2"><span>{item.placeholder}</span></button>
                    </label>
                ))}
            </div>

            {/* Submit Button */}
            <button className="submit-btn">
                Find your love!
            </button>

            {/* Logo */}
            <img src={Sparkii} alt="Logo" className="absolute left-[141px] top-[56px]"/>
        </div>
    );
};

export default CreateForm;
