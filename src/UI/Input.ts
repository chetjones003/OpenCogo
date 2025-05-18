import { drawRect } from "../GL/util";
import { UIElement } from "./UIElement";

export class Input extends UIElement {
	private value: string;
	private focused = false;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		initialValue: string = ""
	) {
		super(x, y, width, height);
		this.value = initialValue;
	}

	update(
		mouseX: number,
		mouseY: number,
		isPressed: boolean,
		parentX: number,
		parentY: number
	): void {
		const inside =
			mouseX >= parentX + this.x &&
			mouseX <= parentX + this.width &&
			mouseY >= parentY + this.y &&
			mouseY <= parentY + this.height;

		if (isPressed && inside) this.focused = true;
		else if (isPressed) this.focused = false;
	}

	handleKey(e: KeyboardEvent) {
		if (!this.focused) return;
		if (e.key.length === 1) this.value += e.key;
		else if (e.key === "Backspace") this.value = this.value.slice(0, -1);
	}

	render(gl: WebGLRenderingContext, parentX: number, parentY: number): void {
		drawRect(
			gl,
			parentX + this.x,
			parentY + this.y,
			this.width,
			this.height,
			[0.2, 0.2, 0.5, 1]
		);
		// TODO: show this.value
	}

	getValue(): string {
		return this.value;
	}
}
