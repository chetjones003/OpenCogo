import { Command } from "./Commands/Commands";
import type { Coord } from "./Entities/Coord";
import { Line, Lines } from "./Entities/Line";

type InitOptions = {
    background?: string;
    resizeTo?: Window | HTMLElement;
};

export class Application {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    background: string = "#000000";
    currentCommand: Command = Command.NONE;
    mouseClicks = 0;
    private linePoints: Coord[] = [];
    private tempMouse: Coord = { x: 0, y: 0 };
    private frameInterval = 1000 / 30;

    private resizeTarget?: Window | HTMLElement | null = null;

    constructor() {
        this.canvas = document.createElement("canvas");
        const context = this.canvas.getContext("2d");
        if (!context) {
            throw new Error("Failed to get canvas context");
        }
        this.context = context;
    }

    async init(options: InitOptions = {}) {
        if (options.background) this.background = options.background;
        if (options.resizeTo) this.resizeTarget = options.resizeTo;

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
        this.onMouseMove();
    }

    startRenderLoop() {
        setInterval(() => {
            this.render();
        }, this.frameInterval);
    }

    render() {
        if (this.context) {
            for (const line of Lines.lineArray) {
                this.context.strokeStyle = "red";
                this.context.lineWidth = 2;
                this.context.beginPath();
                this.context.moveTo(line.start.x, line.start.y);
                this.context.lineTo(line.end.x, line.end.y);
                this.context.stroke();

            }

            if (this.currentCommand === Command.LINE && this.linePoints.length === 1 && this.tempMouse) {
                const start = this.linePoints[0];
                const end = this.tempMouse;

                this.context.strokeStyle = "yellow";
                this.context.lineWidth = 2;
                this.context.beginPath();
                this.context.moveTo(start.x, start.y);
                this.context.lineTo(end.x, end.y);
                this.context.stroke();
            }
        }
    }

    onMouseDown() {
        this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (this.currentCommand === Command.LINE) {
                this.linePoints.push({ x, y });
                console.log(this.linePoints);

                if (this.linePoints.length === 1) {
                    this.tempMouse = { x, y };
                }

                if (this.linePoints.length === 2) {
                    const line = new Line(this.linePoints[0], this.linePoints[1]);
                    Lines.Append(line);
                    this.linePoints = [];
                    this.currentCommand = Command.NONE;
                }
            }
        });
    }

    onMouseMove() {
        this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
            if (this.currentCommand === Command.LINE && this.linePoints.length === 1) {
                const rect = this.canvas.getBoundingClientRect();
                this.tempMouse = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                }
            }
        });
    }

    clear() {
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
