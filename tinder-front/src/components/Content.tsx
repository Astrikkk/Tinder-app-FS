import React from 'react';
import Card from './Card';
import useSWR from 'swr';

interface Profile {
    id: string;
    photoUrl: string;
    bio: string;
}

const fetcher = async (url: string): Promise<Profile[]> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching data:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
        throw error; // Re-throw the error after logging
    }
};

const Swr: React.FC = () => {
    const { data: cardsData, error, isValidating } = useSWR('https://localhost:7034/api/Home/profiles', fetcher);

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
                        <Card key={card.id} photoUrl={card.photoUrl} bio={card.bio} />
                    ))
                ) : (
                    <div className="text-gray-600">No profiles found.</div>
                )}
            </div>
        </main>
    );
};

export default Swr;
