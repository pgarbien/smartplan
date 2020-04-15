import { Rooms } from './rooms'
import BackgroundImage from './BackgroundImage'
import CanvasDrawer from './CanvasDrawer'
import Room from './Room'
import Command from './commands/Command';
import AddPointCommand from './commands/AddPointCommand';

export default class Creator {
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private canvasDrawer: CanvasDrawer;

    private backgroundImage?: BackgroundImage;

    private rooms: Room[] = [];
    private room: Room = new Room();

    private commandIndex: number = -1;
    private commands: Command[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvasContext = canvas.getContext("2d")!!;
        this.canvasDrawer = new CanvasDrawer(this.canvasContext);

        canvas.addEventListener('click', this.onClick.bind(this));
    }

    setRooms(rooms: Room[]) {
        this.rooms = rooms.slice();
    }

    getRooms() {
        return this.rooms;
    }

    setBackgroundImage(imageSource: string) {
        this.backgroundImage = new BackgroundImage(imageSource);

        setTimeout(() => {
            this.drawCanvas()
        }, 1000)
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
        this.canvasDrawer.drawRooms(this.rooms);
    }

    redoCommand() {
        if(this.commandIndex < this.commands.length - 1) {
            this.commands[++this.commandIndex].redo();
        }
    }

    undoCommand() {
        if(this.commandIndex >= 0) {
            this.commands[this.commandIndex--].undo();
        }
    }

    private onClick() {
        const command = new AddPointCommand();
        command.onClick();
        if(command.action) {
            this.commands.splice(++this.commandIndex);
            this.commands.push(command);
        }
    }
}

//Optymalizacja zdjęciem backgroundu podczas onmousemove (flaga)

//DONE
let c: any;
let ctx: any;
let stx: any;
let img: any;

//DONE
let currentRoom: any[] = [];
let currentRooms: any[];
let showImage = true;
let highlighted = -1;

const defaultRoomName = "Pokój #";
const defaultRoomColor = "128, 128, 128";

//DONE
const start = (a: any, b: any, d: any, e: any) => {
    c = a;
    ctx = b;
    stx = d;
    img = e;

    currentRooms = Rooms.slice();

    setBlueprintImage();
    drawRooms(ctx);
    drawRooms(stx);

    c[0].addEventListener('click', addNewPoint);
    c[0].addEventListener('contextmenu', removePointedRoom);
    c[0].addEventListener('mousemove', movePointer);
};

//MouseEvent
function removePointedRoom(event: any) {
    event.preventDefault();
    if(currentRoom.length !== 0) {
        currentRoom.splice(currentRoom.length - 1, 1);
    } else {
        const polygon = getRoomIndex(event.layerX, event.layerY);
        if(polygon !== null) {
            removeRoom(polygon);
        }
    }
    clearCanvas();
}

function addNewPoint(event: any) {
    if(currentRoom.length === 0) {
        let close = getClose(event.layerX, event.layerY);
        close === null ? addRoomPoint(event.layerX, event.layerY) : addRoomPoint(close.x, close.y);
    } else if (Math.abs(currentRoom[0].x - event.layerX) < 10 && Math.abs(currentRoom[0].y - event.layerY) < 10) {
        currentRooms.push({
            name: defaultRoomName + currentRooms.length,
            color: defaultRoomColor,
            points: currentRoom
        });
        
        addRoomPoint(currentRoom[0].x, currentRoom[0].y);
        currentRoom = [];
    } else {
        const point = getCloseOrInLine(event.layerX, event.layerY);
        addRoomPoint(point.x, point.y);
    }
}

function addRoomPoint(x: number, y: number) {
    currentRoom.push({ x: x, y: y });
    ctx!!.moveTo(x, y);
    clearCanvas();
}

function movePointer(event: any) {
    clearCanvas();
    const polygon = getRoomIndex(event.layerX, event.layerY);
    if(polygon) {
        document.getElementById('name')!!.innerText = currentRooms[polygon].name + " " + (Math.round(calculateRoomArea(currentRooms[polygon].points)/250)/10) + "m^2";
    }

    if(currentRoom.length !== 0) {
        ctx!!.moveTo(currentRoom[currentRoom.length -1].x, currentRoom[currentRoom.length -1].y);   
        ctx!!.strokeStyle = "0, 209, 81";
        ctx!!.lineWidth = 2;
        
        const point = getCloseOrInLine(event.layerX, event.layerY);
        ctx!!.lineTo(point.x, point.y);
        ctx!!.stroke();
        
        const close = getClose(event.layerX, event.layerY);
        if(close) {
            highlightPoint(close.x, close.y);
        }

        const inLine = getInLine(point.x, point.y);
        if(inLine) {
            inLine.forEach(linedPoint => {
                ctx!!.beginPath();
                ctx!!.moveTo(point.x, point.y);
                ctx!!.lineTo(linedPoint.x, linedPoint.y);
                ctx!!.closePath();
                ctx!!.stroke();
                highlightPoint(linedPoint.x, linedPoint.y)
            });
        }
    } else {
        let close = getClose(event.layerX, event.layerY);

        if(close) {
            highlightPoint(close.x, close.y);
        }
    }
};

//DONE
function calculateRoomArea(vertices: any[]) {
    var totalArea = 0;

    for (var i = 0, l = vertices.length; i < l; i++) {
        var addX = vertices[i].x;
        var addY = vertices[i === vertices.length - 1 ? 0 : i + 1].y;
        var subX = vertices[i === vertices.length - 1 ? 0 : i + 1].x;
        var subY = vertices[i].y;

        totalArea += (addX * addY * 0.5);
        totalArea -= (subX * subY * 0.5);
    }

    return Math.abs(totalArea);
}

