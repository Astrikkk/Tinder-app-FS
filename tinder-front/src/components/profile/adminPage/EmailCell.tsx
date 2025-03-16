import React, {useEffect, useState} from "react";
import {RoleService} from "../../../services/role.service";
import ProfileList from "./Content";

const EmailCell: React.FC<{ userId: number }> = ({ userId }) => {
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const userEmail = await RoleService.getUserEmail(userId.toString());
                setEmail(userEmail.toString());
            } catch (error) {
                console.error("Помилка отримання email:", error);
                setEmail("N/A");
            }
        };

        fetchEmail();
    }, [userId]);

    return <>{email ?? "Завантаження..."}</>;
};
export default EmailCell;
