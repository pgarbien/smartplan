import {ApiProperty} from "@nestjs/swagger";

export class FileResponse {
    @ApiProperty()
    photoUrl: string;

    constructor(photoUrl: string) {
        this.photoUrl = photoUrl;
    }
}

export class UploadFile {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}