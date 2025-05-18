import { drawRect } from "../GL/util";
import { UIElement } from "./UIElement";

export class Label extends UIElement {
	text: string;
	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		text: string
	) {
		super(x, y, width, height);
		this.text = text;
	}

	update() {
		// No interaction
	}

	render(gl: WebGLRenderingContext, parentX: number, parentY: number): void {
		drawRect(
			gl,
			parentX + this.x,
			parentY + this.y,
			this.width,
			this.height,
			[0.3, 0.3, 0.3, 1]
		);
		// TODO: Text Rendering
	}
}
