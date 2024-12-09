import React from 'react';

interface CardProps {
    photoUrl: string;
    bio: string;
}

const Card: React.FC<CardProps> = ({ photoUrl, bio }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg w-full">
            <img src={photoUrl} className="w-full h-64 object-cover" />
            <div className="p-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-semibold">{bio}</span>
                </div>
            </div>
        </div>
    );
};

export default Card;
