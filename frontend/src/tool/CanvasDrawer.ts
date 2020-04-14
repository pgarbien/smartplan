import BackgroundImage from './BackgroundImage'
import Room from './Room'

export default class CanvasDrawer {
    private canvasContext: CanvasRenderingContext2D;

    constructor(canvasContext: CanvasRenderingContext2D) {
        this.canvasContext = canvasContext;
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
        let highlighted;
        rooms.forEach(currentRoom => {
            if(!currentRoom.isHighlighted) {
                this.drawRoom(currentRoom);
            } else {
                highlighted = currentRoom;
            }
        });

        if(highlighted) {
            this.drawRoom(highlighted, true);
        }
    }

    drawRoom(room: Room, highlighted: boolean = false) {
        const points = room.points

        this.canvasContext.beginPath(); 
        this.canvasContext.lineWidth = 5;
        this.canvasContext.strokeStyle = room && !highlighted ? "rgba(" + room.color + ", 1)" : "rgba(0, 209, 81, .7)";
        this.canvasContext.fillStyle = room && !highlighted? "rgba(" + room.color + ", 0.5)" : "rgba(0, 209, 81, .7)";
        this.canvasContext.lineJoin = 'miter';
        this.canvasContext.moveTo(points[0].x, points[0].y);
        for(let i=1; i<points.length; ++i) {
            this.canvasContext.lineTo(points[i].x, points[i].y);
        }
        this.canvasContext.stroke();
        if(room) {
            this.canvasContext.fill();
        }
    }
}