import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API}/account`;

export interface Role {
    id?: string;
    name: string;
}

export const RoleService = {
    // Отримати всі ролі користувача
    getUserRoles: async (username: string): Promise<string[]> => {
        const response = await axios.get(`${API_URL}/get-roles`, {
            params: { username },
        });
        return response.data;
    },

    // Додати роль користувачу
    addRoleToUser: async (username: string, role: string): Promise<void> => {
        await axios.post(`${API_URL}/add-role`, null, {
            params: { username, role },
        });
    },

    // Видалити роль у користувача
    removeRoleFromUser: async (username: string, role: string): Promise<void> => {
        await axios.post(`${API_URL}/remove-role`, null, {
            params: { username, role },
        });
    },
};
