    import axios from 'axios';

    // URL до API
    const API_URL = `${process.env.REACT_APP_API}/Home`;

    interface Profile {
        id?: string;
        name: string;
        birthDay: string;
        gender: string;
        interestedIn: string;
        lookingFor: string;
        sexualOrientation: string;
        interests: string[]; // Використовуйте interests замість interestIds
        imagePath?: string;
        photos?: string[];
    }

    // Функція для отримання всіх профілів
    export const getProfiles = async (): Promise<Profile[]> => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching profiles:', error);
            throw error;
        }
    };

    // Функція для отримання профілю за ID
    export const getProfileById = async (id: string): Promise<Profile> => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching profile with ID ${id}:`, error);
            throw error;
        }
    };

    // Функція для створення нового профілю
    export const createProfile = async (formData: FormData): Promise<void> => {
        try {
            await axios.post(API_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch (error) {
            console.error('Error creating profile:', error);
            throw error;
        }
    };

    // Функція для оновлення існуючого профілю
    export const updateProfile = async (id: string, formData: FormData): Promise<void> => {
        try {
            await axios.put(`${API_URL}/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch (error) {
            console.error(`Error updating profile with ID ${id}:`, error);
            throw error;
        }
    };

    // Функція для видалення профілю
    export const deleteProfile = async (id: string): Promise<void> => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            console.error(`Error deleting profile with ID ${id}:`, error);
            throw error;
        }
    };

    // Функція для отримання списку інтересів
    export const getInterests = async (): Promise<{ id: number; name: string }[]> => {
        try {
            const response = await axios.get(`${API_URL}/interests`);
            return response.data;
        } catch (error) {
            console.error('Error fetching interests:', error);
            throw error;
        }
    };

    // Функція для отримання списку "Interested In"
    export const getInterestedIn = async (): Promise<{ id: number; name: string }[]> => {
        try {
            const response = await axios.get(`${API_URL}/interested-in`);
            return response.data;
        } catch (error) {
            console.error('Error fetching interested in options:', error);
            throw error;
        }
    };

    // Функція для отримання списку "Looking For"
    export const getLookingFor = async (): Promise<{ id: number; name: string }[]> => {
        try {
            const response = await axios.get(`${API_URL}/looking-for`);
            return response.data;
        } catch (error) {
            console.error('Error fetching looking for options:', error);
            throw error;
        }
    };

    // Функція для отримання списку сексуальних орієнтацій
    export const getSexualOrientation = async (): Promise<{ id: number; name: string }[]> => {
        try {
            const response = await axios.get(`${API_URL}/sexual-orientation`);
            return response.data;
        } catch (error) {
            console.error('Error fetching sexual orientation options:', error);
            throw error;
        }
    };
