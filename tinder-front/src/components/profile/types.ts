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
    userid: number;
}

export interface ProfileCreateDTO {
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
    userid: number;

}
