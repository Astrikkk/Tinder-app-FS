import { useEffect } from "react";
import {logout} from "../../services/auth.service";

export const InactivityTracker = () => {
    useEffect(() => {
        let timer: NodeJS.Timeout;

        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => logout(), 2 * 60 * 1000);
        };

        ["mousemove", "keydown", "click", "scroll"].forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        resetTimer();

        return () => {
            clearTimeout(timer);
            ["mousemove", "keydown", "click", "scroll"].forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, []);

    return null; // Нічого не рендеримо, просто слухаємо активність
};
export default InactivityTracker;
