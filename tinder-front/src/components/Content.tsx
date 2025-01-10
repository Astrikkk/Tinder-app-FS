import React, { useState, useRef } from 'react';
import useSWR, { mutate } from 'swr';
import Card from './Card';

interface Profile {
    id: string;
    imagePath: string;
    bio: string;
}

const fetcher = async (url: string): Promise<Profile[]> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const Swr: React.FC = () => {
    const { data: cardsData, error, isValidating } = useSWR('https://localhost:7034/api/Home', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [newBio, setNewBio] = useState<string>('');
    const [newImage, setNewImage] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref to reset the file input

    const handleEdit = (profile: Profile) => {
        setEditingProfile(profile);
        setNewBio(profile.bio); // Pre-fill the bio field with the existing bio
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (editingProfile) {
            const formData = new FormData();
            formData.append('bio', newBio);

            if (newImage) {
                formData.append('Image', newImage);
            }

            try {
                const response = await fetch(`https://localhost:7034/api/Home/${editingProfile.id}`, {
                    method: 'PUT',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to update profile');
                }

                mutate('https://localhost:7034/api/Home');
                closeModal();
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`https://localhost:7034/api/Home/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete profile');
            }

            mutate('https://localhost:7034/api/Home'); // Re-fetch data to get the updated list
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
            fileInputRef.current.value = ''; // Reset the file input
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
                            key={card.id}
                            imagePath={card.imagePath}
                            bio={card.bio}
                            onDelete={() => handleDelete(card.id)} // Pass the card's id to delete it
                            onEdit={() => handleEdit(card)}
                        />
                    ))
                ) : (
                    <div className="text-gray-600">No profiles found.</div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl mb-4">Edit Profile</h3>
                        <textarea
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            placeholder="Enter new bio"
                        />
                        <input
                            ref={fileInputRef} // Attach the ref here
                            type="file"
                            onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Swr;
