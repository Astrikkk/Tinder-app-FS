import React from "react";
import ReportImg from "./img/Report.svg";
import "../Settings/Settings.css"
import {ProfileService} from "../../../../../services/profile.service";
import {message} from "antd";

interface SecurityProps {
    closeSettings: () => void;
    selectedProfileId:number|null;
}
const Security: React.FC<SecurityProps> = ({ closeSettings, selectedProfileId }) => {
    const handleReport = async () => {
        if (selectedProfileId !== null) {
            console.log("Selected Profile ID:", selectedProfileId); // Debugging log
            try {
                await ProfileService.reportProfile(selectedProfileId);
                message.success("Profile reported successfully.");
            } catch (error) {
                console.error("Error reporting profile:", error);
            }
        }
        else{
            console.log("selectedProfileId null")
        }
    };

    return(
        <div className="settings-container">
            <div className="Settings-block">
                <div onClick={handleReport} className="Settings-text Report"><img src={ReportImg}/>Report</div>
            </div>

            <div className="Settings-btns">
                <div className="Button-Save" onClick={closeSettings}>
                    <div className="Settings-btn-text">Cancel</div>
                </div>
            </div>
        </div>
    );
}
export default Security;