### Tutorial Screen

## Problem context and relevance

## Concept and descripton

I conceived the tutorial screen as a user/automatic enbld navigation stepper where each step is composed of "actions" that mutate/change the components found in the tutorial screen in some way in the form of "commands" given to the involved components.

For example , one such action would be displaying some explanatory text and the mutated component would be a "TextBox" component which would display that text in effect emulating a behaveour where the "TextBox" receives a command to display some text. Or another action would make the "Cube" component spin or any other action which , in short , inflicts some change to the in-tutorial components. Of course , from a conceptual standpoint , some of these commands/actions affect a component over some span of time rather than immediately (for example animating of typing text takes doesn't happen immediately but over some time while changing the color of the text happens "instaneously") and , because of this we will conceive an action to also have an end.

Also it's important to state from the very beggining that an "action" can be not only 1 action but an entire sequence/unit of them. For example a unit of actions would be displaying some text following by displaying a problem on the cube. This should be treated as only one action instead of many despite it being composed and not atmic.

The navigation inside our stepper should be done in the following way :

1. automatic navigation - which would be done between the actions of each "step"/sequence-of-actions such that for , say , sequence of actions [action1 , action2] after action1 ends at some delay action2 starts automaticlly.
2. interactive/user-assisted navigation - which would be done at the end of, or while some step action is still running by the click of a button or something similar. Because this is intended to be an interactive tutorial the interactive navigation should also be done both directions (back and forward) such that for say [action1 , action2] we can go from action1 to action2 and also from action2 to action 1 at the end or while an action is running.

It's also important to state that the system found in the tutorial screen should have the capability of making persistent changies to the component which "live" throught many steps of the tutorial and also only "step" lifetime changies which would last only untill the current step ends at which point all changies made to the components affectd restore to a default state.

Hence the tutorial , taken abstractly , would consist of a number of tutorial steps where each step would trigger 1 or more actions that affect the components found in the tutorial screen.

## Requirements

The requirments of such a system may be susmarizd as follows :

1. Store all actions to be used in the tutorial such that the system has a persistent way of triggiering the right actions.
2. Enable user "previous" and "next" navigation throught the tutorial actions.
3. Make it possible for the user to navigate throught the tutorial steps while still some step is currently being displayed.
4. The system should enable the capability of triggiering an action after another without requiring any user intervention.
5. The system should also enable a capability of triggering an action after user interaction.
6. Enable a capability to set a time delay between actions which may also have a value of "no delay".
7. Make the components respond to the actions as if they were given "commands" .
8. After all actions of a sequence of actions have completed get to a state where all components are "clean" as if they weren't affectd by the previous step of actions.
9. The system should provide a means for making certain changies to a component last/persist for more than 1 step.

## Possible system design

Writing a system that meets these requirements can be done , most likely, in many ways with many possible sets of mechanisms/modules and the way I conceivd it , without having any guarantee that this is the right approach , is that of reducing it at 4 main mechanisms :

1. a mechanism which enables actions to mutate the in-tutorial components
2. an action stepper mechanism with automatic and user controled navigation
3. a cleaning operation that restores the "state" of the components which have been "mutated" by the actions of a step.
4. a mechanism for making persistent changies to the in-tutorial components that last for more than 1 step.

## Implementation of the 4 mechanisms

### Implementation overview

Note : this is just an overview meant to make someone who reads this understand the system's working only in some detail but not at the highest possible granular. A longer explanation of all design decisions made and their inerent problems would make a far longer documentation (though , I admit it , (if done rightly) would also be an interesting and instructive study on the pitafalls and capabilities of React and the way it's model influences and restrains architectural decisions).

Warning : Currently the implementation assumes that the tutorial slice stores functions (which are non-serialzble and therefore against the recommendod practice found in the official documentation of not storing non-serialzble values in reducer state). Nonetheless , the system works fine on the moment by storing them like that and simplifies implementation. If at some later point, this should result in a true issue I will try finding a more reliable implementation.

