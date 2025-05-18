export function drawRect(
	gl: WebGLRenderingContext,
	x: number,
	y: number,
	width: number,
	height: number,
	color: [number, number, number, number]
) {
	gl.enable(gl.SCISSOR_TEST);
	gl.scissor(x, gl.canvas.height - y - height, width, height);
	gl.clearColor(...color);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.disable(gl.SCISSOR_TEST);
}
