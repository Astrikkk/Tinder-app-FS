const API_BASE_URL = process.env.REACT_APP_API + "/Auth";

export interface LoginResponse {
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

export const register = async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await parseJSON(response);
        throw new Error(error.Error || "Registration failed.");
    }
};
