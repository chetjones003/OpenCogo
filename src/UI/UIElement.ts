import type { Panel } from "./Panel";

export abstract class UIElement {
	x: number;
	y: number;
	width: number;
	height: number;
	protected parent: Panel | null = null;

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	setParent(panel: Panel) {
		this.parent = panel;
	}

	get globalX() {
		return (this.parent?.x ?? 0) + this.x;
	}

	get globalY() {
		return (this.parent?.y ?? 0) + this.y;
	}

	abstract render(ctx: CanvasRenderingContext2D): void;
	onMouseDown?(e: MouseEvent): void;
	onMouseMove?(e: MouseEvent): void;
	onMouseUp?(e: MouseEvent): void;
	update?(): void;
}