function getRoomIndex(x: number, y: number) {
    for(let k=0; k<currentRooms.length; ++k) {
        let inside = false;
        const points = currentRooms[k].points;

        for (let i=0, j=points.length-1; i<points.length; j=i++) {
            var xi = points[i].x, yi = points[i].y;
            var xj = points[j].x, yj = points[j].y;

            var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        if(inside) {
            setHighlighted(k);
            return k;
        }
    }

    setHighlighted();
    return null;
};

function getClose(x: number, y: number) {
    const closePoint = currentRooms
        .flatMap(currentRoom => currentRoom.points)
        .find(point => Math.abs(point.x - x) < 10 && Math.abs(point.y - y) < 10);
    return closePoint ? closePoint : null;
}

function getInLine(x: number, y: number) {
    const inLine = currentRooms
        .flatMap(currentRoom => currentRoom.points)
        .filter(point => point.x === x || point.y === y);
    return inLine ? inLine : [];
}

function getCloseOrInLine(x: number, y: number) {
    const close = getClose(x, y);

    if(close) {
        x = close.x;
        y = close.y;
    } else {
        //Line vertically or horizontally with previous point
        x = (Math.abs(currentRoom[currentRoom.length-1].x - x) < 10) ? currentRoom[currentRoom.length-1].x : x;
        y = (Math.abs(currentRoom[currentRoom.length-1].y - y) < 10) ? currentRoom[currentRoom.length-1].y : y;
        //Line vertically or horizontally with starting point
        x = (Math.abs(currentRoom[0].x - x) < 10) ? currentRoom[0].x : x;
        y = (Math.abs(currentRoom[0].y - y) < 10) ? currentRoom[0].y : y;
    }

    return {x: x, y: y}
}

function highlightPoint(x: number, y: number) {
    ctx!!.beginPath();
    ctx!!.lineWidth = 1;
    ctx!!.arc(x, y, 10, 0, 2 * Math.PI);
    ctx!!.closePath();
    ctx!!.stroke();
}

//DONE
function drawRooms(ctx: any) {
    const list = document.getElementById('list');
    list!!.innerHTML = "";

    currentRooms.forEach((currentRoom, index) => {
        // drawRoom(ctx, currentRoom, index === highlighted);
        if(index !== highlighted) {
            drawRoom(ctx, currentRoom);
        }
        list!!.innerHTML += 
            `<div id="${index}" onmouseenter="setHighlighted(${index})" onmouseleave="setHighlighted()">
                ${index}. ${currentRoom.name} - ${Math.round(calculateRoomArea(currentRoom.points)/250)/10} m^2 
                <button onClick="removeRoom(${index})">USUŃ</button>
            </div>`;
    });

    if(highlighted >= 0) {
        drawRoom(ctx, currentRooms[highlighted], true);
    }
}

function setHighlighted(index?: number) {
    if(index && currentRoom.length === 0) {
        highlighted = index;
    } else {
        highlighted = -1;
    }
    clearCanvas();
}

//DONE
function drawRoom(ctx: any, roomToDraw?: any, highlighted?: boolean) {
    const points = roomToDraw ? roomToDraw.points : currentRoom
    if(points.length !== 0) {
        ctx.beginPath(); 
        ctx.lineWidth = 5;
        ctx.strokeStyle = roomToDraw && !highlighted ? "rgba(" + roomToDraw.color + ", 1)" : "rgba(0, 209, 81, .7)";
        ctx.fillStyle = roomToDraw && !highlighted? "rgba(" + roomToDraw.color + ", 0.5)" : "rgba(0, 209, 81, .7)";
        ctx.lineJoin = 'miter';
        ctx.moveTo(points[0].x, points[0].y);
        for(let i=1; i<points.length; ++i) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        if(roomToDraw) {
            ctx.fill();
        }
    }
}

//DONE
function setBlueprintImage() {
    let height, width, top, left, canvasHeight = c[0].height, canvasWidth = c[0].width;
    const ratio = img.height/img.width;
    if(img.width > img.height) {
        width = canvasWidth;
        height = canvasHeight*ratio;
        top = (canvasHeight - height)/2;
        left = 0;
    } else {
        height = canvasHeight;
        width = canvasWidth/ratio;
        top = 0;
        left = (canvasWidth - width)/2;
    }

    ctx.drawImage(img, left, top, width, height);
}

//DONE
function changeBlueprintImage() {
    document.getElementsByTagName("img")[0]!!.src = document.getElementsByTagName('input')[0]!!.value;
    clearCanvas();
}

//DONE
function clearCanvas() {
    ctx!!.clearRect(0, 0, c[0].width, c[0].height);
    stx!!.clearRect(0, 0, c[1].width, c[1].height);
    if(showImage) {
        setBlueprintImage();
    } 
    drawRooms(ctx);
    drawRooms(stx);
    drawRoom(ctx);
}

function removeRoom(index: number) {
    currentRooms.splice(index, 1);
    setHighlighted();
    clearCanvas();
}

//DONE
function toggleImage() {
    showImage = !showImage;
    clearCanvas();
}

function reset() {
    currentRooms = Rooms.slice();
    clearCanvas();
}

export { start, setHighlighted, removeRoom, reset, changeBlueprintImage, toggleImage }