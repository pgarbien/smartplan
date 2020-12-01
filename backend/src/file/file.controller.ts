import {ClassSerializerInterceptor, Controller, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from 'multer';
import {extname, join} from 'path';
import {ConfigService} from "@nestjs/config";
import {FileResponse, UploadFile} from "./file.model";
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {AuthGuard} from "../auth.guard";
import {AuthInterceptor} from "../auth.interceptor";


@Controller('file')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor)
export class FileController {
    constructor(private configService: ConfigService) {
    }

    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiCreatedResponse({type: FileResponse})
    @ApiBody({
        type: UploadFile,
    })
    @UseInterceptors(FileInterceptor('file', {
            storage: diskStorage({
                destination: join(__dirname, '../../../static'),
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                    return cb(null, `${randomName}${extname(file.originalname)}`)
                }
            })
        })
    )
    uploadFile(@UploadedFile() file): FileResponse {
        return new FileResponse(this.serverUrl + '/' + file.filename);
    }

    private serverUrl: string = this.configService.get('SERVER_URL');
}

