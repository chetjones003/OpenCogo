import { drawRect } from "../GL/util";
import { UIElement } from "./UIElement";

export class Button extends UIElement {
	private isHovered = false;
	public label: string;
	public onClick: () => void;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		label: string,
		onClick: () => void
	) {
		super(x, y, width, height);
		this.label = label;
		this.onClick = onClick;
	}

	update(
		mouseX: number,
		mouseY: number,
		isPressed: boolean,
		parentX: number,
		parentY: number
	) {
		const inside =
			mouseX >= parentX + this.x &&
			mouseX <= parentX + this.x + this.width &&
			mouseY >= parentY + this.y &&
			mouseY <= parentY + this.y + this.height;

		this.isHovered = inside;

		if (inside && isPressed) {
			this.onClick();
		}
	}

	render(gl: WebGLRenderingContext, parentX: number, parentY: number): void {
		const color: [number, number, number, number] = this.isHovered
			? [0.6, 0.6, 0.2, 1.0]
			: [0.4, 0.4, 0.1, 1.0];
		drawRect(
			gl,
			parentX + this.x,
			parentY + this.y,
			this.width,
			this.height,
			color
		);
		// TODO: Label Text
	}
}
