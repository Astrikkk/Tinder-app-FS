import React from 'react';

interface CardProps {
    imagePath: string;
    bio: string;
    onDelete: () => void;
    onEdit: () => void;
}

const Card: React.FC<CardProps> = ({ imagePath, bio, onDelete, onEdit }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg w-full">
            <img
                src={`https://localhost:7034${imagePath}`}
                className="w-full h-64 object-cover"
                alt="Profile"
            />
            <div className="p-6">
                <p className="text-gray-800 font-semibold mb-4">{bio}</p>
                <div className="flex justify-between">
                    <button
                        onClick={onEdit}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Edit
                    </button>
                    <button
                        onClick={onDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
