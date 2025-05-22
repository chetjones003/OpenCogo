import type { Coord } from "./Coord";
import { Entity } from "./Entity";

export class Line extends Entity {
    public start: Coord;
    public end: Coord;

    constructor(start: Coord, end: Coord) {
        super();
        this.start = start;
        this.end = end;
    }
}

export class Lines {
    static lineArray: Line[] = [];

    static Append(line: Line) {
        this.lineArray.push(line);
    }

    static printAll() {
        for (const line of this.lineArray) {
            console.log(line);
        }
    }
}
