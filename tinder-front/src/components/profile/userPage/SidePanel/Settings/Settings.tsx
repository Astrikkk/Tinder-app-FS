import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Імпорт useNavigate
import Separator from "./img/Sepatator.svg";
import "./Settings.css";

interface SettingsProps {
    closeSettings: () => void;
}

const Settings: React.FC<SettingsProps> = ({ closeSettings }) => {
    const [isToggled, setIsToggled] = useState(false);
    const [minAge, setMinAge] = useState(19);
    const [maxAge, setMaxAge] = useState(34);
    const minLimit = 18;
    const maxLimit = 60;
    const navigate = useNavigate(); // Хук для навігації

    const handleToggle = () => setIsToggled(!isToggled);

    // Функція для виходу з облікового запису
    const handleLogout = () => {
        localStorage.removeItem("token"); // Видалення токена
        navigate("/auth"); // Перенаправлення на сторінку авторизації
    };

    return (
        <div className="settings-container">
            <h1 className="sett-title">Settings</h1>
            <div className="Settings-section">
                <div className="Settings-block">
                    <div className="Settings-text">Location</div>
                    <div className="Choose">
                        <div className="Choose-text">My Current Location</div>
                        <span className="Choose-arrow">{">"}</span>
                    </div>
                </div>
            </div>
            <img src={Separator} alt="Separator" />
            <div className="Settings-section">
                <div className="Settings-block">
                    <div className="Settings-text">Show Me On Sparkii</div>
                    <div className="toggle-switch" onClick={handleToggle}>
                        <div className={`switch-body ${isToggled ? "active" : ""}`}>
                            <div className="switch"></div>
                        </div>
                    </div>
                </div>
                <div className="Settings-block">
                    <div className="Settings-group">
                        <div className="Settings-group-text">
                            <div className="Settings-text">Age Range</div>
                            <div className="Choose-text">{minAge}-{maxAge}</div>
                        </div>
                        <div className="age-range-slider">
                            <div className="range-track">
                                <div
                                    className="range-fill"
                                    style={{
                                        left: `${((minAge - minLimit) / (maxLimit - minLimit)) * 100}%`,
                                        right: `${100 - ((maxAge - minLimit) / (maxLimit - minLimit)) * 100}%`,
                                    }}
                                ></div>
                            </div>
                            <input
                                type="range"
                                min={minLimit}
                                max={maxLimit}
                                value={minAge}
                                onChange={(e) => setMinAge(Math.min(Number(e.target.value), maxAge - 1))}
                            />
                            <input
                                type="range"
                                min={minLimit}
                                max={maxLimit}
                                value={maxAge}
                                onChange={(e) => setMaxAge(Math.max(Number(e.target.value), minAge + 1))}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <img src={Separator} alt="Separator" />
            <div className="Settings-btns">
                <div className="Settings-btn"><div className="Settings-btn-text">Change password</div></div>
                {/* Виклик handleLogout при натисканні */}
                <div className="Settings-btn" onClick={handleLogout}>
                    <div className="Settings-btn-text">Logout</div>
                </div>
            </div>
            {/* Кнопка Save закриває модальне вікно */}
            <div className="Button-Save" onClick={closeSettings}>
                <div className="Settings-btn-text">Save</div>
            </div>
        </div>
    );
};

export default Settings;
