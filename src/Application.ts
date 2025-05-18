import { Panel } from "./UI/Panel";
import { UIManager } from "./UIManager";

export class Application {
	public canvas: HTMLCanvasElement;
	public ui: UIManager;
	private gl: WebGLRenderingContext;
	private mouseX = 0;
	private mouseY = 0;
	private mousePressed = false;

	constructor() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		const gl = this.canvas.getContext("webgl");
		if (!gl) {
			throw new Error("Webgl not supported...");
		}
		this.gl = gl;

		this.ui = new UIManager(gl, this.canvas);

		this.canvas.addEventListener("mousemove", (e) => {
			this.mouseX = e.clientX;
			this.mouseY = e.clientY;
		});

		this.canvas.addEventListener("mousedown", () => {
			this.mousePressed = true;
		});

		this.canvas.addEventListener("mouseup", () => {
			this.mousePressed = false;
		});

		this.loop = this.loop.bind(this);
		requestAnimationFrame(this.loop);
	}

	private loop() {
		this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this.ui.update(this.mouseX, this.mouseY, this.mousePressed);
		this.ui.render();

		requestAnimationFrame(this.loop);
	}

	addPanel(id: number, x: number, y: number, width: number, height: number) {
		const panel = new Panel(id, x, y, width, height);
		this.ui.panels.push(panel);
	}
}
