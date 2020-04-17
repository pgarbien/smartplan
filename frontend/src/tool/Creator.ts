import BackgroundImage from './model/BackgroundImage'
import CanvasDrawer from './CanvasDrawer'
import Room, { RoomInterface } from './model/Room'
import Point from './model/Point'
import Command from './commands/Command';
import CreatorRooms from './CreatorRooms';
import AddRoomPointCommand from './commands/AddRoomPointCommand';
import { getCursorPosition } from './utils/CanvasUtils';
import DragRoomCommand from './commands/DragRoomCommand';

export default class Creator {
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private canvasDrawer: CanvasDrawer;

    private backgroundImage?: BackgroundImage;

    private creatorRooms: CreatorRooms = new CreatorRooms();

    private commandIndex: number = -1;
    private commands: Command[] = [];

    private tool: Boolean = true;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvasContext = canvas.getContext("2d")!!;
        this.canvasDrawer = new CanvasDrawer(this.canvasContext);

        this.canvas.addEventListener('click', this.onClick);
        this.canvas.addEventListener('contextmenu', this.onRightClick);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener("mouseup", this.onMouseUp);
    }

    setTool() {
        this.tool = !this.tool;
    }

    getRooms() {
        return this.creatorRooms.getRooms();
    }

    setRooms(rooms: RoomInterface[]) {
        const newRooms: Room[] = [];

        rooms.forEach(room => {
            newRooms.push(new Room(room.name, room.color, room.points));
        });

        this.creatorRooms.setRooms(newRooms);
    }

    setBackgroundImage(imageSource: string) {
        this.backgroundImage = new BackgroundImage(imageSource);

        setTimeout(() => {
            this.drawCanvas()
        }, 200);
    }

    toggleBackgroundImage() {
        this.backgroundImage?.toggleImageLoaded();
        this.drawCanvas();
    }

    drawCanvas() {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if(this.backgroundImage && this.backgroundImage.isImageLoaded()) {
            this.canvasDrawer.drawBackground(this.backgroundImage!!, this.canvas.height, this.canvas.width);
        }
        this.canvasDrawer.drawRooms(this.creatorRooms.getRooms());
        this.canvasDrawer.drawRoom(this.creatorRooms.getCurrentRoom(), true, true);
    }

    redoCommand() {
        if(this.commandIndex < this.commands.length - 1) {
            this.commands[++this.commandIndex].redo();
        }
        this.drawCanvas();
    }

    undoCommand() {
        if(this.commandIndex >= 0) {
            this.commands[this.commandIndex--].undo();
        }
        this.drawCanvas();
    }

    private onClick = (event: MouseEvent) => {
        const command = this.getCommand();
        const cursorPosition: Point = getCursorPosition(this.canvas, event);

        command.onClick(cursorPosition);
        this.addCommandToHistory(command);
        this.drawCanvas();
    }

    private onRightClick = (event: MouseEvent) => {
        event.preventDefault();
        const command = this.getCommand();
        const cursorPosition: Point = getCursorPosition(this.canvas, event);

        command.onRightClick(cursorPosition);
        this.addCommandToHistory(command);
        this.drawCanvas();
    }

    private onMouseMove = (event: MouseEvent) => {
        this.drawCanvas();
        const command = this.getCommand();
        const cursorPosition: Point = getCursorPosition(this.canvas, event);

        command.onMove(cursorPosition);
        this.addCommandToHistory(command);
    }

    //TODO this can't be a class attribute
    private command?: Command;
    private onMouseDown = (event: MouseEvent) => {
        const command = this.getCommand();
        const cursorPosition: Point = getCursorPosition(this.canvas, event);

        command.onDown(cursorPosition);
        this.command = command;
        this.drawCanvas();

        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener("mousemove", this.onMouseMoveDown);
    }

    private onMouseMoveDown = (event: MouseEvent) => {
        const cursorPosition: Point = getCursorPosition(this.canvas, event);
        this.command!!.onDownMove(cursorPosition);
        this.drawCanvas();
    }

    private onMouseUp = (event: MouseEvent) => {
        const cursorPosition: Point = getCursorPosition(this.canvas, event);
        this.command!!.onUp(cursorPosition);
        this.addCommandToHistory(this.command!!);
        this.drawCanvas();

        this.canvas.removeEventListener("mousemove", this.onMouseMoveDown);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
    }

    private getCommand(): Command {
        switch(this.tool) {
            case false:
                return new DragRoomCommand(this.creatorRooms, this.canvasDrawer);
        }

        return new AddRoomPointCommand(this.creatorRooms, this.canvasDrawer);
    }

    private addCommandToHistory(command: Command) {
        if(command.action) {
            this.commands.splice(++this.commandIndex);
            this.commands.push(command);
        }
    }
}

//Optymalizacja zdjęciem backgroundu podczas onmousemove (flaga)
