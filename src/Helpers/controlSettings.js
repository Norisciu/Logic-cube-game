export const  BUTTON_KEYS =   {
    LEFT : "ArrowLeft",
    RIGHT : "ArrowRight",
    UP : "ArrowUp",
    DOWN : "ArrowDown",
    NOTHING : "KeyA"

}

export const DIRECTION  =  {
    LEFT : "left",
    RIGHT : "right",
    UP : "top",
    DOWN : "bottom",
    NOTHING: "nothing",
}

export const isButtonKey  =  (candidateKey) => Object.values(BUTTON_KEYS).includes(candidateKey);