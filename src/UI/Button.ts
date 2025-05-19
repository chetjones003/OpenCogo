import { UIElement } from "./UIElement";

export class Button extends UIElement {
	x: number = 0;
	y: number = 0;
	label: string;
	onClick: () => void;

	constructor(
		width: number,
		height: number,
		label: string,
		onClick: () => void
	) {
		super(0, 0, width, height);
		this.label = label;
		this.onClick = onClick;
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = "#555";
		ctx.fillRect(this.globalX, this.gloablY, this.width, this.height);
		ctx.fillStyle = "#fff";
		ctx.font = "14px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(
			this.label,
			this.globalX + this.width / 2,
			this.gloablY + this.height / 2
		);
	}

	onMouseDown(e: MouseEvent): void {
		const mx = e.offsetX;
		const my = e.offsetY;

		if (
			mx >= this.globalX &&
			mx <= this.globalX + this.width &&
			my >= this.gloablY &&
			my <= this.gloablY + this.height
		) {
			this.onClick();
		}
	}
}
