import {Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import { diskStorage } from  'multer';
import { extname } from  'path';

@Controller('file')
export class FileController {
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
    uploadFile(@UploadedFile() file) {
        console.log(file);
    }
}