The 4 mechanisms provded work in conjuinction to meet the requirements of the system. The mutating/command mechanism provides a well defind set of actions wrapped in thunks/lazy functions (things of the form : () => func()) such that they enable the need delayd evaluation. The navigation mechanism provides a way of stepping over actions , keeping track of them and possibly triggiering them. The cleaning mechanism obviously restores components state at the end or beginning of a new action or unit of actions. And finlly the "persistent mutations" mechanisms can make in-tutorial components have state which is not changied when a top action completes.

The way they work together is the following. The main object/module of the system is the stepper which is conceivd as a an nested array of lazy functions with an associated index which keeps track of the index of the current action and other relevant things in the following form :

    stepper : {
        actions : [[() => action1] [[() => action2]] [() => action3 () => action4]]
        currentActionIdx : ...
        currentAction : () => ...
    }

It is assumed that all the elements at the lowest depth (the direct children of the `stepper` array) are arrays which represent sequences of actions and , for flexibility purposes , that the arrays can be infinitely nested inside one another such that it is possible to express the idea of a "unit of actions".

The "actions" belong to a well defind set of actions and should follow a few simple rules :

1. The actions should make a dispatch call to the reducer.
2. They should mutate some component in the tutorial screen
3. If the effect of the mutation has a visible and time consuming effect (like making the cube rotate as opposd to simply changing it's color which would happen "instantenously") the effect of the action should triggier an "onActionEnd" event to let the system know when the action ended.
4. The actions themselves shouldn't contain any logic which involves the tutorial screen state. This is due to closures which can capture stale state at the moment of definition.

Therefore the form of an action would mostly look like this :

    const action  = () => dispatch(correspondingDispatchForAction)

And , sometimes the actions inside the stepper may also be simple dispatch calls instead of calls to an action wrapper. For possible benfits of abstraction though I let some actions wrap dispatch calls instead.

Whenever the stepper's pointer moves to an action there is an `useEffect` inside the `TutorialScreen` component which listens for the changie in the pointer state and triggiers the action at the pointer location :

    useEffect(() => pointer.currentAction(), [tutorialState.pointer])

As a result , the current action will triggier and a corresponding dispatch to the tutorial reducer will start. The reducer action will changie some state and in turn will affect some tutorial components. When it's effects will end an "onActionEnd()" action will be triggierd letting the system interpret it appropriately either by executing the next action if there are any left or stoping and waiting for a user to start a new sequence of actions. All this flow of control is sumarizd in the following scheme:

    1. currentAction() -> dispatch(someAction)
    2. tutorialScreen.reducer.someAction ->  changies state.cube
    3. \<Cube someProp={state.cube.someField}  onAnimationEnd={onActionEnd} />
    4. onActionEnd() -> tutorialScreen.reducer.interpretActionEndEvent()

At the start of each new top action sequence there will be done some preparatory work :

1. cleaning operations -> restores component to default state
2. config operations -> sets components state basd on some conditions (such as the index of the current action)

Because both of these may imply "actions"/commands which always triggier an `onActionEnd` event is important that the system interprets the `onActionEnd` event appropriately depending on which mechanism is currently running. For example, we wouldn't want an action's end event in the cleaning operation phase to be interpretd as an action in the running tutorial step phase but we'd want all these actions to be kept separate and in isolation.

For this the tutorial screen is provided with a "mode" state which tells on which phase it's currently in and a corresponding `useEffect()`s in the tutorialScreen which run conditionlly basd on the value of the tutorial's mode/phase.

### Implementing the "action" abstraction

As it was previously said , in the tutorial it should be possible to act upon the in-tutorial components idea in which there is implicit that there is an action and hence the system requires an "acting upon components" mechanism. In beaing consistent with a domain driven design approach therefore it's maybe a good idea to implement this mechanism of "acting upon components" by implementing the concept of an "action". In the concept of an "action" as seen in the context of our stepper design it is found not only the idea that there is a way to mutate components state but also the idea that actions are run sequentilly or that "after this action start this other action". Therefore for the purposes of the system a mechanism/model for mutating components and a mechanism for running actions syncronously should be provideod.

### Definitions

(Tutorial) Action -> an action which
Action chain -> a sequence of actions which shall run one after another
Command -> a mutable action which triggiers 'time consuming' side effects

### Motivation

Our linguistic model of how a stepper works includes the idea of "actions" but also expresses the idea of a "unit of actions". Inside a "unit of actions" , a number of actions belong together in the sense they are logiclly connectd in some way and fulfill a greater purpose. For example , we might want have an action which expresses the idea of `check player` which is better expressd by composing small actions already available than by creating a new action.

The stepper should be capable of grouping certain actions in sequence of actions and fire them automaticlly such that when one action ends the next one in the sequence starts automaticlly without user intervention. Also , for reasons of keeping the code flexible , it should be possible to nest an action seqeuence in another with an arbitrary nest depth.

The model of actions I came up with considers each tutorial action a well defined atomc which together form an alphabet (if you wish to name it so) whose "letters" can be further composd via a composability operation to make more complicatd actions. The "compose" operation that is being usd is that of storing actions in one sequence of actions that should run one after the other (with a possible delay between them).

The concept of actions acting upon components not only contains the idea of simple actions but also of sequences of actions which should run as if they make one unt. Because the action model is atmic it should be possible to compose the initial actions into arbitrarly nestd chains of actions

The implementation model I came up with is to set an unfortunately intricate stepper over sequence of functions that triggier one after the other and overall , I'm not entirely happy with the design I came up with since it's not the simple mechanism I would have likd it to be. There are a number of reasons for the complication of the seemingly simple system of actions iteration.

Part of the complication of the stepper consists in the fact that the navigation system requires acting in different ways basd on the stepper state. I solvd this issue by abstarcting the navigation in a "nextStep" function which , for clarity and better composability , deffers it's logic to other functions basd on the stepper state.

A second reason for the complication of the system has to do with the requirement of having a "cleaning mechanism" which restores the different in-tutorial components to a default state. The reason this complicates the system implementation is that the system needs to know when all components have been set to their default state which might involve an unknown arbitrary number of actions. For example , supposing the cleaning mechanism has to place the Cube component in it's default state (among others with {face : front}) the cleaning mechanism can triggier 1 or 0 actions depending on the condition of the face already beang on front which condition might be true or not if the face has been previously changd by an action.

One way of solving this , and the approach I took , was to store data about which animation-triggiering actions have been calld untill the cleaning mechanism should start. Knowing this , the cleaning mechanism can safely set only the default props that have been changd on each component.

For example , for the current in-tutorial components (the TextBox and the Cube components) the default state would be the TexBox having an empty string as text and the Cube displaying it's front face without any logic expression on it. This is a reason for complciation because changing the state of a component in React is coupld to changing it's behaveour. That is , if some piece o state is associatd with some sort of behaveour (like changing the face of the cube implying rotating the cube) whenever the piece of state changies it should be expectd that the behaveour also happens. This means that if a component is set to a default state which triggier an animation

A second issue of the overall system is that it involves a conceptual model (that of telling components what to do via commands) which is somewhat at odds with the principal way React works. If we'd be outside the computational model of React this would be done using method calls on objects but because in React we don't tell a component what to do and instead changie props and let the component decide it's own behaveour basd on props we are limtd to the "interface" of a prop mutating mechanism (changie state that is usd inside a component's props).

