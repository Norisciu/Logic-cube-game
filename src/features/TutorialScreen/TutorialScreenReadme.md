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
