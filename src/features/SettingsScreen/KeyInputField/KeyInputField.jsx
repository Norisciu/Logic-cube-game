import React, { useEffect, useState } from "react";
import "./KeyInputFields.css";

export default function KeyInputField({ 
    name, 
    defaultKey, 
    onKeyChange = f => f, 
    hasFocsDefault = false, 
    hasErrors = false
}) {

    const [hasFocs, setHasFocs] = useState(hasFocsDefault);
    const [key, setKey] = useState(defaultKey);

    const getClasses = () => `key-input ${hasErrors ? "has-errors" : ""}`;
       
    useEffect(() => {
        const onKeyDown = event => {
            if (!hasFocs || event.repeat) { return }
            const keyName = event.code;
            setKey(keyName);
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [hasFocs]);

    useEffect(() => onKeyChange(key), [key])

    return (
        <div  className="row">
            <label htmlFor={name}>{name}</label>
            <input
                className={getClasses()} 
                name={name}
                value={key}
                onFocus={() => setHasFocs(true)}
                onBlur={() => setHasFocs(false)}
            />
        </div>
    )
}