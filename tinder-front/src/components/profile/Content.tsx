import React, { useState, useRef } from 'react';
import useSWR, { mutate } from 'swr';
import { getProfiles, deleteProfile, updateProfile, Profile } from '../../services/profile.service';
import Card from './Card';

const Swr: React.FC = () => {
    const { data: cardsData, error, isValidating } = useSWR('profiles', getProfiles);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [newBio, setNewBio] = useState<string>('');
    const [newImage, setNewImage] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleEdit = (profile: Profile) => {
        setEditingProfile(profile);
        setNewBio(profile.bio);
        setNewImage(null); // Reset the new image if it's being edited
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (editingProfile && editingProfile.id) {
            try {
                await updateProfile(editingProfile.id, newBio, newImage);
                mutate('profiles'); // Refresh profiles after update
                closeModal();
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProfile(id);
            mutate('profiles'); // Refresh profiles after delete
        } catch (error) {
            console.error('Error deleting profile:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProfile(null);
        setNewBio('');
        setNewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (isValidating) return <div className="loading text-blue-600">Loading profiles...</div>;

    if (error) {
        return <div className="text-red-600">Error loading profiles. Please try again.</div>;
    }

    return (
        <main className="container mx-auto mt-8 p-4">
            <h2 className="text-2xl font-semibold mb-4 text-center">Welcome to My App</h2>
            <div className="flex flex-col justify-center items-center bg-gray-100 min-h-screen space-y-4">
                {cardsData && cardsData.length > 0 ? (
                    cardsData.map((card) => (
                        <Card
                            key={card.id ?? ''}
                            imagePath={card.imagePath ?? '/default-image.jpg'}
                            bio={card.bio}
                            onDelete={() => card.id && handleDelete(card.id)}
                            onEdit={() => card && handleEdit(card)} // Trigger modal on edit
                        />
                    ))
                ) : (
                    <div className="text-gray-600">No profiles found.</div>
                )}
            </div>

            {/* Modal for editing profile */}
            {isModalOpen && editingProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
                        <div>
                            <label className="block text-sm font-medium">Bio</label>
                            <textarea
                                value={newBio}
                                onChange={(e) => setNewBio(e.target.value)}
                                placeholder="Enter your bio"
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Photo</label>
                            <input
                                type="file"
                                onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button onClick={closeModal} className="bg-gray-500 text-white p-2 rounded">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white p-2 rounded"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Swr;
