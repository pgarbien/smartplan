import Point from '../model/Point'

function getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent): Point {
    const canvasRect = canvas.getBoundingClientRect();

    const cursorPosition: Point = {
        x: event.clientX - canvasRect.left,
        y: event.clientY - canvasRect.top
    }

    return cursorPosition;
}

export { getCursorPosition }