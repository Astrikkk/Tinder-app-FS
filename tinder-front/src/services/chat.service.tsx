import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API}/Chat`;
export interface MessageInfo{
    id:number;
    content: string;
    sender:{
        id:number;
        userName: string;
    };
    readed:boolean;
    createdAt:Date;
}


export interface ChatRoomInfo {
    chatRoom:string;
    creator:{
        id:number;
        userName:string;
    };
    participant:{
        id:number;
        userName:string;
    };
    messages:MessageInfo[];
}

export const ChatService = {
    getChatInfoByKey: async (key: string): Promise<ChatRoomInfo> => {
        const response = await axios.get(`${API_URL}/${key}`);
        return response.data;
    },

}
