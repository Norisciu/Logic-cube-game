import { colors, directions, NOTHING, unaryOperators, binaryOperators } from "./tokensTypes";



export function getTokens(string) {
    const lexemes = string.toLowerCase().match(/[a-zA-Z]+/ig) || [];

    return lexemes.filter(lexeme => isToken(lexeme));
}

const isToken = (candidate) => {
    let tokenFunctions = [
        isBinaryOperator,
        isUnaryOperator,
        isDirection,
        isColor,
        isNothing,
    ]
    return tokenFunctions.some(func => func(candidate));
}

export function isBinaryOperator(candidate) {



    return binaryOperators.includes(candidate);
}

export function isUnaryOperator(candidate) {





    return unaryOperators.includes(candidate);
}



export function isDirection(candidate) {







    

    return directions.includes(candidate);
}

export function isColor(candidate) {









    return colors.includes(candidate);
}

export function isNothing(candidate) {

    return candidate === NOTHING;
}