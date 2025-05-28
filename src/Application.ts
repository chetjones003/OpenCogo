import { Command, CommandManager } from "./Commands/CommandManager";
import type { Coord } from "./Entities/Coord";
import { Lines, LineTool } from "./Entities/Line";
import { InputContext } from "./Input/InputContext";
import { InputManager } from "./Input/InputManager";
import { SnapManager } from "./Input/SnapManager";
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
    commandManager: CommandManager;

    private inputManager: InputManager;
    private inputContext: InputContext;
    private snapper: SnapManager;
    private lineTool: LineTool;

    private resizeTarget?: Window | HTMLElement | null = null;

    constructor() {
        this.canvas = document.createElement("canvas");
        const context = this.canvas.getContext("2d");

        if (!context) {
            throw new Error("Failed to get canvas context");
        }

        this.context = context;
        this.inputContext = new InputContext(this.canvas);
        this.inputManager = new InputManager(this.canvas);
        this.commandManager = new CommandManager();
        this.ui = new UIManager(this.context, this.canvas);
        this.snapper = new SnapManager();
        this.lineTool = new LineTool(this.canvas, this.camera, this.inputContext, this.snapper, this.commandManager, this.ui);

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


        this.inputManager.addHandler(this.lineTool);
        this.onMouseWheel();
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

            if (this.commandManager.currentCommand === Command.LINE && Lines.lineEndPoints.length === 1 && this.inputContext.tempMouseWorld) {
                const start = Lines.lineEndPoints[0];
                const end = this.inputContext.tempMouseWorld;

                this.context.strokeStyle = "yellow";
                this.context.lineWidth = 2;
                this.context.beginPath();
                this.context.moveTo(start.x, start.y);
                this.context.lineTo(end!.x, end!.y);
                this.context.stroke();
            }

            if (this.snapper.snapCandidate) {
                const pt = this.snapper.snapCandidate;
                const size = 15;
                this.context.strokeStyle = "green";
                this.context.lineWidth = 2;
                if (pt) {
                    this.context.strokeRect(pt.x - size / 2, pt.y - size / 2, size, size);
                }
            }

            // Reset Transform for UI
            this.context.setTransform(1, 0, 0, 1, 0, 0);
        }
        this.ui.render();
    }

    renderCursor() {
        // Custom Cursor
        if (this.context && this.inputContext.tempMouseScreen && !this.inputContext.overPanel) {
            const screenMouse = this.inputContext.tempMouseScreen;

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

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
