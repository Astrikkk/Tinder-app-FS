import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API}/account`;

export interface Role {
    id?: string;
    name: string;
}

export const RoleService = {
    // Отримати всі ролі користувача
    getUserRoles: async (userId: string): Promise<string[]> => {
        const response = await axios.get(`${API_URL}/get-roles/${userId}`);

        return response.data;
    },
    getUserEmail: async (userId: string): Promise<string[]> => {
        const response = await axios.get(`${API_URL}/get-email/${userId}`);

        return response.data;
    },

    // Додати роль користувачу
    addRoleToUser: async (userId: string, role: string): Promise<void> => {
        await axios.post(`${API_URL}/add-role`, null, {
            params: { userId, role },
        });
    },

    // Видалити роль у користувача
    removeRoleFromUser: async (userId: string, role: string): Promise<void> => {
        await axios.post(`${API_URL}/remove-role`, null, {
            params: { userId, role },
        });
    },
};
