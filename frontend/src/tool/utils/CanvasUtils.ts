import Point from '../model/Point'

function getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent): Point {
    const canvasRect = canvas.getBoundingClientRect();

    const cursorPosition: Point = new Point(
        event.clientX - canvasRect.left,
        event.clientY - canvasRect.top
    );

    return cursorPosition;
}

export { getCursorPosition }