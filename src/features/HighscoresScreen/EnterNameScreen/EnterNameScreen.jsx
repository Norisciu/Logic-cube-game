import React, { useState } from "react";
import "./EnterNameScreen.css";
import Button from "../../../GameComponents/GameUI/Button/Button";

export default function EnterNameScreen({onNameEnterCallback}) {

    const [playerName , setPlayerName ] = useState("");

    const setName  =  (event) => setPlayerName(event.target.value); 
    const onPlayerNameSubmit =   () => onNameEnterCallback(playerName);

    return (
        <div className="game-screen game-screen--enter-name" >
            <h2 className="header--enter-name-screen">
                Please enter your name
            </h2>
            <div className="row row--enter-name">
                <label htmlFor="userName">User Name</label>
                <input 
                    type="text" 
                    name="userName"
                    value={playerName} 
                    onChange={setName}
                />
            </div>
            <Button
                classes={"button--menu-button"} 
                onClick={onPlayerNameSubmit} 
            >
                Ok
            </Button>
            

        </div>
    )
}


EnterNameScreen.defaultProps  = {
    onNameEnterCallback : f => f
}