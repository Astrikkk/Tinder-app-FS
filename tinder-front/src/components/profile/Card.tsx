import React from 'react';

interface CardProps {
    imagePath?: string;
    name: string;
    birthDay: string;
    gender: string;
    interestedIn: string;
    lookingFor: string;
    sexualOrientation: string;
    interests: string[];
    onDelete: () => void;
    onEdit: () => void;
}

const Card: React.FC<CardProps> = ({
                                       imagePath,
                                       name,
                                       birthDay,
                                       gender,
                                       interestedIn,
                                       lookingFor,
                                       sexualOrientation,
                                       interests,
                                       onDelete,
                                       onEdit
                                   }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm w-full">
            <img
                src={imagePath ? `http://localhost:7034${imagePath}` : '/default-image.jpg'}
                className="w-full h-64 object-cover"
                alt="Profile"
            />
            <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
                <p className="text-gray-600 text-sm mb-2">Born: {birthDay}</p>
                <p className="text-gray-700 text-sm"><strong>Gender:</strong> {gender}</p>
                <p className="text-gray-700 text-sm"><strong>Interested In:</strong> {interestedIn}</p>
                <p className="text-gray-700 text-sm"><strong>Looking For:</strong> {lookingFor}</p>
                <p className="text-gray-700 text-sm"><strong>Sexual Orientation:</strong> {sexualOrientation}</p>
                <div className="mt-3">
                    <p className="text-gray-700 text-sm"><strong>Interests:</strong></p>
                    <ul className="list-disc pl-4 text-gray-600 text-sm">
                        {interests.length > 0 ? (
                            interests.map((interest, index) => <li key={index}>{interest}</li>)
                        ) : (
                            <li>No interests specified</li>
                        )}
                    </ul>
                </div>
                <div className="flex justify-between mt-4">
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
