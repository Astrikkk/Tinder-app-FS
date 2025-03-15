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
        console.log("Sending like request with IDs:", { likedProfileId, likedByProfileId });
    
        if (!likedProfileId || !likedByProfileId) {
            throw new Error("Both likedProfileId and likedByProfileId are required.");
        }
    
        try {
            const response = await axios.put(`${API_URL}/like`, {
                likedUserId: likedProfileId,
                likedByUserId: likedByProfileId
            });
    
            console.log("Like response:", response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error response:", error.response?.data);
                throw new Error(error.response?.data?.message || `Error: ${error.response?.statusText || "Unknown error"}`);
            } else {
                console.error("Unexpected error:", error);
                throw new Error("An unexpected error occurred while liking the user.");
            }
        }
    },

    reportProfile: async (profileId: number): Promise<void> => {
        await axios.post(`${API_URL}/${profileId}/report`);
    },
    
    getReportedProfiles: async (): Promise<Profile[]> => {
        const response = await axios.get(`${API_URL}/reported`);
        return response.data;
    }
};