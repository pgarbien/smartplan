export default abstract class Command {
    action: any

    abstract onClick(): void;
    abstract onRightClick(): void;
    abstract onMove(): void;
    abstract undo(): void;
    abstract redo(): void;
}