import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch("https://localhost:7034/api/Auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.Token);  // Save the token in localStorage
                console.log("Token saved:", data.Token);  // Log to verify the token is saved
                alert("Login successful!");
                navigate("/");  // Redirect to the home page
            } else {
                alert("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
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
