const SettingsModule = (() => {
  return {
    TRIAL_STATE_ROTATING: "TRIAL_STATE_ROTATING",
    TRIAL_STATE_WAITING_PLAYER: "TRIAL_STATE_WAITING_PLAYER",
    TRIAL_STATE_SHOWING_ANSWER: "TRIAL_STATE_SHOWING_ANSWER",
    TRIAL_STATE_SESSION_END: "TRIAL_STATE_SESSION_END",
    TRIAL_STATE_LAST_QUESTION: "TRIAL_STATE_LAST_QUESTION",
    TRIAL_TIME: 28000,

    CUBE_FACE_FRONT: "front" || "CUBE_FACE_FRONT",
    CUBE_FACE_BACK: "back" || "CUBE_FACE_BACK",
    CUBE_FACE_LEFT: "left" || "CUBE_FACE_LEFT",
    CUBE_FACE_RIGHT: "right" || "CUBE_FACE_RIGHT",
    CUBE_FACE_TOP: "top" || "CUBE_FACE_TOP",
    CUBE_FACE_BOTTOM: "bottom" || "CUBE_FACE_BOTTOM",

    DIRECTION_LEFT: "left",
    DIRECTION_RIGHT: "right",
    DIRECTION_UP: "top",
    DIRECTION_DOWN: "bottom",

    NOTHING: "nothing",
    NOTHING_KEYBOARD: "KeyA",

    MARK_CORRECT: "MARK_CORRECT",
    MARK_WRONG: "MARK_WRONG",

    CORRECT_ANSWER: "CORRECT_ANSWER",
    WRONG_ANSWER: "WRONG_ANSWER",

    SESSION_DURATION_SECONDS: 120,

    DIFFICULTY_EASY: "DIFFICULTY_EASY",
    DIFFICULTY_MEDIUM: "DIFFICULTY_MEDIUM",
    DIFFICULTY_HARD: "DIFFICULTY_HARD",
  };
})();

export default SettingsModule;
