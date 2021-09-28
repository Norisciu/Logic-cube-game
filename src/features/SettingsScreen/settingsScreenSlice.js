import { createSlice } from '@reduxjs/toolkit';
import { GameActions } from "../../Keyboard/GameActions";

let initialState = {
    keyboardBindings : {
        [GameActions.TOP_PRESS_ACTION] :  "ArrowUp",
        [GameActions.BOTTOM_PRESS_ACTION] : "ArrowDown",
        [GameActions.RIGHT_PRESS_ACTION] : "ArrowRight",
        [GameActions.LEFT_PRESS_ACTION] :  "ArrowLeft",
        [GameActions.NOTHING_PRESS_ACTION] : "KeyA",
        [GameActions.PAUSE_ACTION] : "Space",
    }
   
}


export const SettingsScreenSlice  =  createSlice({
    name : "SettingsScreen",
    initialState,
    reducers : {
        setKeyboardBinding : (state , action) => {
              
              
            const { gameAction , key } = action.payload;
            state.keyboardBindings[gameAction] = key;
        },

        setAllKeyboardBindings : (state , action) => {
              
              
            const { formState } = action.payload;
            state.keyboardBindings = formState;
        }

    }
});


export const { setKeyboardBinding , setAllKeyboardBindings} = SettingsScreenSlice.actions;
export default SettingsScreenSlice.reducer;

