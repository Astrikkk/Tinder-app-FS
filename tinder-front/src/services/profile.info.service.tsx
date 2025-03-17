import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API}`;

export const ProfileInfoService = {
    // Genders
    getGenders: async (): Promise<{ id: number; name: string }[]> => {
        const response = await axios.get(`${API_URL}/gender`);
        return response.data;
    },

    // Interests
    getInterests: async (): Promise<{ id: number; name: string }[]> => {
        const response = await axios.get(`${API_URL}/interests`);
        return response.data;
    },
    createInterests: async (data: { name: string }): Promise<void> => {
        await axios.post(`${API_URL}/interests`, data, {
            headers: { "Content-Type": "application/json" },
        });
    },
    updateInterests: async (id: string, data: { name: string }): Promise<void> => {
        await axios.put(`${API_URL}/interests/${id}`, data, {
            headers: { "Content-Type": "application/json" },
        });
    },
    deleteInterests: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/interests/${id}`);
    },


    // Country
    getCountries: async (): Promise<{ id: number; name: string }[]> => {
        const response = await axios.get(`${API_URL}/country`);
        return response.data;
    },
    createCountry: async (data: { name: string }): Promise<void> => {
        await axios.post(`${API_URL}/country`, data, {
            headers: { "Content-Type": "application/json" },
        });
    },
    updateCountry: async (id: string, data: { name: string }): Promise<void> => {
        await axios.put(`${API_URL}/country/${id}`, data, {
            headers: { "Content-Type": "application/json" },
        });
    },
    deleteCountry: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/country/${id}`);
    },

    // Interested In
    getInterestedIn: async (): Promise<{ id: number; name: string }[]> => {
        const response = await axios.get(`${API_URL}/interestedIn`);
        return response.data;
    },
    createInterestedIn: async (data: { name: string }): Promise<void> => {
        await axios.post(`${API_URL}/interestedIn`, data, {
            headers: { "Content-Type": "application/json" },
        });
    },
    updateInterestedIn: async (id: string, data: { name: string }): Promise<void> => {
        await axios.put(`${API_URL}/interestedIn/${id}`, data, {
            headers: { "Content-Type": "application/json" },
        });
    },
    deleteInterestedIn: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/interestedIn/${id}`);
    },

    // Looking For
    getLookingFor: async (): Promise<{ id: number; name: string }[]> => {
        const response = await axios.get(`${API_URL}/lookingFor`);
        return response.data;
    },
    createLookingFor: async (data: { name: string }): Promise<void> => {
        await axios.post(`${API_URL}/lookingFor`, data, {
            headers: { "Content-Type": "application/json" },
        });
    },
    updateLookingFor: async (id: string, data: { name: string }): Promise<void> => {
        await axios.put(`${API_URL}/lookingFor/${id}`, data, {
            headers: { "Content-Type": "application/json" },
        });
    },
    deleteLookingFor: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/lookingFor/${id}`);
    },

    // Sexual Orientation
    getSexualOrientation: async (): Promise<{ id: number; name: string }[]> => {
        const response = await axios.get(`${API_URL}/sexualOrientation`);
        return response.data;
    },
    createSexualOrientation: async (data: { name: string }): Promise<void> => {
        await axios.post(`${API_URL}/sexualOrientation`, data, {
            headers: { "Content-Type": "application/json" },
        });
    },
    updateSexualOrientation: async (id: string, data: { name: string }): Promise<void> => {
        await axios.put(`${API_URL}/sexualOrientation/${id}`, data, {
            headers: { "Content-Type": "application/json" },
        });
    },
    deleteSexualOrientation: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/sexualOrientation/${id}`);
    },
};
