import { createSlice } from '@reduxjs/toolkit';
import SettingsModule from "./PlayingScreenSettings.js";
import {
    getLvel , 
    getRandomDataForLvel 
} from "../../GameLvels/LvelHandler"
import { 
    checkAllSides, 
    computeDifficulty, 
    evaluateUserAnswerGameAction,
    randomAndDifferentCubeFace , 
    newProblem,
    
} from './Utils/TrialAPIUpdate';




let initialState  =  {
    currentTrial : {
        cubeFace : "front",
        instruction : "",
        counter : SettingsModule.TRIAL_TIME , 
        sides : {
            "top" : null,
            "right" : null,
            "bottom" : null,
            "left" : null,
        } , 
        trialState : null,
        checkSides : {
            "top" : null,
            "right" : null,
            "bottom" : null,
            "left" : null,
        },
        userAnswerEvaluation : null,
        userScore : 0,
        difficulty: ""
    },

    matches : 0 ,
    mistakes : 0,
    currentLvel : 1,

    gameCounter : {
        isActive:true
    },

    isOnPause : false,
    isLastTrial : false,
}


export const PlayingScreenSlice  =  createSlice({
    name : "PlayingScreen",
    initialState,
    reducers : {

    
        newTrial : (state , action) => {
              

            // if anterior trial was the last trial set default trial data and return
            if (state.isLastTrial){
                  
                state.gameCounter.isActive = true;
                state.currentTrial.cubeFace = "front";
                state.currentTrial.instruction  = "";
                state.currentTrial.trialState = SettingsModule.TRIAL_STATE_SESSION_END;
                state.isLastTrial  = false;
                return;    
            }
            
            const {cubeFace  , userScore} =  state.currentTrial;
            const {mistakes , matches , currentLvel} = state;
            
            // giet data of levl
            const lvel  = getLvel(userScore , currentLvel,  matches , mistakes);
            const randomDataForLvel  = getRandomDataForLvel(lvel);
            
            // make problem using lvel data
            const {sides , expression }  = newProblem(randomDataForLvel);

            // mutate playing screen state with the new problem data
            state.currentTrial.trialState =  SettingsModule.TRIAL_STATE_ROTATING;
            state.currentTrial.cubeFace  = randomAndDifferentCubeFace(cubeFace);

            state.currentTrial.instruction =  expression;
            state.currentTrial.sides  = sides;
              

              
              

            state.currentTrial.userAnswerEvaluation =  null;
            state.currentTrial.difficulty  =  computeDifficulty(state.currentTrial.userScore);
            state.currentLvel  =  lvel;

        
        },

        startWaitingForPlayer : (state , action) => {
              
            state.currentTrial.trialState  =  SettingsModule.TRIAL_STATE_WAITING_PLAYER;
        },


        displayAnswerResult : (state , action) => {
              

            let {gameAction} = action.payload;
              
            
            let {sides , instruction } = state.currentTrial;

            
            state.currentTrial.checkSides  = checkAllSides(sides, instruction);
              
            
              
            let evaluationResult = evaluateUserAnswerGameAction(gameAction , state.currentTrial.checkSides);
            
              
            if (evaluationResult === SettingsModule.CORRECT_ANSWER){
                state.currentTrial.userScore += 100;
                state.matches++;
                state.mistakes   = 0;
            }

            else {
                state.mistakes++;
                state.matches  = 0;
            }
            
            state.currentTrial.userAnswerEvaluation   = evaluationResult;
            state.currentTrial.trialState = SettingsModule.TRIAL_STATE_SHOWING_ANSWER;
        },

        sessionEnd  : (state , action) => {
              
            state.gameCounter.isActive  = false;
            state.isLastTrial  = true;
        },

        setDefaultValues : (state , action) => {
            state.gameCounter.isActive = true;
            state.currentTrial.cubeFace = "front";
            state.currentTrial.instruction  = "";
            state.currentTrial.trialState = null;
            state.currentTrial.userScore = 0;
            state.currentTrial.userAnswerEvaluation =  null;

            state.isLastTrial = false;
            
            state.currentTrial.checkSides = {
                "top" : null,
                "right" : null,
                "bottom" : null,
                "left" : null,
            };
            state.currentTrial.sides =  {
                "top" : null,
                "right" : null,
                "bottom" : null,
                "left" : null,
            };
            state.currentLvel = 1;
            state.isOnPause  = false;
        },

       

        togglePause : (state , action) => {
              
            
            state.isOnPause  = ! state.isOnPause;
        }
    }

});


export const { newTrial , startWaitingForPlayer , displayAnswerResult , sessionEnd , setDefaultValues , togglePause } = PlayingScreenSlice.actions;
export default PlayingScreenSlice.reducer;

