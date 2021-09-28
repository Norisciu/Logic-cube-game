import React from "react";
import { isBinaryOperator, isColor, isUnaryOperator } from "../../../Engine/CubeDSL/Tokenizer/Tokenizer";
import "./TrialInstruction.css"


const colorInstruction = instruction => {
    const words = instruction.split(/\s+/);
    const nodes = [];
    words.forEach(word => {
        if (isColor(word)) {
            const node = <span class={`color--${word.toLowerCase()}`}>{word}</span>;
            nodes.push(node);
        }

        else if (isUnaryOperator(word)){
            const node  = <span class="unary-operator">{`${word} `}</span>
            nodes.push(node);
        }

        else if (isBinaryOperator(word)) {
            const node = <span class="binary-operator">{word}</span>
            nodes.push(node);
        }

        else {
            nodes.push(word);
        }
    })

    return nodes;
}


const getSize = instruction => {

    const linesCountToFontSize = [
        [3, "1em"],
        [5, "0.9em"],
        [7, "0.7em"],
        [9, "0.5em"]
    ];
    const linesOrAnd = (instruction.match(/or|and|not/ig) || []).length;
    const lines = (linesOrAnd * 2) + 1;
    const fontSize = linesCountToFontSize.find(([linesRef, size]) => lines <= linesRef)[1];

    return fontSize;
}

export function TrialInstruction({ instruction }) {
    return (
        <div style =  {{fontSize : getSize(instruction)}} >
            {colorInstruction(instruction)}
        </div>
    )

}