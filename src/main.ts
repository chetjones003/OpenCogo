import { Application } from "./Application.ts";
import { Button } from "./UI/Button.ts";

const app = new Application();
app.canvas.style.position = "absolute";
document.body.appendChild(app.canvas);

app.addPanel(1, 100, 100, 300, 300);

{
	const panel = app.ui.getPanel(1);
	const button = new Button(0, 0, 300, 30, "Button 1", () => {
		console.log("Button 1 clicked");
	});
	if (panel) {
		panel.addChild(button);
	}
}
