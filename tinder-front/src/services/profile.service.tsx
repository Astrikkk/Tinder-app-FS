import axios from 'axios';

const API_URL = process.env.REACT_APP_API + '/Home';

export interface Profile {
    id?: string;
    bio: string;
    imagePath?: string;
}

export const getProfiles = async (): Promise<Profile[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getProfileById = async (id: string): Promise<Profile> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createProfile = async (bio: string, image: File | null): Promise<void> => {
    const formData = new FormData();
    formData.append('Bio', bio);
    if (image) formData.append('Image', image);

    await axios.post(API_URL, formData);
};

export const updateProfile = async (id: string, bio: string, image: File | null): Promise<void> => {
    const formData = new FormData();
    formData.append('Bio', bio);
    if (image) formData.append('Image', image);

    await axios.put(`${API_URL}/${id}`, formData);
};

export const deleteProfile = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
