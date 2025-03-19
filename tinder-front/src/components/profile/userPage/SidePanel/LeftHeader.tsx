import React from "react";
import SettingsPng from "../img/icon_settings.svg";
import SecurityPng from "../img/icon_security.svg";
import Settings from "./Settings/Settings";
import Security from "./Security/Security";
import "./LeftHeader.css";

interface LeftHeaderProps {
    myProfile: {
        imagePath: string;
        name: string;
    } | null;
    selectedProfileId: number;
    isSettingsOpen: boolean;
    isSecurityOpen: boolean;
    showSettingsModal: () => void;
    showSecurityModal: () => void;
    closeSettingsModal: () => void;
    closeSecurityModal: () => void;
}

const LeftHeader: React.FC<LeftHeaderProps> = ({
                                                   myProfile,
                                                   selectedProfileId,
                                                   isSettingsOpen,
                                                   isSecurityOpen,
                                                   showSettingsModal,
                                                   showSecurityModal,
                                                   closeSettingsModal,
                                                   closeSecurityModal,
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
                    <button onClick={showSecurityModal}>
                        <img src={SecurityPng} alt="Security" />
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
            {isSecurityOpen && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        <Security closeSettings={closeSecurityModal} selectedProfileId={selectedProfileId} />
                    </div>
                </div>
            )}

        </div>
    );
};

export default LeftHeader;