Considering the system design I set upwards as immutable the next step is to see how such a system might be implementd. For documenting this , I found appropriate to put the documentation of the 4 mechanisms in their own section and show the implementation problems , choices and reasons for each of them.

The documentation of each mechanism includes an overview main explanation which shows relevant implementation details on how the mechanism was thought and subsections for each of the subproblems I thought require attention.

## Mutating actions mechanism

### The main "mutation mechanism"

The mutation mechanism is necessary because we want the tutorial to triggier changes to it's child components idea which considers as implicit that there is some way of triggiering an action and make components reply to it with some changie of state. For example if I have the idea that there should be some action to display text it's implicit there is a mechanism by which such state changie is being triggierd.

This problem is concernd with enabling a way of emulating components receiving "commands" which tell them what to do. While in React we don't tell components what to do as it's usully done (with method calls on objects) and while this is not a suitable way of thinking at how React's computation model works , this can be still achievied easily by changing state usd as props or inside the inner logic of a component.

For example , if I'd like to give a \<TextBox displaydText={explanation}> component the command to display some text that can be emulatd by changing the `displayedText` prop of the TextBox using a function , say ,`displayText(...)` which changies the value of `explanation` inside the state.

Therefore our "command" mechanism is implementd with functions that changie state and in turn props on the components on which these functions act.

