export abstract class UIElement {
	x: number;
	y: number;
	width: number;
	height: number;

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	abstract update(
		mouseX: number,
		mouseY: number,
		isPressed: boolean,
		parentX: number,
		parentY: number
	): void;
	abstract render(
		gl: WebGLRenderingContext,
		parentX: number,
		parentY: number
	): void;
}
