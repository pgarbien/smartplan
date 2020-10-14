import Point from "../model/Point";

interface Action {
    type: string,
    cursorPosition: Point,
    details: any
}

export default abstract class Command {
    action?: Action

    abstract onClick(cursorPosition: Point, callback?: Function): void;
    abstract onRightClick(cursorPosition: Point): void;
    abstract onMove(cursorPosition: Point): void;
    abstract onDown(cursorPosition: Point): void;
    abstract onDownMove(cursorPosition: Point): void;
    abstract onUp(cursorPosition: Point): void;
    abstract undo(): void;
    abstract redo(): void;
}

export type { Action }