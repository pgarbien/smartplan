import BackgroundImage from './model/BackgroundImage'
import CanvasDrawer from './CanvasDrawer'
import Room, { RoomInterface } from './model/Room'
import Point from './model/Point'
import Command from './commands/Command';
import CreatorRooms from './CreatorRooms';
import AddRoomPointCommand from './commands/AddRoomPointCommand';
import { getCursorPosition } from './utils/CanvasUtils';

export default class Creator {
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private canvasDrawer: CanvasDrawer;

    private backgroundImage?: BackgroundImage;

    private creatorRooms: CreatorRooms = new CreatorRooms();

    private commandIndex: number = -1;
    private commands: Command[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvasContext = canvas.getContext("2d")!!;
        this.canvasDrawer = new CanvasDrawer(this.canvasContext);

        canvas.addEventListener('click', this.onClick.bind(this));
        canvas.addEventListener('contextmenu', this.onRightClick.bind(this));
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
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

    private onClick(event: MouseEvent) {
        const cursorPosition: Point = getCursorPosition(this.canvas, event);

        const command = new AddRoomPointCommand(this.creatorRooms, cursorPosition, this.canvasDrawer);

        command.onClick();
        this.addCommand(command);
    }

    private onRightClick(event: MouseEvent) {
        event.preventDefault();
        const cursorPosition: Point = getCursorPosition(this.canvas, event);

        const command = new AddRoomPointCommand(this.creatorRooms, cursorPosition, this.canvasDrawer);

        command.onRightClick();
        this.addCommand(command);
    }

    private onMouseMove(event: any) {
        this.drawCanvas();
        const cursorPosition: Point = getCursorPosition(this.canvas, event);

        const command = new AddRoomPointCommand(this.creatorRooms, cursorPosition, this.canvasDrawer);

        command.onMove();
        this.addCommand(command,false);
    }

    private addCommand(command: Command, redraw: Boolean = true) {
        if(command.action) {
            this.commands.splice(++this.commandIndex);
            this.commands.push(command);
        }

        if(redraw) { 
            this.drawCanvas();
        }
    }
}

//Optymalizacja zdjęciem backgroundu podczas onmousemove (flaga)
