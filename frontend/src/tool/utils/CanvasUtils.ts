import Point from '../model/Point'

function getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent): Point {
    const canvasRect = canvas.getBoundingClientRect();

    const cursorPosition: Point = new Point(
        (event.clientX - canvasRect.left) / canvas.clientWidth,
        (event.clientY - canvasRect.top) / canvas.clientHeight
    );

    return cursorPosition;
}

export { getCursorPosition }