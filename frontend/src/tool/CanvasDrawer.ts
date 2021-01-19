import BackgroundImage from './model/BackgroundImage'
import Room from './model/Room'
import Point from './model/Point'
import NewDevice, { DeviceState } from './model/NewDevice';

export default class CanvasDrawer {
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, canvasContext: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.canvasContext = canvasContext;
        this.canvasContext.lineCap = "round";
        this.canvasContext.lineJoin = 'round';
    }

    drawBackground(backgroundImage: BackgroundImage, canvasHeight: number, canvasWidth: number) {
        const imageHeigth = backgroundImage.backgroundImage.height;
        const imageWidth = backgroundImage.backgroundImage.width;
        const imageRatio = imageHeigth/imageWidth;
        const canvasRatio = canvasHeight/canvasWidth;

        if(imageRatio < canvasRatio) {
            const height = canvasWidth*imageRatio;
            this.canvasContext.drawImage(backgroundImage.backgroundImage, 0, (canvasHeight - height)/2, canvasWidth, height);
        } else {
            const width = canvasHeight/imageRatio;
            this.canvasContext.drawImage(backgroundImage.backgroundImage, (canvasWidth - width)/2, 0, width, canvasHeight);
        }
    }

    drawRooms(rooms: Room[]) {    
        let highlightedRoom;
        rooms.forEach((currentRoom: Room) => {
            if(!currentRoom.isHighlighted()) {
                this.drawRoom(currentRoom);
            } else {
                highlightedRoom = currentRoom;
            }
        });

        if(highlightedRoom) {
            this.drawRoom(highlightedRoom, true);
        }
    }

    drawRoom(room: Room, highlighted: boolean = false, building: Boolean = false) {
        const points = room.points;

        if(points[0]) {
            this.canvasContext.beginPath(); 
            this.canvasContext.lineWidth = 3;
            this.canvasContext.strokeStyle = !highlighted ? "rgba(" + room.color + ", 1)" : "rgba(0, 209, 81, 1)";
            this.canvasContext.fillStyle = !highlighted ? "rgba(" + room.color + ", 0.35)" : "rgba(0, 209, 81, .7)";
            this.canvasContext.moveTo(points[0].x * this.canvas.width, points[0].y * this.canvas.width);

            for(let i=1; i<points.length; ++i) {
                this.canvasContext.lineTo(points[i].x * this.canvas.width, points[i].y * this.canvas.width);
            }
            if(!building) { 
                this.canvasContext.lineTo(points[0].x * this.canvas.width, points[0].y * this.canvas.width);
                this.canvasContext.fill();
            }
            this.canvasContext.stroke();
            this.canvasContext.closePath();
        }
    }

    drawDevices(devices: NewDevice[], highlightedDevice: String | null) {
        devices.forEach((device: NewDevice) => {
            this.drawDevice(device, device.id === highlightedDevice);
        })
    }

    drawDevice(newDevice: NewDevice, highlighted: boolean) {
        var image = new Image();
        
        image.src = "data:image/  png;base64," + (newDevice.icons ? (newDevice.deviceState == DeviceState.ACTIVE && newDevice.activeIconId ? newDevice.icons[newDevice.activeIconId] : newDevice.icons[0]) : "");
        const size = 0.015 * this.canvas.width
        let width = image.naturalWidth
        let height = image.naturalHeight
        if(width > height) {
            const ratio = height / width
            width = size
            height = size * ratio
        } else {
            const ratio = width / height
            width = size * ratio
            height = size
        }

        const devicePosition: Point = new Point(newDevice.point!.x * this.canvas.width, newDevice.point!.y * this.canvas.width);

        if(newDevice.displayedState) {
            const displayedState = `${newDevice.displayedState}`;
            const textWidth = this.canvasContext.measureText(displayedState).width;
            const font = "20px Quicksand,sans-serif";

            this.canvasContext.beginPath();
            this.canvasContext.font = font;
            this.canvasContext.textBaseline = 'top';
            this.canvasContext.fillStyle = '#fff';
            this.canvasContext.strokeStyle = "#777777"
            this.canvasContext.lineWidth = 1.5;
            this.roundRect(
                devicePosition.x,
                devicePosition.y - parseInt(font, 10)/2 - 5, 
                textWidth + 40,
                parseInt(font, 10) + 10, 
                (parseInt(font, 10) + 10)/2, 
                true, true
                )
            this.canvasContext.fillStyle = '#000';
            this.canvasContext.fillText(displayedState, devicePosition.x + 30, devicePosition.y - parseInt(font, 10)/2);
            this.canvasContext.closePath();
        }

        this.canvasContext.beginPath();
        this.canvasContext.arc(newDevice.point!.x * this.canvas.width, newDevice.point!.y * this.canvas.width, highlighted ?  size : size * 0.8, 0, 2 * Math.PI);
        this.canvasContext.fillStyle = "#ffffff";
        this.canvasContext.strokeStyle = newDevice.deviceState == DeviceState.ACTIVE ? "#00d151" : newDevice.deviceState == DeviceState.DISABLED ? "#ff0000" : "#777777"
        this.canvasContext.lineWidth = 2;
        this.canvasContext.fill();
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.canvasContext.drawImage(image, newDevice.point!.x * this.canvas.width - width/2, newDevice.point!.y * this.canvas.width - height/2, width, height);
    }

    roundRect(x: number, y: number, width: number, height: number, radius: number, fill: boolean, stroke: boolean) {
        let radiuss: {
            tl: number;
            tr: number;
            br: number;
            bl: number;
        } = {tl: 0, tr: radius, br: radius, bl: 0};

        this.canvasContext.beginPath();
        this.canvasContext.moveTo(x + radiuss.tl, y);
        this.canvasContext.lineTo(x + width - radiuss.tr, y);
        this.canvasContext.quadraticCurveTo(x + width, y, x + width, y + radiuss.tr);
        this.canvasContext.lineTo(x + width, y + height - radiuss.br);
        this.canvasContext.quadraticCurveTo(x + width, y + height, x + width - radiuss.br, y + height);
        this.canvasContext.lineTo(x + radiuss.bl, y + height);
        this.canvasContext.quadraticCurveTo(x, y + height, x, y + height - radiuss.bl);
        this.canvasContext.lineTo(x, y + radiuss.tl);
        this.canvasContext.quadraticCurveTo(x, y, x + radiuss.tl, y);
        this.canvasContext.closePath();
        if (fill) {
            this.canvasContext.fill();
        }
        if (stroke) {
            this.canvasContext.stroke();
        }
      }

    drawLine(startPoint: Point, endPoint: Point, primary: Boolean = false) {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(
            startPoint.x * this.canvas.width, 
            startPoint.y * this.canvas.width
        );

        this.canvasContext.strokeStyle = "rgba(0, 209, 81, 1)";
        this.canvasContext.setLineDash(primary ? [0, 0] : [5, 5]);
        this.canvasContext.lineWidth = primary ? 3 : 2;
        
        this.canvasContext.lineTo(
            endPoint.x * this.canvas.width, 
            endPoint.y * this.canvas.width
        );
        
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.canvasContext.setLineDash([0,0]);
    }

    highlightPoint(point: Point) {
        this.canvasContext.beginPath();
        this.canvasContext.lineWidth = 2;
        this.canvasContext.strokeStyle = "rgba(0, 209, 81, 1)";
        this.canvasContext.arc(point.x * this.canvas.width, point.y * this.canvas.width, 5, 0, 2 * Math.PI);
        this.canvasContext.fillStyle = "rgba(0, 209, 81, 1)"
        this.canvasContext.fill();
        this.canvasContext.stroke();
        this.canvasContext.closePath();
    }

    highlightLine(startPoint: Point, endPoint: Point) {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(
            startPoint.x * this.canvas.width, 
            startPoint.y * this.canvas.width
        );

        this.canvasContext.strokeStyle = "rgba(0, 209, 81, 1)";
        this.canvasContext.lineWidth = 3;
        
        this.canvasContext.lineTo(
            endPoint.x * this.canvas.width, 
            endPoint.y * this.canvas.width
        );
            
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.canvasContext.setLineDash([0,0]);
    }

    setCursor(type: string) {
        this.canvasContext.canvas.style.cursor = type
    }
}