import type { Coord } from "../Entities/Coord";

export class InputContext {
    lastMouse: Coord = { x: 0, y: 0 };
    tempMouseWorld: Coord | null = null;
    tempMouseScreen: Coord | null = null;
    overPanel: boolean = false;
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    getRawMousePosition(e: MouseEvent): Coord {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }
    }
}
