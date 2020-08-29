import {Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from 'multer';
import {extname} from 'path';
import {ConfigService} from "@nestjs/config";


@Controller('file')
export class FileController {
    constructor(private configService: ConfigService) {
    }

    private serverUrl: string = this.configService.get('SERVER_URL');

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
            storage: diskStorage({
                destination: 'C:/Users/Piotrek/Projekty/Inzynierka/atomowki/backend/static',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                    return cb(null, `${randomName}${extname(file.originalname)}`)
                }
            })
        })
    )
    uploadFile(@UploadedFile() file): any {
        return {photoUrl: this.serverUrl + '/' + file.filename};
    }
}

