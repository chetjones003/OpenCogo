import type { Coord } from "../Entities/Coord";
import type { InputHandler } from "../Input/InputManager";

export class CameraController implements InputHandler {
    position: Coord = { x: 0, y: 0 };
    zoom: number = 1;
    panning: boolean = false;

    screenToWorld(screen: Coord): Coord {
        return {
            x: screen.x / this.zoom + this.position.x,
            y: screen.y / this.zoom + this.position.y,
        };
    }

    worldToScreen(world: Coord): Coord {
        return {
            x: (world.x - this.position.x) * this.zoom,
            y: (world.y - this.position.y) * this.zoom,
        };
    }

    isPanning(): boolean {
        return this.panning
    }

    onMouseDown(e: MouseEvent): void {
        if (e.button === 1) {
            this.panning = true;
        }
    }

    onMouseUp(e: MouseEvent): void {
        if (e.button === 1) {
            this.panning = false;
        }
    }
}
