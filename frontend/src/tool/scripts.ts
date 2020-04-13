import { Rooms } from './rooms'

let c: any;
let ctx: any;
let stx: any;
let img: any;

let currentRoom: any[] = [];
let currentRooms: any[];
let showImage = true;
let highlighted = -1;

const defaultRoomName = "Pokój #";
const defaultRoomColor = "128, 128, 128";

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
        currentRoom = [];
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

function changeBlueprintImage() {
    document.getElementsByTagName("img")[0]!!.src = document.getElementsByTagName('input')[0]!!.value;
    clearCanvas();
}

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

function toggleImage() {
    showImage = !showImage;
    clearCanvas();
}

function reset() {
    currentRooms = Rooms.slice();
    clearCanvas();
}

export { start, setHighlighted, removeRoom, reset, changeBlueprintImage, toggleImage }