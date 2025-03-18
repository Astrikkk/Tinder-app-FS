import axios from 'axios';
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from '@microsoft/signalr';

const API_URL = `${process.env.REACT_APP_API}/Chat`;

export interface MessageInfo {
    id: number;
    content: string;
    sender: {
        id: number;
        userName: string;
    };
    readed: boolean;
    createdAt: Date;
}

export interface ChatRoomInfo {
    chatRoom: string;
    creator: {
        id: number;
        userName: string;
    };
    participant: {
        id: number;
        userName: string;
    };
    messages: MessageInfo[];
}

export interface Profile {
    userId: number;
    name: string;
    imagePath: string;
}

export const ChatService = {
    // Отримати інформацію про чат за ключем
    getChatInfoByKey: async (key: string): Promise<ChatRoomInfo> => {
        const response = await axios.get(`${API_URL}/${key}`);
        return response.data;
    },

    deleteChat: async (key: string): Promise<void> => {
        try {
            await axios.delete(`${API_URL}/${key}`);
            console.log(`Чат ${key} успішно видалено`);
        } catch (error) {
            console.error("Помилка видалення чату:", error);
            throw new Error("Не вдалося видалити чат.");
        }
    },

    clearChat: async (key: string): Promise<void> => {
        try {
            await axios.delete(`${API_URL}/${key}/clear`);
            console.log(`Повідомлення в чаті ${key} успішно очищено`);
        } catch (error) {
            console.error("Помилка очищення чату:", error);
            throw new Error("Не вдалося очистити чат.");
        }
    },


    // Ініціалізація підключення до SignalR
    initChatConnection: async (): Promise<HubConnection> => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl("http://localhost:7034/Chat")
                .configureLogging(LogLevel.Information)
                .build();

            connection.on("ReceiveMessage", (username: string, msg: string) => {
                console.log(`Message from ${username}: ${msg}`);
            });

            await connection.start();
            console.log("Підключено до SignalR");
            return connection;
        } catch (e) {
            console.error("Помилка підключення до чату:", e);
            throw new Error("Не вдалося підключитися до чату. Спробуйте пізніше.");
        }
    },

    // Створення приватного чату
    createPrivateChat: async (connection: HubConnection, myProfile: Profile, participantId: number): Promise<void> => {
        if (!connection || !myProfile) {
            console.warn("Підключення до хабу не встановлено або не знайдено профіль користувача");
            return;
        }
        try {
            await connection.invoke("CreatePrivateChat", myProfile.userId, participantId);
            console.log(`Приватний чат між ${myProfile.userId} та ${participantId} створено`);
        } catch (e) {
            console.error("Помилка створення приватного чату:", e);
            throw new Error("Не вдалося створити приватний чат.");
        }
    },
    joinChatRoom: async (connection: HubConnection, chatRoom: string, username?: string): Promise<void> => {
        if (!connection) {
            console.warn("SignalR підключення не встановлено.");
            return;
        }

        if (connection.state !== HubConnectionState.Connected) {
            console.warn("SignalR підключення ще не готове. Очікуємо...");
            await connection.start();
        }

        try {
            await connection.invoke("JoinSpecificChatRoom", { username, chatRoom });
            console.log(`Приєднано до чату: ${chatRoom}`);
        } catch (e) {
            console.error("Помилка приєднання до чату:", e);
            throw new Error("Не вдалося приєднатися до чату.");
        }
    },

    // Надсилання повідомлення
    sendMessage: async (connection: HubConnection, chatRoom: string, senderId: number, message: string): Promise<void> => {
        try {
            if (connection) {
                await connection.invoke("SendMessage", chatRoom, senderId, message);
                console.log(`Message sent to ${chatRoom}: ${message}`);
            }
        } catch (e) {
            console.error("Помилка надсилання повідомлення:", e);
            throw new Error("Не вдалося надіслати повідомлення.");
        }
    },

};