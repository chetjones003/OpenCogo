import type { Coord } from "../Entities/Coord";
import { Lines } from "../Entities/Line";

export class SnapManager {
    snapCandidate: Coord | null = null;

    private snapRadius: number = 15;

    findSnapPoint(cursor: Coord): Coord | null {
        for (const line of Lines.lineArray) {
            const endpoints = [line.start, line.end];
            for (const pt of endpoints) {

                if (Lines.lineEndPoints.length > 0 && this.pointsEqual(pt, Lines.lineEndPoints[0])) {
                    continue;
                }

                const dx = pt.x - cursor.x;
                const dy = pt.y - cursor.y;

                const distSq = Math.pow(dx, 2) + Math.pow(dy, 2);

                if (distSq <= Math.pow(this.snapRadius, 2)) {
                    return pt
                }
            }
        }
        return null;
    }

    private pointsEqual(a: Coord, b: Coord): boolean {
        return a.x === b.x && a.y === b.y;
    }
}
