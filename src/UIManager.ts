import { Panel } from "./UI/Panel";

export class UIManager {
	private gl: WebGLRenderingContext;
	private canvas: HTMLCanvasElement;
	public panels: Panel[] = [];

	constructor(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
		this.gl = gl;
		this.canvas = canvas;
	}

	update(mouseX: number, mouseY: number, mousePressed: boolean) {
		for (const panel of this.panels) {
			panel.update(mouseX, mouseY, mousePressed);
		}
	}

	render() {
		for (const panel of this.panels) {
			panel.render(this.gl);
		}
	}

	getPanel(id: number): Panel | null {
		for (const panel of this.panels) {
			if (id === panel.id) {
				return panel;
			}
		}
		return null;
	}
}
