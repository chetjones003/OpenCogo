import { Application } from "./Application";
import { Command } from "./Commands/Commands";
import { Button } from "./UI/Button";
import { Panel } from "./UI/Panel";
import { UIManager } from "./UI/UIManager";

async function main() {
    const app = new Application();
    await app.init({
        background: "#111111",
        resizeTo: window,
    });
    app.canvas.style.position = "absolute";
    document.body.appendChild(app.canvas);

    const ui = new UIManager(app.context, app.canvas);

    const panel = new Panel("Panel", 50, 50, 200, 150, true, false);
    panel.add(
        new Button(50, 25, "Line", () => {
            console.log("Line command started...");
            app.currentCommand = Command.LINE;
        })
    );
    panel.add(
        new Button(50, 25, "Circle", () => {
            console.log("Circle command started...");
        })
    );

    ui.addPanel(panel);

    function frame() {
        app.clear();
        app.render();
        ui.update();
        ui.render();
        requestAnimationFrame(frame);
    }
    frame();
}

main();
