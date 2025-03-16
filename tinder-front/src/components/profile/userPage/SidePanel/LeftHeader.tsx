import React from "react";
import Security from "../img/icon_security.svg";
import SettingsPng from "../img/icon_settings.svg";
import Settings from "./Settings/Settings";
import "./LeftHeader.css"; // Імпорт стилів

interface LeftHeaderProps {
    myProfile: {
        imagePath: string;
        name: string;
    } | null;
    isSettingsOpen: boolean;
    showSettingsModal: () => void;
    closeSettingsModal: () => void;
}

const LeftHeader: React.FC<LeftHeaderProps> = ({
                                                   myProfile,
                                                   isSettingsOpen,
                                                   showSettingsModal,
                                                   closeSettingsModal,
                                               }) => {
    return (
        <div className="left-header">
            <div className="bg-left-3"></div>
            <div className="section-1">
                <div className="account">
                    <img
                        className="your-avatar"
                        src={`http://localhost:7034${myProfile?.imagePath}`}
                        alt="Your Avatar"
                    />
                    <div className="your-name">{myProfile?.name || "Unknown"}</div>
                </div>

                <div className="security-settings">
                    <button>
                        <img src={Security} alt="Security" />
                    </button>

                    <button onClick={showSettingsModal}>
                        <img src={SettingsPng} alt="Settings" />
                    </button>
                </div>
            </div>
            <div className="bg-left-2"></div>

            {/* Кастомне модальне вікно */}
            {isSettingsOpen && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        <Settings closeSettings={closeSettingsModal} />
                    </div>
                </div>
            )}

        </div>
    );
};

export default LeftHeader;