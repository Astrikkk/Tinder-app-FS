import { jwtDecode } from "jwt-decode";

export const JwtService = {
    getUserIdFromToken: (token: string | null): string | null => {
        if (!token) return null;

        try {
            const decoded: any = jwtDecode(token);
            console.log("Decoded token:", decoded);

            return decoded.nameid || null; // Спробуйте використати 'sub'
        } catch (error) {
            console.error("Помилка декодування JWT", error);
            return null;
        }
    },

    getEmailFromToken: (token: string | null): string | null => {
        if (!token) return null;

        try {
            const decoded: any = jwtDecode(token);
            console.log("Decoded token:", decoded);

            return decoded.email || null; // Спробуйте використати 'sub'
        } catch (error) {
            console.error("Помилка декодування JWT", error);
            return null;
        }
    },
    getUserNameFromToken: (token: string | null): string | null => {
        if (!token) return null;

        try {
            const decoded: any = jwtDecode(token);
            console.log("Decoded token:", decoded);

            return decoded.name || null; // Спробуйте використати 'sub'
        } catch (error) {
            console.error("Помилка декодування JWT", error);
            return null;
        }
    },
    getRoleFromToken: (token: string | null): string | null => {
        if (!token) return null;

        try {
            const decoded: any = jwtDecode(token);
            console.log("Decoded token:", decoded);

            return decoded.role || null; // Спробуйте використати 'sub'
        } catch (error) {
            console.error("Помилка декодування JWT", error);
            return null;
        }
    }
};
