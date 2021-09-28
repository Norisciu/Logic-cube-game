import { BUTTON_KEYS , DIRECTION } from "./controlSettings"


export const CUBE_ANIMATIONS = {
    rotating : "cube-animation-rotating",
    fallFromAbove : "cube-animation-fall-above",
}

export const KEYS_TO_DIRS_MAP  =  new Map([
    [BUTTON_KEYS.LEFT , DIRECTION.LEFT],
    [BUTTON_KEYS.RIGHT , DIRECTION.RIGHT],
    [BUTTON_KEYS.UP , DIRECTION.UP],
    [BUTTON_KEYS.DOWN , DIRECTION.DOWN],
    [BUTTON_KEYS.NOTHING , DIRECTION.NOTHING]

])