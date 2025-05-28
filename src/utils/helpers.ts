export type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function IsMouseInside(mouseCoords: [number, number], rect: Rect, offsetX?: number, offsetY?: number): boolean {
    let [mx, my] = mouseCoords;
    let { x, y, width, height } = rect;

    if (offsetX && !offsetY) {
        return mx > x && mx < x + offsetX && my > y && my < y + height;
    } else if (offsetY && !offsetX) {
        return mx > x && mx < x + width && my > y && my < y + offsetY;
    } else if (offsetX && offsetY) {
        return mx > x && mx < x + offsetX && my > y && my < y + offsetY;
    }

    return mx > x && mx < x + width && my > y && my < y + height;
}
