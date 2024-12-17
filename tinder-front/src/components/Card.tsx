import React from 'react';

interface CardProps {
    photoUrl: string; // Change this from 'photo' to 'photoUrl'
    bio: string;
}

const Card: React.FC<CardProps> = ({ photoUrl, bio }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg w-full">
            <img src={`https://localhost:7034/${photoUrl}`} className="w-full h-64 object-cover" alt="Profile" />
            <div className="p-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-semibold">{bio}</span>
                </div>
            </div>
        </div>
    );
};

export default Card;
