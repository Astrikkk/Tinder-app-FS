import React, { useState, ChangeEvent, FormEvent } from 'react';

const CreateProfile: React.FC = () => {
    const [bio, setBio] = useState<string>('');
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        setIsLoading(true);
        setMessage('');

        const profileData = { Bio: bio, PhotoUrl: photoUrl };

        try {
            const response = await fetch('https://localhost:7034/api/Home', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                throw new Error('Failed to create profile');
            }

            const data = await response.json();
            setMessage(data.message);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto mt-8 p-4">
            <h2 className="text-2xl font-semibold mb-4">Create a New Profile</h2>
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
                    <label className="block text-sm font-medium">Photo URL</label>
                    <input
                        type="url"
                        value={photoUrl}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPhotoUrl(e.target.value)}
                        placeholder="Enter your photo URL"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white p-2 rounded"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Profile'}
                </button>
            </form>

            {message && <div className="mt-4 text-center">{message}</div>}
        </div>
    );
};

export default CreateProfile;
