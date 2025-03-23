import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Separator from "./img/Sepatator.svg";
import "./Settings.css";
import {ProfileInfoService} from "../../../../../services/profile.info.service";
import {Profile, ProfileService} from "../../../../../services/profile.service";
import {JwtService} from "../../../../../services/jwt.service";
import {logout} from "../../../../../services/auth.service";



interface SettingsProps {
    closeSettings: () => void;
}

const Settings: React.FC<SettingsProps> = ({ closeSettings }) => {
    const [isToggled, setIsToggled] = useState(true);
    const [minAge, setMinAge] = useState(19);
    const [maxAge, setMaxAge] = useState(34);
    const minLimit = 10;
    const maxLimit = 60;
    const navigate = useNavigate();

    const [profile, setProfile] = useState<Profile | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [locations, setLocations] = useState<{ id: number; name: string }[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>("My Current Location");

    useEffect(() => {
        handleProfile();
        ProfileInfoService.getCountries()
            .then((countries) => {
                setLocations(countries); // Використовуємо повернуті дані напряму
            })
            .catch((error) => {
                console.error("Error fetching locations:", error);
            });


    }, []);

    useEffect(() => {
        if (profile) {
            setSettings();
        }
    }, [profile]);

    const handleProfile=async ()=>{
        const token = localStorage.getItem("token");
        const userId = JwtService.getUserIdFromToken(token);
        if(userId)
        {
            const data = await ProfileService.getProfileById(userId);
            setProfile(data);
        }
    }

    const setSettings = () => {
        if (profile?.location) {
            setSelectedLocation(profile.location.name);
        }
        if (profile?.minAge != null) {
            setMinAge(profile.minAge);
        }
        if (profile?.maxAge != null) {
            setMaxAge(profile.maxAge);
        }
        if (profile?.showMe !== undefined) {
            setIsToggled(profile.showMe); // Виправлено: тепер коректно оновлюється значення
        }
    };


    const handleToggle = () => setIsToggled(!isToggled);

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    const handleSaveSettings = async () => {
        const token = localStorage.getItem("token");
        let userId = JwtService.getUserIdFromToken(token);

        const selectedLocationId = locations.find(loc => loc.name === selectedLocation)?.id;


        const settingsData = {
            locationId: selectedLocationId,
            minAge,
            maxAge,
            showMe: isToggled,
        };
        if(userId !== null)
        {
            try {
                await ProfileService.updateSettings(userId, settingsData);
                console.log("Settings saved successfully");
                closeSettings();
            } catch (error) {
                console.error("Error updating settings:", error);
            }
        }

    };


    return (
        <div className="settings-container">
            <h1 className="sett-title">Settings</h1>
            <div className="Settings-section">
                <div className="Settings-block">
                    <div className="Settings-text">Location</div>
                    <div className="Choose">
                        <div onClick={() => setIsOpen(!isOpen)}>
                            <span>{selectedLocation}</span>
                            <span className="text-lg">{isOpen ? "▲" : "▼"}</span>
                        </div>
                        {isOpen && (
                            <ul className="dropdown">
                                {locations.map((location) => (
                                    <li key={location.id} className="dropdown-item"
                                        onClick={() => {
                                            setSelectedLocation(location.name);
                                            setIsOpen(false);
                                        }}>
                                        {location.name}
                                    </li>
                                ))}
                            </ul>
                        )}
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
                <div className="Settings-btn" onClick={handleLogout}>
                    <div className="Settings-btn-text">Logout</div>
                </div>
            </div>
            <div className="Settings-btns">
                <div className="Button-Save" onClick={closeSettings}>
                    <div className="Settings-btn-text">Cancel</div>
                </div>
                <div className="Button-Save" onClick={handleSaveSettings}>
                    <div className="Settings-btn-text">Save</div>
                </div>
            </div>

        </div>
    );
};

export default Settings;