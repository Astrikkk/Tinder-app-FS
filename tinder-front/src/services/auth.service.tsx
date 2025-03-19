import {JwtService} from "./jwt.service";

const API_BASE_URL = process.env.REACT_APP_API + "/Auth";

export interface LoginResponse {
    token: string;
}

export interface RegisterResponse {
    token: string;
}

const parseJSON = async (response: Response) => {
    try {
        return await response.json();
    } catch {
        throw new Error("Invalid server response.");
    }
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await parseJSON(response);
        throw new Error(error.Error || "Login failed.");
    }

    return await parseJSON(response);
};

export const register = async (email: string, password: string): Promise<RegisterResponse> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await parseJSON(response);
        throw new Error(error.Error || "Registration failed.");
    }

    return await parseJSON(response);
};

export const setOffline = async () =>{
    try {
        const token = localStorage.getItem("token");
        const email = JwtService.getEmailFromToken(token);
        if (token && email) {
            const requestBody = JSON.stringify({ email });

            const response = await fetch(`${API_BASE_URL}/offline-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: requestBody, // Send JSON body
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Server error response:", errorResponse);
            }
        }


    }catch (error) {
        console.error("Logout failed:", error);
    }
}

export const setOnline = async () =>{
    try {
        const token = localStorage.getItem("token");
        const email = JwtService.getEmailFromToken(token);
        if (token && email) {
            const requestBody = JSON.stringify({ email });

            const response = await fetch(`${API_BASE_URL}/online-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: requestBody,
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Server error response:", errorResponse);
            }
        }


    }catch (error) {
        console.error("Logout failed:", error);
    }
}

export const logout = async () => {
    try {
        setOffline();
        localStorage.removeItem("token"); // Remove token
    } catch (error) {
        console.error("Logout failed:", error);
    }
};




