const AND_OPERATOR =  "and";
const OR_OPERATOR =  "or";
const NOT_OPERATOR =  "not";

const DIRECTION_LEFT =  "left";
const DIRECTION_RIGHT  = "right";
const DIRECTION_UP =  "top";
const DIRECTION_DOWN =  "bottom";

const COLOR_BLUE =  "blue";
const COLOR_YELLOW  = "yellow";
const COLOR_GREEN =  "green";
const COLOR_RED = "red";


export const NOTHING  = "nothing";


export const unaryOperators = [NOT_OPERATOR]

export const binaryOperators = [AND_OPERATOR, OR_OPERATOR]

export const directions = [
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    DIRECTION_UP,
    DIRECTION_DOWN
];

export const colors = [
    COLOR_RED,
    COLOR_GREEN,
    COLOR_BLUE,
    COLOR_YELLOW
]

export const colorsEnum  =  {
    YELLOW : COLOR_YELLOW,
    RED : COLOR_RED,
    GREEN : COLOR_GREEN,
    BLUE : COLOR_BLUE
}

export const directionsEnum = {
    LEFT : DIRECTION_LEFT,
    RIGHT : DIRECTION_RIGHT,
    UP : DIRECTION_UP,
    DOWN : DIRECTION_DOWN
}




