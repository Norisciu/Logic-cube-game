import React, { useEffect ,  useRef } from "react";
import "../highscoresStyle.css";

export function HighscoreEntry ({rank , userName , score , selection }) {
    console.log("HighscoreEntry draw()");
    let selectionRef =  useRef();
      

    useEffect(() => {
          
          
          
        if (!selectionRef.current) { return; } 
          
        let timeout = setTimeout(() => selectionRef.current.classList.add("is-active"), 1000  );
        return  () => clearTimeout(timeout);
    } , [selectionRef])                 
    return (
        <>
            <span className={"highscore-entry highscore-entry--rank"}> {rank} </span>
            <span className={"highscore-entry highscore-entry--user"}>{userName}</span> 
            <span className={"highscore-entry highscore-entry--score"}>{score} points</span>
            {selection && <div ref={selectionRef} className="highscore-selection"/> }
        </>
    )
}   