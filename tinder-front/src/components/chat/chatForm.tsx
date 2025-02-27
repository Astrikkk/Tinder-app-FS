import React, { useState } from "react";

interface ChatFormProps {
    joinChat: (username: string, chatName: string) => void;
    onDislike?: () => void; // Додано як необов'язковий пропс
}

const ChatForm: React.FC<ChatFormProps> = ({ joinChat }) => {
    const [username, setUsername] = useState<string>("");
    const [chatName, setChatName] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        joinChat(username, chatName);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Створити чат</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Поле імені користувача */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Ім'я користувача
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Введіть ваше ім'я"
                        required
                    />
                </div>

                {/* Поле назви чату */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Назва чату
                    </label>
                    <input
                        type="text"
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Введіть назву чату"
                        required
                    />
                </div>

                {/* Кнопка відправки */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Створити чат
                </button>
            </form>
        </div>
    );
};

export default ChatForm;
