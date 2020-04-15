import Command from './Command'

export default class AddPointCommand extends Command {
    onClick(): void {
        this.action = Math.random();
    }

    onRightClick(): void {

    }

    onMove(): void {

    }

    undo(): void {

    }

    redo(): void {

    }
}