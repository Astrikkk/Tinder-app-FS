import React from "react";

interface MessageProps {
    messageInfo: {
        userName: string;
        message: string;
    };
}

const CustomMessage: React.FC<MessageProps> = ({ messageInfo }) => {
    return (
        <div className="w-fit">
            <span className="text-sm text-slate-600">{messageInfo.userName}</span>
            <div className="p-2 bg-gray-100 rounded-lg shadow-md">
                {messageInfo.message}
            </div>
        </div>
    );
};

export default CustomMessage;