Possible issue :

### Actions overview

The system currently uses actions in 3 ways : as simple standalone actions , as actions in a chain of actions and as a special "checkPlayer" action

### Implementing sequential actions

Because sequential actions are relevant in our stepper model we'll require for an action not only to act on components but to enable a way of letting the system know when the action "completes". What is meant by the last phrase is that if I want for my stepper to represent the sequence of actions "display this text and then rotate the cube 90 degrees" it's implicit there should be a way of implementing the idea of "an action happening after another" such that , when the "display text" action ends the "rotate cube" action starts.

One way of doing this is using promises with an "animationEnd" handler but this assumes all our components are going to animate using CSS animations which isn't necesarilly true becuase the typing text animation for example is hardcode instead of relying on CSS animations.

Therefore the current system has a built in mechanism

### Implementing actions

Implementing the mutation mechanism asks for a concern regarding how to represent the fact of .. well , acting on a component.

Each "action" of the tutorial can be conceivd as a side-effecting function who's effect loads in an async way and triggiers an "actionComplete" function when it finishes. Also , the actions as functions are going to be usd as lazy evaluatd functions. Because of this and because of closures it's safe for an action only contain in it's body the call to `dispatch` a reducer function with some arguments. This is because , if a function representing an action would contain some state those state values usd inside the body would be the ones at the moment of creation instead of the actual state values. Therefore an action is sumarizd by the following 2 rules :

1. If an action changies/mutates some component such that that changie takes some amount of time (like an animation) it should triggier by the use of their side effects an `actionComplete()` event.

2. They should be a little more than wrappers around a dispatch to the TutorialScreen slice.

### Implementing delay between actions

This is done using a decorator that takes a function and a delay value and uses that inside a `setTimeout(delay , () => func)` function. The decorator is going to be useod inside each function which represents an action.

