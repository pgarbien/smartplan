import {HttpModule, Module} from '@nestjs/common';
import {FileController} from "./file.controller";
import {AuthModule} from "../auth/auth.module";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        AuthModule,
        ConfigModule,
        HttpModule
    ],
    controllers: [FileController]
})
export class FileModule {
}
