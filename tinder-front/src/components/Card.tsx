import React from 'react';

interface CardProps {
    imagePath: string;
    bio: string;
}

const Card: React.FC<CardProps> = ({ imagePath, bio }) => {


    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg w-full">
            <img
                src={`https://localhost:7034${imagePath}`}
                className="w-full h-64 object-cover"
                alt="Profile"
            />

            <div className="p-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-semibold">{bio}</span>
                </div>
            </div>
        </div>
    );
};

export default Card;
