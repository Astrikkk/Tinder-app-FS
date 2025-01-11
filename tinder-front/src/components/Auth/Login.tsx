import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            console.log("Attempting login...");
            const response = await fetch("https://localhost:7034/api/Auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            console.log("Response status:", response.status);

            // Check if the response contains JSON
            const isJson = response.headers.get("content-type")?.includes("application/json");
            if (response.ok) {
                const data = isJson ? await response.json() : null;  // JSON or null
                if (data?.token) {
                    console.log("Token received:", data.token);
                    localStorage.setItem("token", data.token);
                    alert("Login successful!");
                    navigate("/");
                } else {
                    alert("Login successful, but no token received.");
                }
            } else {
                const errorText = isJson ? await response.json() : await response.text();
                console.error("Error response:", errorText);
                alert("Login failed: " + (errorText?.Error || "Unknown error"));
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An unexpected error occurred.");
        }
    };






    return (
        <div style={styles.container}>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleLogin} style={styles.button}>
                Login
            </button>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        textAlign: "center",
        marginTop: "50px",
    },
    input: {
        display: "block",
        margin: "10px auto",
        padding: "10px",
        fontSize: "16px",
        width: "80%",
        maxWidth: "300px",
    },
    button: {
        marginTop: "20px",
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
    },
};

export default Login;
