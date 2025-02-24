export interface ProfileItemDTO {
    id: number;
    name: string;
    imagePath: string;
    gender: {
        id: number;
        name: string;
    };
    lookingFor:  {
        id: number;
        name: string;
    };
    interestedIn:  {
        id: number;
        name: string;
    };
    sexualOrientation:{
        id: number;
        name: string;
    };
    birthDay: Date;
    interests:  {
        id: number;
        name: string;
    }[];
    photos: string[];
    userId: number;
}

export interface ProfileCreateDTO {
    id: number;
    name: string;
    imagePath: string;
    gender: {
        id: number;
        name: string;
    };
    lookingFor: {
        id: number;
        name: string;
    };
    interestedIn: {
        id: number;
        name: string;
    };
    sexualOrientation: {
        id: number;
        name: string;
    };
    birthDay: Date;
    interests:  {
        id: number;
        name: string;
    }[];
    photos: string[];
    userId: number;

}
