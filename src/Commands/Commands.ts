export const Command = {
    NONE: -1,
    POINT: 0,
    LINE: 1,
    CIRCLE: 2,
} as const;

export type Command = typeof Command[keyof typeof Command];
