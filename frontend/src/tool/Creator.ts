import BackgroundImage from './model/BackgroundImage'
import CanvasDrawer from './CanvasDrawer'
import Room, { RoomInterface } from './model/Room'
import Point from './model/Point'
import Command from './commands/Command';
import CreatorRooms from './CreatorRooms';
import AddRoomPointCommand from './commands/AddRoomPointCommand';

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
        }, 10);
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
        const command = new AddRoomPointCommand(this.creatorRooms, event, this.canvasDrawer);

        command.onClick();
        this.addCommand(command);
    }

    private onRightClick(event: MouseEvent) {
        event.preventDefault();
        const command = new AddRoomPointCommand(this.creatorRooms, event, this.canvasDrawer);

        command.onRightClick();
        this.addCommand(command);
    }

    private onMouseMove(event: any) {
        this.drawCanvas();
        const command = new AddRoomPointCommand(this.creatorRooms, event, this.canvasDrawer);

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

// function movePointer(event: any) {
//     clearCanvas();
//     const polygon = getRoomIndex(event.layerX, event.layerY);
//     if(polygon) {
//         document.getElementById('name')!!.innerText = currentRooms[polygon].name + " " + (Math.round(calculateRoomArea(currentRooms[polygon].points)/250)/10) + "m^2";
//     }

//     if(currentRoom.length !== 0) {
//         ctx!!.moveTo(currentRoom[currentRoom.length -1].x, currentRoom[currentRoom.length -1].y);   
//         ctx!!.strokeStyle = "0, 209, 81";
//         ctx!!.lineWidth = 2;
        
//         const point = getCloseOrInLine(event.layerX, event.layerY);
//         ctx!!.lineTo(point.x, point.y);
//         ctx!!.stroke();
        
//         const close = getClose(event.layerX, event.layerY);
//         if(close) {
//             highlightPoint(close.x, close.y);
//         }

//         const inLine = getInLine(point.x, point.y);
//         if(inLine) {
//             inLine.forEach(linedPoint => {
//                 ctx!!.beginPath();
//                 ctx!!.moveTo(point.x, point.y);
//                 ctx!!.lineTo(linedPoint.x, linedPoint.y);
//                 ctx!!.closePath();
//                 ctx!!.stroke();
//                 highlightPoint(linedPoint.x, linedPoint.y)
//             });
//         }
//     } else {
//         let close = getClose(event.layerX, event.layerY);

//         if(close) {
//             highlightPoint(close.x, close.y);
//         }
//     }
// };