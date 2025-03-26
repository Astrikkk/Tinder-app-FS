export interface ProfileItemDTO {
    id: number;
    name: string;
    imagePath: string;
    gender: {
        id: number;
        name: string;
    };
    jobPosition?:{
        id: number;
        name: string;
    }
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
    interests: {
        id: number;
        name: string;
    }[];
    photos: string[];
    userId: number;
    likedByUserIds: number[]; 
    matchedUserIds: number[];
    location?:{
        id: number;
        name: string;
    } ;
    minAge?: number;
    maxAge?: number;
    showMe?: boolean;
    isOnline: boolean;
    profileDescription?: string;
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
