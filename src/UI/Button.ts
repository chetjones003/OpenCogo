import { IsMouseInside, type Rect } from "../utils/helpers";
import { UIElement } from "./UIElement";

export class Button extends UIElement {
    x: number = 0;
    y: number = 0;
    label: string;
    onClick: () => void;
    buttonRect: Rect;

    constructor(width: number, height: number, label: string, onClick: () => void) {
        super(0, 0, width, height);
        this.label = label;
        this.onClick = onClick;
        this.buttonRect = { x: this.globalX, y: this.globalY, width: this.width, height: this.height };
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#555";
        ctx.fillRect(this.globalX, this.globalY, this.width, this.height);

        ctx.fillStyle = "#fff";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            this.label,
            this.globalX + this.width / 2,
            this.globalY + this.height / 2
        );
    }

    update(): void {
        this.buttonRect = { x: this.globalX, y: this.globalY, width: this.width, height: this.height };
    }

    onMouseDown(e: MouseEvent): void {
        const mx = e.offsetX;
        const my = e.offsetY;

        if (IsMouseInside([mx, my], this.buttonRect)) {
            this.onClick();
        }
    }
}
