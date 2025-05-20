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

	private layoutCursorX = 0;
	private layoutCursorY = 30;
	private rowHeight = 0;
	private padding = 0;
	private spacing = 5;

	constructor( name: string, x: number, y: number, width: number, height: number ) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.panelRect = {x: this.x, y: this.y, width: this.width, height: this.height};
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

	update() {
		this.panelRect = {x: this.x, y: this.y, width: this.width, height: this.height};
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

		if (IsMouseInside([mx, my], this.panelRect, 0, 20)) {
			this.dragging = true;
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
		}

		for (const el of this.elements) {
			el.onMouseMove?.(e);
		}
	}

	onMouseUp(e: MouseEvent) {
		this.dragging = false;
		for (const el of this.elements) {
			el.onMouseUp?.(e);
		}
	}
}
