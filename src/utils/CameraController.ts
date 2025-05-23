import type { Coord } from "../Entities/Coord";

export class CameraController {
    position: Coord = { x: 0, y: 0 };
    zoom: number = 1;

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
}
