import { createSlice } from '@reduxjs/toolkit';
import { makeProblem } from '../../Engine/ProblemBuilder/problemBuilder';
import SettingsModule from '../PlayingScreen/PlayingScreenSettings';
import { TUTORIAL_MODES, TUTORIAL_TRIAL_TIME } from './tutorialScreenConstants';
import { 
    checkAllSides, 
    convertGameActionToDirection, 
    evaluateUserAnswerGameAction, 
    isCorrectAnswer, 
    isWrongAnswer, 
    randomAndDifferentCubeFace 
} from '../PlayingScreen/Utils/TrialAPIUpdate';
import { 
    setPointerToNextAction, 
    setPointerToNextTopSequence, 
    setPointerToPrevTopSequence, 
    setNestIdxToStepInCurrentSeq 
} from './NavigationMechanism/navigationMechanism';




// definitions 
// a mutating action in this context is any action that triggiers a component state 
// changie AND a side effect which takes time (like the rotation of a cube)

let initialState = {
    tutorialMode: TUTORIAL_MODES.displayActions,

    pointer: {
        nestingDepth: 1,
        nestActionIdx: [-1],
        currentActionInSequence: () => { },
        topActionSequences: []
    },

    cube: {
        faceOnFront: "front",
        evaluationResult: null,
        sides: {},
        expression: "",
        checkSides: { },
        className: "upwards",
    },

    configChangies: {
        cubeClasses : "upwards"
    },

    displayText: {
        text: "",
        fast : false
    },

    cleaningMechanism: {
        actionsUsdAfterLastClean: [],
        mutatingActionsCount: 0
    }
};


