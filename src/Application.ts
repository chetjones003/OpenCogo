import { Command } from "./Commands/Commands";
import type { Coord } from "./Entities/Coord";
import { Line, Lines } from "./Entities/Line";
import { UIManager } from "./UI/UIManager";
import { CameraController } from "./utils/CameraController";

type InitOptions = {
    background?: string;
    resizeTo?: Window | HTMLElement;
};

export class Application {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    camera: CameraController = new CameraController();
    background: string = "#000000";
    currentCommand: Command = Command.NONE;
    ui: UIManager;

    private snapRadius = 10;
    private snapCandidate: Coord | null = null;
    private linePoints: Coord[] = [];
    private overPanel: boolean = false;
    private resizeTarget?: Window | HTMLElement | null = null;
    private isPanning: boolean = false;
    private lastMouse: Coord = { x: 0, y: 0 };
    private tempMouseScreen: Coord | null = { x: 0, y: 0 };
    private tempMouseWorld: Coord | null = { x: 0, y: 0 };

    constructor() {
        this.canvas = document.createElement("canvas");
        const context = this.canvas.getContext("2d");
        if (!context) {
            throw new Error("Failed to get canvas context");
        }
        this.context = context;
        this.ui = new UIManager(this.context, this.canvas);
    }

    async init(options: InitOptions = {}) {
        if (options.background) this.background = options.background;
        if (options.resizeTo) this.resizeTarget = options.resizeTo;

        this.canvas.style.cursor = "none";
        this.canvas.style.position = "absolute";

        this.resizeCanvas();
        this.clear();

        if (this.resizeTarget instanceof Window) {
            window.addEventListener("resize", () => this.resizeCanvas());
        } else if (this.resizeTarget instanceof HTMLElement) {
            new ResizeObserver(() => this.resizeCanvas()).observe(
                this.resizeTarget
            );
        }

        this.onMouseDown();
        this.onMouseUp();
        this.onMouseMove();
        this.onMouseWheel();
        this.onKeyDown();
    }

    render() {
        this.ui.update();
        if (this.context) {

            this.context.setTransform(
                this.camera.zoom,
                0,
                0,
                this.camera.zoom,
                -this.camera.position.x * this.camera.zoom,
                -this.camera.position.y * this.camera.zoom
            )


            for (const line of Lines.lineArray) {
                this.context.strokeStyle = "red";
                this.context.lineWidth = 2;
                this.context.beginPath();
                this.context.moveTo(line.start.x, line.start.y);
                this.context.lineTo(line.end.x, line.end.y);
                this.context.stroke();

            }

            if (this.currentCommand === Command.LINE && this.linePoints.length === 1 && this.tempMouseWorld) {
                const start = this.linePoints[0];
                const end = this.tempMouseWorld;

                this.context.strokeStyle = "yellow";
                this.context.lineWidth = 2;
                this.context.beginPath();
                this.context.moveTo(start.x, start.y);
                this.context.lineTo(end!.x, end!.y);
                this.context.stroke();
            }

            if (this.snapCandidate) {
                const pt = this.snapCandidate;
                const size = 15;
                this.context.strokeStyle = "green";
                this.context.lineWidth = 1;
                this.context.strokeRect(pt.x - size / 2, pt.y - size / 2, size, size);
            }

            // Reset Transform for UI
            this.context.setTransform(1, 0, 0, 1, 0, 0);
        }
        this.ui.render();
    }

    renderCursor() {
        // Custom Cursor
        if (this.context && this.tempMouseScreen && !this.overPanel) {
            const screenMouse = this.tempMouseScreen;

            // Reset Transform for Cursor
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.strokeStyle = "orange";
            this.context.lineWidth = 1;

            this.context.beginPath();
            this.context.moveTo(0, screenMouse!.y);
            this.context.lineTo(this.canvas.width, screenMouse!.y);
            this.context.stroke();

            this.context.beginPath();
            this.context.moveTo(screenMouse!.x, 0);
            this.context.lineTo(screenMouse!.x, this.canvas.height);
            this.context.stroke();
        }
    }

