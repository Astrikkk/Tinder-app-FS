import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProfile, updateProfile, getProfileById } from '../../services/profile.service';

const CreateEditProfile: React.FC = () => {
    const [bio, setBio] = useState<string>('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [messageText, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const { id } = useParams(); // For fetching/editing existing profile by id
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            getProfileById(id)
                .then((data) => {
                    setBio(data.bio);
                })
                .catch(() => setMessage('Failed to load profile'));
        }
    }, [id]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!photo && !bio) {
            setMessage('Please upload a photo or update the bio.');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            if (isEditMode && id) {
                await updateProfile(id, bio, photo); // Editing existing profile
                setMessage('Profile updated successfully!');
            } else {
                await createProfile(bio, photo); // Creating a new profile
                setMessage('Profile created successfully!');
            }
            navigate('/#'); // Navigate to profile list after success
        } catch (error) {
            setMessage('An error occurred while saving the profile.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto mt-8 p-4">
            <h2 className="text-2xl font-semibold mb-4">{isEditMode ? 'Edit' : 'Create'} Profile</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div>
                    <label className="block text-sm font-medium">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                        placeholder="Enter your bio"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Photo</label>
                    <input
                        type="file"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoto(e.target.files ? e.target.files[0] : null)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white p-2 rounded"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Profile'}
                </button>
            </form>
            {messageText && <div className="mt-4 text-center text-red-600">{messageText}</div>}
        </div>
    );
};

export default CreateEditProfile;
