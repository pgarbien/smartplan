import { Commands } from './commands/Commands';
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
import ManageCommand from './commands/ManageCommand';
import MoveDeviceCommand from './commands/MoveDeviceCommand';

export default class Creator {
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private canvasDrawer: CanvasDrawer;

    private backgroundImage?: BackgroundImage;

    private creatorRooms: CreatorRooms = new CreatorRooms();
    private creatorDevices: CreatorNewDevices = new CreatorNewDevices();
    private creatorAddedDevices: CreatorNewDevices = new CreatorNewDevices();

    private commandIndex: number = -1;
    private commands: Command[] = [];
    private cmd: Commands = Commands.DRAW;

    private callbacks: Map<String, Function> = new Map();

    //TODO TMP
    highlightedDevice = null

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvasContext = canvas.getContext("2d")!!;
        this.canvasDrawer = new CanvasDrawer(this.canvasContext);

        this.canvas.addEventListener('click', this.onClick);
        this.canvas.addEventListener('contextmenu', this.onRightClick);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener("mouseup", this.onMouseUp);

        this.canvas.height = canvas.clientHeight
        this.canvas.width = canvas.clientWidth
    }

    getCanvas = () => this.canvas;
    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvasContext = canvas.getContext("2d")!!;
        this.canvasDrawer = new CanvasDrawer(this.canvasContext);

        this.canvas.addEventListener('click', this.onClick);
        this.canvas.addEventListener('contextmenu', this.onRightClick);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener("mouseup", this.onMouseUp);

        this.canvas.height = canvas.clientHeight
        this.canvas.width = canvas.clientWidth
    }

    getRooms = () => this.creatorRooms.getRooms();
    setRooms(rooms: RoomInterface[]) {
        const newRooms: Room[] = [];

        rooms.forEach(room => {
            const points: Point[] = [];
            room.points.forEach(point => points.push(new Point(point.x, point.y)));

            newRooms.push(new Room(room.name, room.color, points));
        });

        this.creatorRooms.setRooms(newRooms);
    }

    getDevices = () => this.creatorDevices.getDevices();
    setDevices(devices: NewDeviceInterface[]) {
        const newDevices: NewDevice[] = [];
        devices.forEach(device => {
            const newDevice = new NewDevice(device.name, device.color, device.id, device.point!)
            newDevices.push(newDevice);
        });

        this.creatorDevices.setDevices(newDevices);
    }

    getAddedDevices = () => this.creatorAddedDevices.getDevices();
    setAddedDevices(devices: NewDeviceInterface[]) {
        const newDevices: NewDevice[] = [];

        devices.forEach(device => {
            const newDevice = new NewDevice(device.name, device.color, device.id, device.point)
            newDevices.push(newDevice);
        });

        this.creatorAddedDevices.setDevices(newDevices);
    }


    getBackgroundImage = () => this.backgroundImage
    setBackgroundImage(imageSource: string) {
        this.backgroundImage = new BackgroundImage(imageSource);

        setTimeout(() => {
            this.drawCanvas()
        }, 200);
    }

    setCallback = (name: String, callback: Function) => this.callbacks.set(name, callback);
    setCommand = (command: Commands) => this.cmd = command;

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
        this.canvasDrawer.drawDevices(this.creatorAddedDevices.getDevices(), this.highlightedDevice);
    }

    addDevice(deviceName: string, color: string, deviceId: string, position: Point, roomId: string, locationId: string, levelId: string) {
        const newDevice = new AddDeviceCommand(this.creatorDevices, this.creatorAddedDevices, this.creatorRooms, this.canvasDrawer);
        newDevice.drawNewDevice(deviceName, color, deviceId, position, roomId, locationId, levelId);
    }

    private onClick = (event: MouseEvent) => {
        const command = this.getCommand();
        const cursorPosition: Point = getCursorPosition(this.canvas, event);

        command.onClick(cursorPosition, this.callbacks.get('click'));
        this.addCommandToHistory(command);
        this.drawCanvas();
    }

    private onRightClick = (event: MouseEvent) => {
        event.preventDefault();
        const command = this.getCommand();
        const cursorPosition: Point = getCursorPosition(this.canvas, event);

        command.onRightClick(cursorPosition, this.callbacks.get('rightclick'));
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
        this.drawCanvas();
        const cursorPosition: Point = getCursorPosition(this.canvas, event);
        this.command!!.onDownMove(cursorPosition);   
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
                return new AddDeviceCommand(this.creatorDevices, this.creatorAddedDevices, this.creatorRooms, this.canvasDrawer);
            case Commands.MOVE_DEVICE:
                return new MoveDeviceCommand(this.creatorDevices, this.creatorAddedDevices, this.creatorRooms, this.canvasDrawer);
            case Commands.DRAW:
                return new BuildCommand(this.creatorRooms, this.canvasDrawer);
            case Commands.MOVE_ROOMS:
                return new DragCommand(this.creatorRooms, this.canvasDrawer);
            case Commands.MANAGE:
                return new ManageCommand(this.creatorRooms, this.creatorAddedDevices, this.canvasDrawer);
            default:
                return new BuildCommand(this.creatorRooms, this.canvasDrawer);
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
//TODO First/last point move wall bug