    onMouseDown() {
        this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            const rawMouse: Coord = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            }

            if (this.overPanel) {
                return;
            }

            if (e.button === 1) { // Middle Mouse Button
                this.isPanning = true;
                this.lastMouse = { x: e.clientX, y: e.clientY };
            }

            if (this.currentCommand === Command.LINE) {
                const worldMouse = this.camera.screenToWorld(rawMouse);
                const snap = this.findSnapPoint(worldMouse);
                const point = snap ?? worldMouse;
                this.linePoints.push(point);

                if (this.linePoints.length === 1) {
                    this.tempMouseWorld = worldMouse;
                }

                if (this.linePoints.length === 2) {
                    const line = new Line(this.linePoints[0], this.linePoints[1]);
                    Lines.Append(line);
                    this.linePoints = [point];

                    // Optional to keep line command going or not
                    // this.currentCommand = Command.NONE;
                }
            }
        });
    }

    onMouseUp() {
        this.canvas.addEventListener("mouseup", (e: MouseEvent) => {
            if (e.button === 1) {
                this.isPanning = false;
            }
        });
    }

    onMouseMove() {
        this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            const rawMouse: Coord = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
            this.overPanel = this.ui.isCursorOverPanel(rawMouse);
            this.canvas.style.cursor = this.overPanel ? "default" : "none";

            this.tempMouseScreen = rawMouse;
            const worldMouse = this.camera.screenToWorld(rawMouse);
            this.tempMouseWorld = worldMouse;

            if (this.isPanning) {
                const dx = e.clientX - this.lastMouse.x;
                const dy = e.clientY - this.lastMouse.y;

                this.camera.position.x -= dx;
                this.camera.position.y -= dy;

                this.lastMouse = { x: e.clientX, y: e.clientY };
            }

            if (this.currentCommand === Command.LINE) {
                const snap = this.findSnapPoint(worldMouse);
                this.snapCandidate = snap;
                if (snap) this.tempMouseWorld = snap;
            } else {
                this.snapCandidate = null;
            }

        });
    }

    onMouseWheel() {
        this.canvas.addEventListener("wheel", (e: WheelEvent) => {
            const zoomFactor = 1.1;
            const mouse: Coord = {
                x: e.offsetX,
                y: e.offsetY,
            };
            const worldBefore = this.camera.screenToWorld(mouse);

            if (e.deltaY < 0) {
                this.camera.zoom *= zoomFactor;
            } else {
                this.camera.zoom /= zoomFactor;
            }

            const worldAfter = this.camera.screenToWorld(mouse);

            this.camera.position.x += (worldBefore.x - worldAfter.x);
            this.camera.position.y += (worldBefore.y - worldAfter.y);

            e.preventDefault();
        });
    }

    onKeyDown() {
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (this.currentCommand === Command.LINE) {
                    this.linePoints = [];
                }
                this.currentCommand = Command.NONE;
                this.snapCandidate = null;
                console.log("Command Canceld");
            }
        });
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private findSnapPoint(cursor: Coord): Coord | null {
        for (const line of Lines.lineArray) {
            const endpoints = [line.start, line.end];
            for (const pt of endpoints) {

                if (this.linePoints.length > 0 && this.pointsEqual(pt, this.linePoints[0])) {
                    continue;
                }

                const dx = pt.x - cursor.x;
                const dy = pt.y - cursor.y;

                const distSq = Math.pow(dx, 2) + Math.pow(dy, 2);

                if (distSq <= Math.pow(this.snapRadius, 2)) {
                    return pt
                }
            }
        }
        return null;
    }

    private pointsEqual(a: Coord, b: Coord): boolean {
        return a.x === b.x && a.y === b.y;
    }

    private resizeCanvas() {
        if (this.resizeTarget instanceof Window) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        } else if (this.resizeTarget instanceof HTMLElement) {
            const rect = this.resizeTarget.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        }
        this.clear();
    }
}
