import React from "react";
import Kitty from "../../img/Kitty.svg";
import "../../ProfileViewer.css";

const Matches: React.FC = () => {
    return (
        <div className="Chat-Match no-chats">
            <h2 className="match-info-h2">It's a Match!</h2>
            <p className="match-info-p">
                See who likes you back! When you and another user mutually like each other, you'll become a match and appear in this section. Start chatting and see where it goes!
            </p>
            <img src={Kitty} alt="Kitty" className="kitty-image" />
        </div>
    );
};

export default Matches;