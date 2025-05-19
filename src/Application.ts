type InitOptions = {
	background?: string;
	resizeTo?: Window | HTMLElement;
};

export class Application {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	background: string = "#000000";

	private resizeTarget?: Window | HTMLElement | null = null;

	constructor() {
		this.canvas = document.createElement("canvas");
		const context = this.canvas.getContext("2d");
		if (!context) {
			throw new Error("Failed to get canvas context");
		}
		this.context = context;
	}

	async init(options: InitOptions = {}) {
		if (options.background) this.background = options.background;
		if (options.resizeTo) this.resizeTarget = options.resizeTo;

		this.resizeCanvas();
		this.clear();

		// Resize Listener
		if (this.resizeTarget instanceof Window) {
			window.addEventListener("resize", () => this.resizeCanvas());
		} else if (this.resizeTarget instanceof HTMLElement) {
			new ResizeObserver(() => this.resizeCanvas()).observe(
				this.resizeTarget
			);
		}
	}

	clear() {
		this.context.fillStyle = this.background;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	private resizeCanvas() {
		if (this.resizeTarget instanceof Window) {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		} else if (this.resizeTarget instanceof HTMLElement) {
			const rect = this.resizeTarget.getBoundingClientRect();
			this.canvas.width = rect.width;
			this.canvas.height = rect.height;
		}
		this.clear();
	}
}
