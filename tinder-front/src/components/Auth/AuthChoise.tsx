import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthChoice: React.FC = () => {
    const [choice, setChoice] = useState<"login" | "register" | null>(null);

    if (choice === "login") return <Login />;
    if (choice === "register") return <Register />;

    return (
        <div style={styles.container}>
            <h1>Welcome! Do you want to register or log in?</h1>
            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={() => setChoice("login")}>
                    Login
                </button>
                <button style={styles.button} onClick={() => setChoice("register")}>
                    Register
                </button>
            </div>
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


export default AuthChoice;
