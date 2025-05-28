export const Command = {
    NONE: -1,
    POINT: 0,
    LINE: 1,
    CIRCLE: 2,
} as const;

export type Command = typeof Command[keyof typeof Command];

export class CommandManager {
    currentCommand: Command = Command.NONE;

    constructor() { }

    GetCurrentCommand() {
        return this.currentCommand;
    }

    SetCommand(command: Command) {
        this.currentCommand = command;
    }
}
