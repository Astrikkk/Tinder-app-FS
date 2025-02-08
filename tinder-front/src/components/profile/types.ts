export interface ProfileItemDTO {
    id: number;
    name: string;
    imagePath: string;
    gender: string;
    lookingFor: string;
    interestedIn: string;
    sexualOrientation: string;
    birthDay: Date;
    interests: string[];
    photos: string[];
}

export interface ProfileCreateDTO {
    name: string;
    birthDay: Date;
    genderId: number;
    interestedInId: number;
    lookingForId: number;
    sexualOrientationId: number;
    image?: File | null; // Файл для завантаження фото
    interestIds?: number[]; // Масив ID інтересів
}
