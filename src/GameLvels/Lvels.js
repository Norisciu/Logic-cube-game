export const difficultyData = new Map([
  [
    1,
    {
      forms: ["direction"],
      colorsRange: [1, 4],
      differentColorsCount: 2,
    },
  ],

  [
    2,
    {
      forms: ["color", "not color", "not direction"],
      colorsRange: [1, 4],
      differentColorsCount: 2,
    },
  ],

  [
    3,
    {
      forms: [
        "color or direction",
        "color and not color",
        "color and not direction",
        "not color",
      ],
      colorsRange: [1, 4],
      differentColorsCount: 2,
    },
  ],
  [
    4,
    {
      forms: [
        "color or color and not direction",
        "color or color and not direction",
        "direction and not direction or color",
      ],
      colorsRange: [1, 4],
      differentColorsCount: 2,
    },
  ],
]);
