import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import KeyInputField from "./KeyInputField/KeyInputField";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setAllKeyboardBindings } from "./settingsScreenSlice";
import { ActionButton } from "../../GameComponents/GameUI/ActionButton/ActionButton";
import { Home, Pocket } from "react-feather";
import "./SettingsScreen.css";


const startCase = string => `${string[0].toUpperCase()}${string.substring(1).toLowerCase()}`

const Error = ({ errorName }) => {
    return (<p className="error">{errorName}</p>)
}


export function SettingsScreen() {
    const navigator = useNavigate();
    const toMainMenu = () => navigator("/");


    const dispatch = useDispatch();
    const keyboardBindings = useSelector(state => state.settingsScreen.keyboardBindings);
    const [formState, setFormState] = useState({ ...keyboardBindings });
    const [errors, setErrors] = useState([]);

    const isFieldWithErrors = (fieldName) => {
        let errorFields = errors.flatMap(({ _, fieldsWithError }) => fieldsWithError);
        return errorFields.includes(fieldName);
    }
    const keyInputFields = Object.entries(keyboardBindings).map(([gameAction, key]) => {
        const keyInputName = startCase(gameAction.split("_")[0]);
        const hasErrors = isFieldWithErrors(gameAction);
        return (
            <KeyInputField
                name={keyInputName}
                defaultKey={key}
                onKeyChange={(key) => setKeyBinding(gameAction, key)}
                hasErrors={hasErrors}
            />
        )
    })

    const setKeyBinding = (gameAction, key) => {
        setFormState({
            ...formState,
            [gameAction]: key
        })
    }



    useEffect(() => {

        checkForErrors();
    }, [formState]);

    const submitForm = event => {
        event.preventDefault();
        dispatch(setAllKeyboardBindings({ formState }));
    }


    const nonRepeatdKeyValues = () => {
        let keys = [...Object.values(formState)]




        let hasError = false;
        const fieldsWithError = [];
        const explainer = "All fields should have different keys";
        const entries = Object.entries(formState);


        entries.forEach(([action, key]) => {
            entries.forEach(([otherAction, otherKey]) => {
                let differentFields = action != otherAction;
                let sameKeys = key === otherKey;
                if (differentFields && sameKeys) {
                    hasError = true;
                    fieldsWithError.push(action);

                }
            })
        })


        return { hasError, explainer, fieldsWithError }
    }

    const valdators = [nonRepeatdKeyValues]
    // plain O(n^2) search but it doesn't matter since we just use
    // a couple of fields..
    const checkForErrors = () => {

        const errors = [];
        valdators.forEach(valdator => {
            let { hasError, explainer, fieldsWithError } = valdator();
            if (hasError) {
                errors.push({ error: explainer, fieldsWithError });
            }
        });
        errors && setErrors(errors);
    };

    const hasErrors = () => errors.length > 0;

    const showErrors = () => {
        let errorNames = errors.map(({ error, _ }) => error);
        let uniqueErrorNames = [...(new Set(errorNames))];
        return uniqueErrorNames.map(errorName => <Error errorName={errorName} />);

    }



    useEffect(() => {



    });


    return (
        <div className="game-menu game-menu--settings-screen">
            <h2 className="screen-header">Settings Screen</h2>
            <div className="keyboard-settings">

                {keyInputFields}
            </div>
            <div className="controls">
                <div className="controls__container">
                    <ActionButton
                        disabled={hasErrors()}
                        onClick={event => submitForm(event)} >
                        <Pocket />
                    </ActionButton>
                    <ActionButton onClick={toMainMenu}>
                        <Home />
                    </ActionButton>
                </div>
            </div>
            {hasErrors() && showErrors()}
        </div>
    )
}