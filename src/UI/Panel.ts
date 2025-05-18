import { drawRect } from "../GL/util";
import type { UIElement } from "./UIElement";

export class Panel {
	id: number;
	x: number;
	y: number;
	width: number;
	height: number;
	private children: UIElement[] = [];

	constructor(
		id: number,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	update(mouseX: number, mouseY: number, mousePressed: boolean) {
		for (const child of this.children) {
			if ("update" in child) {
				(child as any).update(
					mouseX,
					mouseY,
					mousePressed,
					this.x,
					this.y
				);
			}
		}

		// TODO: Handle dragging/resizing
	}

	render(gl: WebGLRenderingContext) {
		drawRect(
			gl,
			this.x,
			this.y,
			this.width,
			this.height,
			[0.2, 0.2, 0.2, 1.0]
		);
		for (const child of this.children) {
			child.render(gl, this.x, this.y);
		}
	}

	addChild(child: UIElement) {
		this.children.push(child);
	}
}
