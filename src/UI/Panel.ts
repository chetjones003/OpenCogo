import { IsMouseInside, type Rect } from "../utils/helpers";
import type { UIElement } from "./UIElement";

export class Panel {
    elements: UIElement[] = [];
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    dragging = false;
    resizing = false;
    dragOffsetX = 0;
    dragOffsetY = 0;
    panelRect: Rect;
    movable: boolean = false;
    resizable: boolean = false;

    private layoutCursorX = 0;
    private layoutCursorY = 30;
    private rowHeight = 0;
    private padding = 0;
    private spacing = 5;
    private resizeHandleSize = 8;
    private headerHeight = 30;

    constructor(name: string, x: number, y: number, width: number, height: number, movable: boolean = false, resizable: boolean = false) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.panelRect = { x: this.x, y: this.y, width: this.width, height: this.height };
        this.movable = movable;
        this.resizable = resizable;
    }

    add(element: UIElement) {
        element.setParent(this);

        if (this.layoutCursorX + element.width + this.padding > this.width) {
            this.layoutCursorX = this.padding;
            this.layoutCursorY += this.rowHeight + this.spacing;
            this.rowHeight = 0;
        }

        element.x = this.layoutCursorX;
        element.y = this.layoutCursorY;

        this.layoutCursorX += element.width + this.spacing;
        this.rowHeight = Math.max(this.rowHeight, element.height);

        this.elements.push(element);
    }

    updateLayout() {
        this.layoutCursorX = this.padding;
        this.layoutCursorY = this.padding + this.headerHeight;
        this.rowHeight = 0;

        for (const el of this.elements) {
            if (this.layoutCursorX + el.width + this.padding > this.width) {
                this.layoutCursorX = this.padding;
                this.layoutCursorY = this.rowHeight + this.spacing;
                this.rowHeight = 0;
            }

            el.x = this.layoutCursorX;
            el.y = this.layoutCursorY;

            this.layoutCursorX += el.width + this.spacing;
            this.rowHeight = Math.max(this.rowHeight, el.height)
        }

    }

    update() {
        this.panelRect = { x: this.x, y: this.y, width: this.width, height: this.height };
        for (const el of this.elements) el.update?.();
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#222";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#333";
        ctx.fillRect(this.x, this.y, this.width, 30);
        ctx.fillStyle = "#fff";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.name, this.x + this.width / 2, this.y + 30 / 2);

        for (const el of this.elements) {
            el.render(ctx);
        }
    }

    onMouseDown(e: MouseEvent) {
        const mx = e.offsetX;
        const my = e.offsetY;

        if (this.movable && IsMouseInside([mx, my], this.panelRect, 0, this.headerHeight)) {
            this.dragging = true;
            this.dragOffsetX = mx - this.x;
            this.dragOffsetY = my - this.y;
        }

        if (this.resizable && mx > this.x + this.width - this.resizeHandleSize && my > this.y + this.height - this.resizeHandleSize) {
            this.resizing = true;
            this.dragOffsetX = mx - this.x;
            this.dragOffsetY = my - this.y;
        }

        for (const el of this.elements) {
            el.onMouseDown?.(e);
        }
    }

    onMouseMove(e: MouseEvent) {
        const mx = e.offsetX;
        const my = e.offsetY;

        if (this.dragging) {
            this.x = mx - this.dragOffsetX;
            this.y = my - this.dragOffsetY;
        } else if (this.resizing) {
            this.width = mx - this.x;
            this.height = my - this.y;
            this.updateLayout();
        }

        for (const el of this.elements) {
            el.onMouseMove?.(e);
        }
    }

    onMouseUp(e: MouseEvent) {
        this.dragging = false;
        this.resizing = false;
        for (const el of this.elements) {
            el.onMouseUp?.(e);
        }
    }

    setWidth(newWidth: number) {
        this.width = newWidth;
        this.updateLayout();
    }

    setHeight(newHeight: number) {
        this.height = newHeight;
        this.updateLayout();
    }

}
