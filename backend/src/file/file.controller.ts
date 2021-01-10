import {Controller, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from 'multer';
import {extname, join} from 'path';
import {FileResponse, UploadFile} from "./file.model";
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {AuthGuard} from "../auth.guard";
import {AuthInterceptor} from "../auth.interceptor";
import configuration from 'config/configuration';


@Controller('file')
@ApiBearerAuth()
@ApiTags('Files')
@ApiUnauthorizedResponse()
@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor)
export class FileController {
    private serverUrl: string = configuration().serverUrl;

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
}

