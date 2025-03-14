import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API}/Profile`;

export interface Profile {
    id: number; // Ensure this is included
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
    likedByUserIds: number[];
    matchedUserIds: number[];
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

    likeUser: async (likedProfileId: number, likedByProfileId: number): Promise<{ message: string; isMatch: boolean }> => {
        try {
            const response = await axios.put(`${API_URL}/like`, {
                likedUserId: likedProfileId, // Use profileId here
                likedByUserId: likedByProfileId // Use profileId here
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error liking user:", error.response?.data);
                throw new Error(error.response?.data?.message || "Failed to like user");
            } else {
                console.error("Unexpected error:", error);
                throw new Error("An unexpected error occurred");
            }
        }
    },
};