


const expression = "color or direction"


function shuffle(array) {
    var currentIndex = array.length, randomIndex;


    while (currentIndex != 0) {


        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;


        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

let colors = ["red", "blue", "green", "yellow"];

let directions = ["left", "right", "top", "bottom"];


export function makeExpression(form) {
    let tokens = getTokens(form);
    let result = {
        expression: [],
        colorIdentifiers: {},
        directionIdentifiers: {},
        colorIdx: 0,
        directionIdx: 0
    };
    for (let k = 0; k < tokens.length; k++) {
        let currentToken = tokens[k];
        if (isColor(currentToken)) {
            let identifier = extractColorIdentifier(currentToken);
            let colorName = result.colorIdentifiers[identifier] || "";
            if (identifier.length > 0 && colorName.length > 0) {
                result.expression.push(colorName);
            }

            else if (identifier.length > 0 && !colorName) {
                result.colorIdx = Number(identifier);
                let alreadyInUseColors = Object.entries(result.colorIdentifiers)
                    .map(([_, color]) => color);
                let colorChoices = colors.filter(color => !alreadyInUseColors.includes(color));
                let resultColor = randomFromList(colorChoices) || "NO COLOR";

                result.colorIdentifiers[Number(result.colorIdx)] = resultColor;
                result.expression.push(resultColor);

            }

            else {
                let alreadyInUseColors = Object.entries(result.colorIdentifiers).map(([_, color]) => color);
                let colorChoices = colors.filter(color => !alreadyInUseColors.includes(color));
                let resultColor = randomFromList(colorChoices) || "NO COLOR";
                result.colorIdx++;
                result.colorIdentifiers[result.colorIdx.toString()] = resultColor;
                result.expression.push(resultColor);
            }

        }

        else if (isDirection(currentToken)) {


            let identifier = extractDirectionIdentifier(currentToken);
            let directionName = result.colorIdentifiers[identifier] || "";
            if (identifier.length > 0 && directionName.length > 0) {
                result.expression.push(directionName);
            }

            else if (identifier.length > 0 && !directionName) {
                result.directionIdx = Number(identifier);
                let alreadyInUseDirections = Object.entries(result.directionIdentifiers)
                    .map(([_, direction]) => direction);
                let directionChoices = directions.filter(direction => !alreadyInUseDirections.includes(direction));
                let resultDirection = randomFromList(directionChoices) || "NO COLOR";

                result.colorIdentifiers[Number(result.directionIdx)] = resultDirection;
                result.expression.push(resultDirection);

            }

            else {
                let alreadyInUseDirections = Object.entries(result.directionIdentifiers).map(([_, direction]) => direction);
                let directionChoices = directions.filter(direction => !alreadyInUseDirections.includes(direction));
                let resultDirection = randomFromList(directionChoices) || "NO COLOR";
                result.directionIdx++;
                result.directionIdentifiers[result.directionIdx.toString()] = resultDirection;
                result.expression.push(resultDirection);
            }
        }

        else {
            result.expression.push(currentToken);
        }
    }

    return result.expression.join(" ");
}


function getTokens(string) {
    return string.split(/\s+/);
}

const isParticularColor = (color) => colors.includes(color);

const isColor = token => token.match(/color\d*/ig);
const isDirection = token => token.match(/direction\d*/ig);
const extractColorIdentifier = color => color.match(/(?<=color)\d*/ig)[0];
const extractDirectionIdentifier = direction => direction.match(/(?<=direction)\d*/ig)[0];
const randomFromList = list => list[randomInRange(0, list.length)];
const randomInRange = (low, high) => {
    let difference = high - low;
    let result = Math.floor(low + Math.random() * difference);
    return result;
}


export const makeProblem = (form, colordSides, differentColors) => {
    let expression = makeExpression(form);
    let tokens = getTokens(expression);

    let colorsInUse = tokens.filter(token => isParticularColor(token));


    let sides = makeSides(expression, colorsInUse, colordSides, differentColors);

    return {
        sides: sides,
        expression: expression,
        numberOfColors: colordSides,
        differentColors: differentColors
    };
}



const makeSides = (expression = "", colorsInUse, colorsCount, differentColorsCount) => {
    let colorChoices = getColorChoices(colorsInUse, colorsCount, differentColorsCount);
    let resultSides = {
        "left": null,
        "right": null,
        "top": null,
        "bottom": null
    };
    let directions = shuffle(["left", "right", "top", "bottom"]);
    for (let k = 0; k < colorsCount; k++) {
        if (k < colorChoices.length) {
            let direction = directions[k];
            resultSides[direction] = colorChoices[k];
        }
        else {
            let randomColor = randomFromList(colorChoices);
            let direction = directions[k];
            resultSides[direction] = randomColor;
        }
    }

    return resultSides;

}

const getColorChoices = (colorsList, colorsCount, differentColorsCount) => {

    let difference = Math.max(0, differentColorsCount - colorsList.length);
    let addtionalColors = colors
        .filter(color => !colorsList.includes(color))
        .slice(0, difference);
    let colorChoices = colorsList.concat(addtionalColors);
    return colorChoices;
}

