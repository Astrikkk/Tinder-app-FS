import React, { useState } from "react";
import { register } from "../../services/auth.service";

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleRegister = async () => {
        try {
            await register(email, password);
            console.log("Registration successful!");
            alert("Registration successful! You can now log in.");
        } catch (error: any) {
            console.error("Registration error:", error);
            alert(error.message || "An unexpected error occurred.");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Register</h2>
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
            <button onClick={handleRegister} style={styles.button}>
                Register
            </button>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
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

export default Register;
