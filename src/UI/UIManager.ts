import type { Panel } from "./Panel";

export class UIManager {
	panels: Panel[] = [];
	private ctx: CanvasRenderingContext2D;
	private canvas: HTMLCanvasElement;

	constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
		this.ctx = ctx;
		this.canvas = canvas;

		this.canvas.addEventListener(
			"mousedown",
			this.handleMouseDown.bind(this)
		);
		this.canvas.addEventListener(
			"mousemove",
			this.handleMouseMove.bind(this)
		);
		this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
	}

	addPanel(panel: Panel) {
		this.panels.push(panel);
	}

	update() {
		for (const panel of this.panels) {
			panel.update();
		}
	}

	render() {
		for (const panel of this.panels) {
			panel.render(this.ctx);
		}
	}

	handleMouseDown(e: MouseEvent) {
		for (const panel of this.panels) {
			panel.onMouseDown(e);
		}
	}

	handleMouseMove(e: MouseEvent) {
		for (const panel of this.panels) {
			panel.onMouseMove(e);
		}
	}

	handleMouseUp(e: MouseEvent) {
		for (const panel of this.panels) {
			panel.onMouseUp(e);
		}
	}
}
