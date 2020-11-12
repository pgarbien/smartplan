import BackgroundImage from './model/BackgroundImage'
import Room from './model/Room'
import Point from './model/Point'
import NewDevice from './model/NewDevice';

export default class CanvasDrawer {
    private canvasContext: CanvasRenderingContext2D;

    constructor(canvasContext: CanvasRenderingContext2D) {
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
            this.canvasContext.lineWidth = 5;
            this.canvasContext.strokeStyle = !highlighted ? "rgba(" + room.color + ", 1)" : "rgba(0, 209, 81, 1)";
            this.canvasContext.fillStyle = !highlighted ? "rgba(" + room.color + ", 0.5)" : "rgba(0, 209, 81, .7)";
            this.canvasContext.moveTo(points[0].x, points[0].y);

            for(let i=1; i<points.length; ++i) {
                this.canvasContext.lineTo(points[i].x, points[i].y);
            }
            if(!building) { 
                this.canvasContext.lineTo(points[0].x, points[0].y);
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
        image.src = "data:image/  png;base64," + (newDevice.icons ? newDevice.icons[0] : "");
        
        const size = 25
        let width = image.naturalWidth
        let height = image.naturalWidth
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
        this.canvasContext.arc(newDevice.point!.x, newDevice.point!.y, highlighted ?  20 : 15, 0, 2 * Math.PI);
        this.canvasContext.fillStyle = newDevice.color;
        this.canvasContext.fill();
        this.canvasContext.closePath();
        this.canvasContext.drawImage(image, newDevice.point!.x - width/2, newDevice.point!.y - height/2, width, height);
    }

    drawLine(startPoint: Point, endPoint: Point, primary: Boolean = false) {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(
            startPoint.x, 
            startPoint.y
        );

        this.canvasContext.strokeStyle = "rgba(0, 209, 81, 1)";
        this.canvasContext.setLineDash(primary ? [0, 0] : [5, 5]);
        this.canvasContext.lineWidth = primary ? 2 : 1;
        
        this.canvasContext.lineTo(
            endPoint.x, 
            endPoint.y
        );
        
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.canvasContext.setLineDash([0,0]);
    }

    highlightPoint(point: Point) {
        this.canvasContext.beginPath();
        this.canvasContext.lineWidth = 1;
        this.canvasContext.strokeStyle = "rgba(0, 209, 81, 1)";
        this.canvasContext.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        this.canvasContext.fillStyle = "rgba(0, 209, 81, 1)"
        this.canvasContext.fill();
        this.canvasContext.stroke();
        this.canvasContext.closePath();
    }

    highlightLine(startPoint: Point, endPoint: Point) {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(
            startPoint.x, 
            startPoint.y
        );

        this.canvasContext.strokeStyle = "rgba(0, 209, 81, 1)";
        this.canvasContext.lineWidth = 5;
        
        this.canvasContext.lineTo(
            endPoint.x, 
            endPoint.y
        );
            
        this.canvasContext.stroke();
        this.canvasContext.closePath();
        this.canvasContext.setLineDash([0,0]);
    }

    setCursor(type: string) {
        this.canvasContext.canvas.style.cursor = type
    }
}