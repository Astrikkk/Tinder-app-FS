// profile.service.ts
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API}/Profile`;

export interface Profile {
    id?: string;
    name: string;
    birthDay: string;
    gender: string;
    interestedIn: string;
    lookingFor: string;
    sexualOrientation: string;
    interests: string[];
    imagePath?: string;
    photos?: string[];
}

export const ProfileService = {
    getProfiles: async (): Promise<Profile[]> => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getProfileById: async (id: string): Promise<Profile> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    createProfile: async (formData: FormData): Promise<void> => {
        await axios.post(API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    updateProfile: async (id: string, formData: FormData): Promise<void> => {
        await axios.put(`${API_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    deleteProfile: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    },


};
