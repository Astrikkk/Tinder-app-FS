const API_BASE_URL = process.env.REACT_APP_API + '/Auth';

export interface LoginResponse {
    token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.Error || "Login failed.");
    }

    return await response.json();
};

export const register = async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.Error || "Registration failed.");
    }
};