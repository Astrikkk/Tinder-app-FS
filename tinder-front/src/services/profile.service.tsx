import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API}/Profile`;

export interface Profile {
    id: number;
    name: string;
    imagePath: string;
    gender: {
        id: number;
        name: string;
    };
    lookingFor: {
        id: number;
        name: string;
    };
    interestedIn: {
        id: number;
        name: string;
    };
    sexualOrientation: {
        id: number;
        name: string;
    };
    birthDay: Date;
    interests: {
        id: number;
        name: string;
    }[];
    photos: string[];
    userId: number;
    likedByUserIds: number[]; // Add this line
    matchedUserIds: number[]; // Add this line
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
    
    getUserChats: async (userId: string): Promise<any[]> => {
        const response = await axios.get(`${API_URL}/${userId}/chats`);
        return response.data;
    },


};