export const TutorialScreenSlice = createSlice({
    name: "TutorialScreenSlice",
    initialState,
    reducers: {

        setToInitialState: (state, action) => {  
            state = initialState;
            return state;
        },

        initActionChains: (state, action) => {
            const { initialActionChains } = action.payload;
            state.pointer.topActionSequences = initialActionChains;
              
        },

        skipText: (state , action) => {
              
            state.displayText.fast = true;
        },

        // rename to launchAction
        nextAction: (state, action) => {
              

            const tutorialMode = state.tutorialMode;
            if (tutorialMode === TUTORIAL_MODES.displayActions
            ) {
                  
                const result = setPointerToNextAction(state);
                state.pointer = result;
            }

            else if (tutorialMode === TUTORIAL_MODES.checkPlayerMode) {
                const result = setPointerToNextAction(state);
                state.pointer = result;
                state.tutorialMode = TUTORIAL_MODES.displayActions;

            }

            else if (tutorialMode === TUTORIAL_MODES.cleanUp) {
                const { mutatingActionsCount } = state.cleaningMechanism;
                state.cleaningMechanism.mutatingActionsCount--;
                if (state.cleaningMechanism.mutatingActionsCount === 0) {
                      
                    state.cleaningMechanism.actionsUsdAfterLastClean = [];
                    state.tutorialMode = TUTORIAL_MODES.displayActions;
                }
            }

            else if (tutorialMode === TUTORIAL_MODES.configComponents){
                  
                state.tutorialMode = nextTutorialMode(state.tutorialMode);
            }

            else {
                throw new Error(`unknown tutorialMode : ${tutorialMode}`);
            }
        },

        nextConfigComponentsAction : (state , action) => {
            const currentActionSeqIdx  = state.pointer.nestActionIdx[0];

            const removeClasses  = (classNames , namesToRemove) => {
                return classNames
                    .split(/\s+/ig)
                    .filter(name => !namesToRemove.includes(name))
                    .join(" ");
            }

            const addClass  =  (name , classes) => `${classes} ${name}`;

            if (currentActionSeqIdx === 3){
                if (state.configChangies.cubeClasses.includes("fall-animation")){
                    state.tutorialMode = nextTutorialMode(state.tutorialMode);
                    return;
                }
                state.configChangies.cubeClasses =   addClass("fall-animation" , state.cube.className);
            }

            else if (currentActionSeqIdx < 3) {
                state.configChangies.cubeClasses = removeClasses(  
                    state.configChangies.cubeClasses , 
                    ["fall-animation"]
                );

                state.configChangies.cubeClasses  = addClass("upwards" , state.configChangies.cubeClasses);
            }

            // this is a replacer for no more configComponents actions
            if (currentActionSeqIdx != 3){
                  
                state.tutorialMode  = nextTutorialMode(state.tutorialMode);
            }

            state.cube.className = state.configChangies.cubeClasses;
            
        },

        setPointerToNextActionSequence: (state, action) => {
            let resultPointer = setPointerToNextTopSequence(state);
            state.pointer = resultPointer;
        },

        setPointerToPrevActionSequence: (state, action) => {
            let resultPointer = setPointerToPrevTopSequence(state);
            state.pointer = resultPointer;
        },

        setMovableText: (state, action) => {
            let { movableText } = action.payload;
            if (typeof movableText === "function") {

                movableText = movableText(state);
            }
            state.displayText.text = movableText;
        },

        // should probably remove all cleaning evaluation data setting in here
        // checkSides , sides and evaluationResult
        makeTrial: (state, action) => {

            const { form, colorsCount, isTimd } = action.payload;
            const problemData = makeProblem(form, colorsCount, 1);
            const faceOnFront = randomAndDifferentCubeFace(state.cube.faceOnFront);
            const trialTimeValue = isTimd ? TUTORIAL_TRIAL_TIME : 0;
              

            state.cube = {
                ...state.cube,
                checkSides: {},
                sides: {},
                evaluationResult: null,
                ...problemData,
                faceOnFront: faceOnFront,
                trialTime: trialTimeValue
            }



        },

        failTrial: (state, action) => {

            const { cube } = state;
            const checkSides = checkAllSides(cube.sides, cube.expression);

            state.cube = {
                ...cube,
                evaluationResult: SettingsModule.WRONG_ANSWER,
                checkSides
            };

        },

        startWaitingForPlayerAnswer: (state, action) => {
              
            state.tutorialMode = TUTORIAL_MODES.checkPlayerMode;
        },

        checkUserAnswer: (state, action) => {
            const { gameAction } = action.payload;
              

            const { cube } = state;
            const checkSides = checkAllSides(cube.sides, cube.expression);

            let direction = convertGameActionToDirection(gameAction);
            let evaluationResult = evaluateUserAnswerGameAction(gameAction, checkSides);

            state.cube = {
                ...cube,
                evaluationResult,
                checkSides
            }
        },

        endCheckPlayer: (state, action) => {
              
            state.tutorialMode = TUTORIAL_MODES.displayActions;
            const { evaluationResult } = state.cube;

            if (isCorrectAnswer(evaluationResult)) {
                  
            }

            else if (isWrongAnswer(evaluationResult)) {
                  

                state.pointer = setNestIdxToStepInCurrentSeq(state, 0);
                state.cube = {
                    ...state.cube,
                    evaluationResult: null,
                    sides: {},
                    expression: "",
                    checkSides: {}
                }
            }

            else {
                throw new Error("uknown evaluation result value");
            }

        },




        
        // rename to performCleanup 
        // the cleanup operation also sets default classes 
        // move to cleanUp module
        setDefaultState: (state, action) => {
              

            // prepare cleanup state for cleaning operations
            const { actionsUsdAfterLastClean } = state.cleaningMechanism;

            // find the number of mutating actions
            const isMutatingAction = (actionName) => {
                const mutatingActionNames = ["makeTrial"];
                return mutatingActionNames.includes(actionName);
            }

            const usdMutatingActions = actionsUsdAfterLastClean.filter(isMutatingAction);
            const uniqueUsdMutatingActions = [...new Set(usdMutatingActions)];
            state.cleaningMechanism.mutatingActionsCount = uniqueUsdMutatingActions.length;

            // set the tutorialMode to cleanUp
            state.tutorialMode = TUTORIAL_MODES.cleanUp;

            // set default states of in-tutorial components
            const currentActionSequenceIdx = state.pointer.nestActionIdx.slice(-2)[0];
            const className =  `${state.configChangies.cubeClasses}`
              

            // set ReusableCube defaults
            state.cube = {
                ...state.cube,
                faceOnFront: "front",
                evaluationResult: null,
                sides: {},
                expression: "",
                checkSides: {},
                className: className,
            };

            // set MovableText defaults
            state.displayText.text = "";
            state.displayText.fast = false;

              
              
              

            // if there are no pending mutating actions end the cleanup session
            // [not available any more] and go to the next action
            if (usdMutatingActions.length === 0) {
                //resolveCleanup(state);
                state.cleaningMechanism.actionsUsdAfterLastClean = [];
                // state.pointer  =  setPointerToNextTopSequence(state);

                // state.tutorialMode = TUTORIAL_MODES.displayActions;
                state.tutorialMode =  nextTutorialMode(state.tutorialMode);
            }

        },

        moveToStepInCurrentSeq: (state, action) => {
              
            const { stepInSequence, conditionFun } = action.payload;
            if (conditionFun(state)) {
                  
                state.pointer = setNestIdxToStepInCurrentSeq(state, stepInSequence);
            }

            else {
                state.pointer = setPointerToNextAction(state);
            }
        },

        // triggiered in midleware for storing tutorial actions and use in
        // the cleaning mechanism
        storeAction: (state, action) => {
            const { actionName } = action.payload;
            const nameWithoutPreif = actionName.split("/")[1];
            const storedActions = state.cleaningMechanism.actionsUsdAfterLastClean
            state.cleaningMechanism.actionsUsdAfterLastClean = [
                ...storedActions, 
                nameWithoutPreif
            ];
        }

    }
});


const nextTutorialMode  = (tutorialMode) => {
    if (tutorialMode === TUTORIAL_MODES.configComponents){
        return TUTORIAL_MODES.displayActions;
    }

    else if (tutorialMode === TUTORIAL_MODES.cleanUp){
        return TUTORIAL_MODES.configComponents;
    }
    

    else {
        throw new Error("unknown current tutorial mode provideod");
    }
}



export const isOnCheckPlayerMode = candidate => candidate === TUTORIAL_MODES.checkPlayerActions;
export const isOnDisplayActionsMode = candidate => candidate === TUTORIAL_MODES.displayActions;
export const {
    nextAction,
    setToInitialState,
    initActionChains,
    setMovableText,
    makeTrial,

    checkUserAnswer,
    endCheckPlayer,
    setDefaultState,
    setPointerToNextActionSequence,
    setPointerToPrevActionSequence,

    startWaitingForPlayerAnswer,
    moveToStepInCurrentSeq,

    nextConfigComponentsAction,
    skipText,

    failTrial,
    storeAction,
} = TutorialScreenSlice.actions;
export default TutorialScreenSlice.reducer;