As an example :

    const actionChains  =  [ [ displayText(200)(...) ] , ....];

    const delay  = (func) => delay => (...funcArgs) => setTimeout(() => func(...funcArgs , delay);
    const displayText  =  delay(function() {//code for displaying text})

### Abstracting action sequences

Sometimes we may encounter the case where the same sequence of actions happens repeatedly. For clarity and being consistent with domain driven design it's best to abstract such a repeating sequence of actions into it's own form. This will be done using a function who'se evaluation will expand to a simple sequence of actions.

For example suppose we have the following actions array :

    [
        [() => displayText() , showProblem()],
        [() => displayText() , showProblem()],
        ...
    ]

In this case we could abstract the repeating sequence to some function say `displayProblemWithText( ... )` which will expand to the chain

        [() => displayText( ... ) , showProblem( ... )],

Of course we'll provide the proper arguments to each such function.

## Navigation mechanism (actual stepper implementation)

### Main stepper implementation

The idea of a sequence of "actions that mutate components" naturlly implies using an array of side-effecting "lazy" functions that change component props. Something of the form :

    [() => displayText(...) , () => displayProblemOnCube(...)]

Associating this array with some state for the pointer values , a next and previous functionalty that changies the value of these pointer and a mechanism for triggiering these actions as well as defining some possible actions to triggier completes the implementation of the stepper in React. Because the array is a nestd structure which stores action sequences instead of plain actions it's important to note that the "pointer state" should be composd from 2 pointers one for the action chain and one for the action idx inside the chain.

    // stepper state
    const actions  = [() => displayText(...) , ... ];
    const pointer =  useState({actionChainIdx : 0 , currentActionIdx : 0});

    // triggiering of the current action once it's set
    useEffect(() => actions[currentStep]() , [currentStep]);

    // the functions which enable navigation
    const nextStep  = () => dispatch(setCurrentStep(...));
    const prevStep  = () => dispatch(setCurrentStep( ... ));

    // the actions usd inside the tutorial
    const displayText   = ( ... ) => dispatch( ... )
    const customMutatingAction =  () => dispatch(...)
    const otherCustomMutatingAction =  () => dispatch(...)

In the code above we are using useState for setting the state. However , because the data which is being usd in the tutorial is going to contain more fields than the `currentStep` , because they are all relatd and because the "setState" function works asynchronously while `dispatch` doesn't we'll use a reducer to model the stepper. To be consistent with the overall design of the game so far we'll use Redux instead of the built in `useReduce` hook.

#### User basd navigation

<!-- mike -->

Enabling user navigation is also easy. It's only concernd with establishing a 'nextStep' and a 'prevStep' function that would mutate the 'currentStep' and placing these functions as event handlers of 2 buttons.

#### Adoing automatic navigation

The implementation of automatic navigationm can be split into 2 parts : a mechanism for letting the system know when the effects of an action have completd and a proper way for the system to respond to such an event.

### ActionComplete mechanism implementation

The way automatic navigation is implementd is by trying to emulate an "actionComplete" event at the end of each action. This is done by using callbacks on the components in cause. For example we can have something like this

    <Cube onAnimationEnd={() => onActionComplete()}>

Possible issue : implementing an actionComplete() event requires that each component , which should be mutatd by an action , has an "onActionCompleteCallback" function or maybe more. Since the component itself may not trully require such a callback to do it's job placing this to the component seems to only be done for the purposes of an exterior component rather than itself therefore having such an action and placing it in each component seems forcd and unnecesary. Also there doesn't seem to be any mechanism in React to allow separating this logic in a HOC.

As a side note , a possible solution here would imply using JS promises and an "onAnimationEnd()" event handler but this assumes all our side effects on components which take time are CSS animations assumption which is not necesarilly true. If the assumption were true we could have usd an HOC which would wrap the animation end logic without changing the code inside any of our components implie in the animation.

### Navigating between and within actions

The system has the requirement to navigate in different ways depending on action types and behave differently basd on the context the state of the system is in (is it at the last action in the current chain of actions or not).

As it was previously said , since our main structure is a chain of actions instead of a plain action we require different navigation handling depending on wether we are going from an action to another action in the same chain of actions or wether the system transitions between a chain of actions to another chain of actions.

Because of the complicatd navigation logic it is going to be abstarctd to a function , say `nextAction` which is going to have a different semantics of what "next" means basd on the state and actions. For the sake of implementation clarity the function is going to deffer it's logic to other functions which handle each separate case. A basic form of the implementation would look like this:

    function  nextAction(state) {
        const {chainIdx , actionIdx}  =  state.pointer;
        if (noMoreChainActions()){
            handleAllActionChainsCompletd();
        }

        else if (noMoreActionsInChain()){
            nextActionChain();
        }

        else if () {
            nextActionInChain();
        }

        else {
            throw new Error( ... );
        }
    }

### Conditional navigation

Another problem I had to solve was that, for some actions the system should navigate to different actions in the chain depending on some condition. For example for the sequence of actions :

    [
        displayText(),
        displayProblem(),
        checkPlayer(),
        displayResult(),
        completeOrStartAgain()
    ]

the `completeOrStartAgain()` action should either end the sequence of actions or go back at the `displayText()` action depending on wether or not the player solvd the problem correctly.

To enable such a use case I decidod to abstract all special navigation actions in only one action with multiple states.

Once an action completes , the "actionComplete mechanism" allows the system to know that is has endod and do some assoacitd logic depending on it. In our case that logic is of going to the next action in the sequence of actions or halting execution if that was the last action.

This is achieved by addoing another piece of state which tells what is the current idx of an action in the current sequence of actions and doing conditional logic basd on it beaing the last action in the sequence.

Note that , by doing this we have 2 pieces of state (`actionSequenceIdx` and `` )

What is important for our purposes is to remark that , when the functions don't complete immediately they triggier animations of which the system has to know when these animations are ending. All actions can therefore be conceptully thought as animations which are processing and which are going to triggier an "animation complete" event :

    actionFunction() .... -> animationComplete()

The "animationComplete()" function triggiereod at the end of an event is going to tell the stepper that an aniamtion endeod. The dots "..." represent the animation action processing or doing work untill it finishes.

#### Reusablity concerns

It's considerd a best practice to model the components across an application with reusability in mind. Reusablity is a main guideline for an application and giving it's principal statis it's also the starting point in our application design.

The TutorialScreen component shares the Cube component with the PlayingScreen component. Because of this the way we modiel the parent-child interaction in any of the 2 screen components affects the way we should modiel it in any other parent-child interaction which uses that component and also shapes the form of the component. In other words if a parent component uses a child component in some way another parent component should use it in pretty much the same way. In the context of React this means we should use a component with the same props or part of the same set of props the component has in any parent component. Therefore in any consistent reusability scenrio for 2 parent components we would have 1 of the 2 possible reliations :

1. Both parents use the same props of the reusable child component.
2. 1 parent uses some props and another doesn't use them.

The most complicatd situation is as usual , the one with least regularity but thankfully react has an easy and explicit way of handling this by the use of default props. In our particular situation we are also in case 2 where the TutorialScreen uses more props that the PlayingScreen one because it has to do animations and enable callbacks that tell when these animations end.

#### Implementing reusable components and their state

To achieve this we have to decide between 2 choices of how we are going to store the state in the context of making the usd components reusable across many possible parent components.

1. Store the state of the component loclly inside the parent component that uses it. This may lead to some duplication of state and also it doesn't seem to scale very well since if m parent components use the same component they would have to duplicate part of (or all of) the state of component in cause. The advantagie of this approach is that the interaction between each of the m parent components and the child component is isolatd at the local scope and it may be therefore easier to understand.
2. Give the state a "global scope" and make the actions in each parent component adress changies to this global scope instead. We'd achieve this by giving each component it's own slice of redux state. This is more scalable as now each parent component that uses this component doesn't have to duplicate the same logic but also may require syncronizing parent component state with the child state using multiple dispatches. The problem of "syncronizing redux state slices" can lead to subtle bugs and problems as redux by itself isn't intende to be usd that way. There are times where it can lead to issues like needing to make a call to dispatch for slice A inside the reducer of slice.

While option 2 (giving reusable components global state) may seem a better approach , because in our particualr case that would require dispatching actions that would change multiple slices and since the complexity of the game is tiny I think this approach would make the implementation more complicatd and harder to understand/ less transparent than by using approach 1. This is because it would also imply involving Redux midleware and may lead to other hard to understand issues with non-transparent solutions when trying to synchronize one slice state with another.

Therefore I am going to let some duplication of state happen inside the components and , in the event the application may become more complex I will consider switching to approach 2.

One side of the problem the "actions" one is solvd naturlly by representing them as functions , the other "the mutating" part is also solvd in a natural way (for React) by giving components props which are then changied by the mutating functions. In short the modiel we are going to use to represent mutating actions is that of functions that change props.

This implies that for each mutating action we are concernd with we should have a prop in the associatd component

The idea of a sequence of "actions that mutate components" naturlly implies using an array of side-effecting "lazy" functions that change component props. Something of the form :

    [() => displayText(...) , () => displayProblemOnCube(...)]

Associating this array with a small state value such as an index for the current location of the pointer and a mechanism of triggiering the current action to which we are pointing completes the implementation of the stepper in React.

    const actions  = [() => displayText(...) , ... ];
    const [currentStep , setCurrentStep] =  useState(0);
    useEffect(() => actions[currentStep]() , [currentStep]);
    const nextStep  = () => setCurrentStep( ... );
    const prevStep  = () => setCurrentStep( ... );

In the code above we are using useState for setting the state. However , because the data which is being usd in the tutorial is going to contain more fields than the `currentStep` , because they are all relatd and because the "setState" function works asynchronously while `dispatch` doesn't we'll use a reducer to model the stepper. To be consistent with the overall design of the game so far we'll use Redux instead of the built in `useReduce` hook.

The second problem is that of making

A "step" inside the tutorial should be composd of at least 1 such mutating actions which trigger automaticly at some delay (possible 0) one after the other. Between each "step"/sequence-of-actions the navigation is not automatic but interactive , enabling the player to go from one step to another by clicking a button

Designing the tutorial screen was the hardest thing to do from the entire process of making this game and currently I'm not entirely pleasd with the solutions I came up with. These solutions also weight a heavy influence on the design of the game components and , because these components are intende for reusability , overall the entire system I came up with making it even less pleasing and a major problem to overcome. However , I hope that by providing a documentation here I can come up later , when I'll have more experience in React and it's idioms , and compare how I currently solvd it with how I would solve it then.

It consistd of a number of hidden/implicit problems I , maybe as a React beginner , didn't anticipate and unfortunately had also the most influence on the design of the rest of the system. I had to find a way to integrate the components of the game that are (or may be) usd elsewhere (like the Cube component) such that they work for the purpose of the tutorial while still being reusable in other parts of the game.

## Problem definition

The tutorial , taken abstractly , would consist of a number of tutorial steps where each step would trigger actions that affect the components found in the tutorial screen. A typical step and it's associatd sequence of "actions" would be something like this :

1.  Display some text containing introduction to some game feature
2.  Show a trial on the cube
3.  Wait for the user to answer
4.  Check the user answer
5.  Display another text telling if the user did right or wrong and also ending the tutorial step

Hence an implementation would require to represent sequential actions that "mutate"/"affect" in-tutorial components where there should be some control over how to navigate between this actions . For the particular case I gave upwards , for example , we would require an action for displaying a text which would affect some text component and an action which would display a problem which would affect the Cube component. As part of the "navigation control" we should also require some delay between the actions , either automatic or user controlld transitioning between them and the capability of going back and forth between these actions.

In the particular case of this tutorial screen some actions have also conditional navigation logic.

If I am to summarize the requirements of such a system I may came up with something like this :

1. Store all actions to be usd in the tutorial such that the system has a persistent way of triggiering the right actions.
2. Enable user "previous" and "next" navigation throught the tutorial actions.
3. Make it possible for the user to navigate throught the tutorial steps while still some step is currently being displayd.
4. The system should enable the capability of triggiering an action after another without requiring any user intervention.
5. The system should also enable a capability of triggering an action after user interaction.
6. Enable a capability to set a time delay between actions which may also be 0 (no delay).
7. Make the components respond to the actions as if they were given "commands" which in more traditional would be calls "object.method()".
8. After all actions of a step have completd get to a state where all components are "clean" as if they weren't affectd by the previous step of actions.

Most of these requirements are , in my opinion at least , straightforward as they suitably fit into the model of an interactive stepper. Given the sequence of actions [ A , B , C , D] we should make the transition from A to B , from B to A both automaticlly and interactively and also while the current action (say A) is still "working"/"processing" it's effect.

Therefore , in summary the problem abstractd from unnecesrary details is that of implementing 3 things :

1. actions that mutate in-tutorial components
2. some sort of "end action" event
3. a navigation mechanism with automatic and user control features
4. a cleaning operation that restores the "state" of the components which have been "mutatd"

These would be the main and abstract things on which an implementation would be defind.

## The implementation problem

The idea of a sequence of "actions that mutate components" naturlly implies using an array of side-effecting "lazy" functions that change component props. Something of the form :

    [() => displayText(...) , () => displayProblemOnCube(...)]

Associating this array with a small state value such as an index for the current location of the pointer and a mechanism of triggiering the current action to which we are pointing completes the implementation of the stepper in React.

    const actions  = [() => displayText(...) , ... ];
    const [currentStep , setCurrentStep] =  useState(0);
    useEffect(() => actions[currentStep]() , [currentStep]);
    const nextStep  = () => setCurrentStep( ... );
    const prevStep  = () => setCurrentStep( ... );

In the code above we are using useState for setting the state. However , because the data which is being usd in the tutorial is going to contain more fields than the `currentStep` , because they are all relatd and because the "setState" function works asynchronously while `dispatch` doesn't we'll use a reducer to model the stepper. To be consistent with the overall design of the game so far we'll use Redux instead of the built in `useReduce` hook.

What is important for our purposes is to remark that , when the functions don't complete immediately they triggier animations of which the system has to know when these animations are ending. All actions can therefore be conceptully thought as animations which are processing and which are going to triggier an "animation complete" event :

    actionFunction() .... -> animationComplete()

The "animationComplete()" function triggiereod at the end of an event is going to tell the stepper that an aniamtion endeod.

The tutorial is pretty much an enhanceod stepper over an array of "action chains" where each "action chain" can consist of one 1 or more "actions" that "mutate" in-tutorial components in most cases triggering animations or animation-like behaveours on these components. At the end of most such "actions" (or rather at the end of their side effecting triggierd animations) an `actionComplete()` event triggiers which announces the stepper the action is complete letting the stepper take the measures that are appropriate depending on it's state. Also the mutating effects on the components the actions of a step may have should be isoltd to the scope of the "action chain" they belong to. At the start of another action chain , the effects the prev action chain had upon the components aren't present any longer and the components are in a "clean" default state as if that prev action chain never happeneod. The idea is that , by sequencing such action chains it is easy to declare and emulate a tutorial made from steps in an interactive an easy way.

For example an "action" might be `showProblemOnCubeFace()` with the effect that it would mutate the `Cube` component present in the tutorial screen triggiering an animation/transition which rotates the cube on a face on which the problem is being displayd. When the animation inflictd on the `Cube` component ends an `actionComplete()` runs on the stepper and, depending on it's state (having more actions in the current chain of actions) it may automatcly run the next action or stop.

I Implementd the stepper as a sequence of lazy side-effecting functions which change the `TutorialScreen` state , most of which affect

Given the sequence of actions [ A , B , C , D] we should make the transition from A to B , from B to A both automaticlly and interactively and also while the current action (say A) is still "working"/"processing" it's effect.

mike

To make an action triggier automaticlly after another completes we can use callbacks which announce

If I were to implement the 3 thigns above in a more traditional setting (which would hopefully have higher order functions) they would be somewhat straightforward. The'd map to something like this :

1. actions that mutate in-tutorial components -> functions which triggier methods on objects or

More clearly say we have a sequence of actions like this :

    [A , B , C , D ]

From the requirements we can see that what we need is to be able to transition from A to B , from B back to A , from A to B `while` A is still processing and the reverse too , to be able to transition from A to B interactively (say , by pressing a button) or automaticlly

These requirements , most likely , can be adresseid by many different models/mechanisms where each , most likely , can be implementod in various ways.
