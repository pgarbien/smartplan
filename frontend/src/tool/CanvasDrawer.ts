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

        if(imageRatio < 1) {
            const height = canvasHeight*imageRatio;
            this.canvasContext.drawImage(backgroundImage.backgroundImage, 0, (canvasHeight - height)/2, canvasWidth, height);
        } else {
            const width = canvasWidth/imageRatio;
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
            this.canvasContext.moveTo(points[0].x * this.canvas.width, points[0].y * this.canvas.height);

            for(let i=1; i<points.length; ++i) {
                this.canvasContext.lineTo(points[i].x * this.canvas.width, points[i].y * this.canvas.height);
            }
            if(!building) { 
                this.canvasContext.lineTo(points[0].x * this.canvas.width, points[0].y * this.canvas.height);
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
        const size = 30
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

        this.canvasContext.beginPath();
        this.canvasContext.arc(newDevice.point!.x * this.canvas.width, newDevice.point!.y * this.canvas.height, highlighted ?  26 : 22, 0, 2 * Math.PI);
        this.canvasContext.fillStyle = "#ffffff";
        this.canvasContext.strokeStyle = newDevice.deviceState == DeviceState.ACTIVE ? "#00d151" : newDevice.deviceState == DeviceState.DISABLED ? "#ff0000" : "#777777"
        this.canvasContext.lineWidth = 1;
        this.canvasContext.fill();
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.canvasContext.drawImage(image, newDevice.point!.x * this.canvas.width - width/2, newDevice.point!.y * this.canvas.height - height/2, width, height);
    }

    drawLine(startPoint: Point, endPoint: Point, primary: Boolean = false) {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(
            startPoint.x * this.canvas.width, 
            startPoint.y * this.canvas.height
        );

        this.canvasContext.strokeStyle = "rgba(0, 209, 81, 1)";
        this.canvasContext.setLineDash(primary ? [0, 0] : [5, 5]);
        this.canvasContext.lineWidth = primary ? 3 : 2;
        
        this.canvasContext.lineTo(
            endPoint.x * this.canvas.width, 
            endPoint.y * this.canvas.height
        );

        console.log(endPoint.x  * this.canvas.width + " / " + this.canvas.width)
        
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.canvasContext.setLineDash([0,0]);
    }

    highlightPoint(point: Point) {
        this.canvasContext.beginPath();
        this.canvasContext.lineWidth = 2;
        this.canvasContext.strokeStyle = "rgba(0, 209, 81, 1)";
        this.canvasContext.arc(point.x * this.canvas.width, point.y * this.canvas.height, 5, 0, 2 * Math.PI);
        this.canvasContext.fillStyle = "rgba(0, 209, 81, 1)"
        this.canvasContext.fill();
        this.canvasContext.stroke();
        this.canvasContext.closePath();
    }

    highlightLine(startPoint: Point, endPoint: Point) {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(
            startPoint.x * this.canvas.width, 
            startPoint.y * this.canvas.height
        );

        this.canvasContext.strokeStyle = "rgba(0, 209, 81, 1)";
        this.canvasContext.lineWidth = 3;
        
        this.canvasContext.lineTo(
            endPoint.x * this.canvas.width, 
            endPoint.y * this.canvas.height
        );
            
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.canvasContext.setLineDash([0,0]);
    }

    setCursor(type: string) {
        this.canvasContext.canvas.style.cursor = type
    }
}