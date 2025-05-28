import { Command, CommandManager } from "../Commands/CommandManager";
import type { InputContext } from "../Input/InputContext";
import type { InputHandler } from "../Input/InputManager";
import type { SnapManager } from "../Input/SnapManager";
import { UIManager } from "../UI/UIManager";
import type { CameraController } from "../utils/CameraController";
import type { Coord } from "./Coord";
import { Entity } from "./Entity";

export class Line extends Entity {
    public start: Coord;
    public end: Coord;

    constructor(start: Coord, end: Coord) {
        super();
        this.start = start;
        this.end = end;
    }
}

export class Lines {
    static lineArray: Line[] = [];
    static lineEndPoints: Coord[] = [];

    static Append(line: Line) {
        this.lineArray.push(line);
    }

    static printAll() {
        for (const line of this.lineArray) {
            console.log(line);
        }
    }
}

export class LineTool implements InputHandler {
    private canvas: HTMLCanvasElement;
    private camera: CameraController;
    private input: InputContext;
    private snapper: SnapManager;
    private commandManager: CommandManager;
    private uiManager: UIManager;

    constructor(canvas: HTMLCanvasElement, camera: CameraController, input: InputContext, snapper: SnapManager, commandManager: CommandManager, uiManager: UIManager) {
        this.canvas = canvas;
        this.camera = camera;
        this.input = input;
        this.snapper = snapper;
        this.commandManager = commandManager;
        this.uiManager = uiManager;
    }

    onMouseDown(e: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const rawMouse: Coord = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }

        if (this.input.overPanel) {
            return;
        }

        if (this.camera.isPanning()) { // Middle Mouse Button
            this.input.lastMouse = { x: e.clientX, y: e.clientY };
        }

        if (this.commandManager.currentCommand === Command.LINE) {
            const worldMouse = this.camera.screenToWorld(rawMouse);
            const snap = this.snapper.findSnapPoint(worldMouse);
            const point = snap ?? worldMouse;
            Lines.lineEndPoints.push(point);

            if (Lines.lineEndPoints.length === 1) {
                this.input.tempMouseWorld = worldMouse;
            }

            if (Lines.lineEndPoints.length === 2) {
                const line = new Line(Lines.lineEndPoints[0], Lines.lineEndPoints[1]);
                Lines.Append(line);
                Lines.lineEndPoints = [point];

                // Optional to keep line command going or not
                // this.currentCommand = Command.NONE;
            }
        }
    }

    onMouseUp(e: MouseEvent): void {
        if (e.button === 1) {
            this.camera.panning = false;
        }
    }

    onMouseMove(e: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const rawMouse: Coord = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        this.input.overPanel = this.uiManager.isCursorOverPanel(rawMouse);
        this.canvas.style.cursor = this.input.overPanel ? "default" : "none";

        this.input.tempMouseScreen = rawMouse;
        const worldMouse = this.camera.screenToWorld(rawMouse);
        this.input.tempMouseWorld = worldMouse;

        if (this.camera.isPanning()) {
            const dx = (e.clientX - this.input.lastMouse.x) / this.camera.zoom;
            const dy = (e.clientY - this.input.lastMouse.y) / this.camera.zoom;

            this.camera.position.x -= dx;
            this.camera.position.y -= dy;

            this.input.lastMouse = { x: e.clientX, y: e.clientY };
        }

        if (this.commandManager.currentCommand === Command.LINE) {
            const snap = this.snapper.findSnapPoint(worldMouse);
            this.snapper.snapCandidate = snap;
            if (snap) this.input.tempMouseWorld = snap;
        } else {
            this.snapper.snapCandidate = null;
        }
    }

    onKeyDown(e: KeyboardEvent): void {
        if (e.key === "Escape") {
            if (this.commandManager.currentCommand === Command.LINE) {
                Lines.lineEndPoints = [];
            }
            this.commandManager.currentCommand = Command.NONE;
            this.snapper.snapCandidate = null;
            console.log("Command Canceld");
        }
    }
}
