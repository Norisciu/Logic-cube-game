import "./TopScoreMenu.css"
import { ReactComponent as Trophy} from  '../../../SVGImages/Trophy.svg';
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tick } from "../highscoresSlice";
import Button from "../../../GameComponents/GameUI/Button/Button";


const ANIMATION_DURATION_TOP_SCORE = 100;

export default function TopScoreMenu({topScore , onClose}){

    const dispatch =  useDispatch();
    const playerTopScore  = useSelector(state => state.highscoresScreen.topScore);

    const animRef  = useRef(true);
    const animStartTimeRef = useRef();


    useEffect(() => {
          
        animStartTimeRef.current = performance.now();
        const animId  = requestAnimationFrame(time => incrementScoreAnim(time , topScore));
        return () => cancelAnimationFrame(animId);
        
    } , [])

    useEffect(() => requestAnimationFrame(time => incrementScoreAnim(time , topScore)) , [playerTopScore])


    const incrementScoreAnim  =  ( time , pointsGoal) => {
        if (!animRef.current) { return }
        const elapse  = time - animStartTimeRef.current;
        const animProgress  = elapse/ANIMATION_DURATION_TOP_SCORE;
        const pointsValue  = Math.min(Math.floor(animProgress  * pointsGoal) , pointsGoal);  

        dispatch(tick({points: pointsValue}));

        if (animProgress >= 1) {
            animRef.current = false;
        }
        
    }

    return (
        <div className="game-menu game-menu--top-score">

            <Trophy className="top-score--trophy" />
            <h2 className="top-score--header">
                New Highscore
            </h2>
            
            <div className="top-score__score">
                {playerTopScore}
            </div>


            <Button
                onClick ={onClose}
                classes = {"top-score__button"}
            >
                Got it!
            </Button>
        </div>
    )
}