import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem("authToken");

            if (token) {
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem("authToken"); // Видаляємо недійсний токен
                setIsAuthenticated(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = (token: string) => {
        localStorage.setItem("authToken", token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
