import BackgroundImage from './model/BackgroundImage'
import CanvasDrawer from './CanvasDrawer'
import Room, { RoomInterface } from './model/Room'
import Point from './model/Point'
import Command from './commands/Command';
import CreatorRooms from './CreatorRooms';
import BuildCommand from './commands/BuildCommand';
import { getCursorPosition } from './utils/CanvasUtils';
import DragCommand from './commands/DragCommand';
import AddDeviceCommand from './commands/AddDeviceCommand';
import NewDevice, { NewDeviceInterface } from './model/NewDevice';
import CreatorNewDevices from './CreatorNewDevices';

enum Commands {
    ADD_DEVICE,
    MOVE_ROOMS,
    DRAW
}

export default class Creator {
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private canvasDrawer: CanvasDrawer;

    private backgroundImage?: BackgroundImage;

    private creatorRooms: CreatorRooms = new CreatorRooms();
    private creatorDevices: CreatorNewDevices = new CreatorNewDevices();

    private commandIndex: number = -1;
    private commands: Command[] = [];

    private cmd: Commands = Commands.DRAW;

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

    getRooms() {
        return this.creatorRooms.getRooms();
    }

    setRooms(rooms: RoomInterface[]) {
        const newRooms: Room[] = [];

        rooms.forEach(room => {
            const points: Point[] = [];
            room.points.forEach(point => points.push(new Point(point.x, point.y)));

            newRooms.push(new Room(room.name, room.color, points));
        });

        this.creatorRooms.setRooms(newRooms);
    }

    getDevices() {
        return this.creatorDevices.getDevices();
    }

    setDevices(devices: NewDeviceInterface[]) {
        const newDevices: NewDevice[] = [];

        devices.forEach(device => {
            newDevices.push(new NewDevice(device.color, device.point, device.radius));
        });

        this.creatorDevices.setDevices(newDevices);
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
        this.canvasDrawer.drawDevices(this.creatorDevices.getDevices());
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

    draw() {
        this.cmd = Commands.DRAW;

        return new BuildCommand(this.creatorRooms, this.canvasDrawer);
    }

    moveRooms() {
        this.cmd = Commands.MOVE_ROOMS;

        return new DragCommand(this.creatorRooms, this.canvasDrawer);
    }

    addDeviceCommand() {
        this.cmd = Commands.ADD_DEVICE;

        const newDevice = new AddDeviceCommand(this.creatorDevices, this.creatorRooms, this.canvasDrawer);
        newDevice.drawNewDevice();

        return newDevice;
    }

    moveDeviceCommand() {
        this.cmd = Commands.ADD_DEVICE;

        return new AddDeviceCommand(this.creatorDevices, this.creatorRooms, this.canvasDrawer);
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
        switch(this.cmd) {
            case Commands.ADD_DEVICE:
                return new AddDeviceCommand(this.creatorDevices, this.creatorRooms, this.canvasDrawer);
            case Commands.DRAW:
                return new BuildCommand(this.creatorRooms, this.canvasDrawer);
            case Commands.MOVE_ROOMS:
                return new DragCommand(this.creatorRooms, this.canvasDrawer);
        }
    }

    private addCommandToHistory(command: Command) {
        if(command.action) {
            this.commands.splice(++this.commandIndex);
            this.commands.push(command);
        }
    }
}

//TODO Optymalizacja zdjęciem backgroundu podczas onmousemove (flaga)
//TODO Onmouse out (bug jak wyjedziesz poza canvas przenosząc pomieszczenie)