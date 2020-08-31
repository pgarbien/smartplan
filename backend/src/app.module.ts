import {HttpModule, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {ChannelsController} from './channels/channels.controller';
import {ChannelsService} from './channels/channels.service';
import configuration from "../config/configuration";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LevelModule} from './level/level.module';
import {LocationsModule} from './locations/locations.module';
import {RoomModule} from './room/room.module';
import {Point} from "./model/point.model";
import {AuthModule} from './auth/auth.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from 'path';
import { FileController } from './file/file.controller';

@Module({
    imports: [
        HttpModule,
        ConfigModule.forRoot({
            envFilePath: './config/api_config.env',
            load: [configuration]
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'postgres',
            port: 5432,
            username: 'admin',
            password: 'password',
            database: 'supla_db',
            synchronize: true,
            autoLoadEntities: true,
            entities: [Point]
        }),
        ServeStaticModule.forRoot({
            rootPath: 'C:/Users/Piotrek/Projekty/Inzynierka/atomowki/backend/static'
        }),
        LevelModule,
        LocationsModule,
        RoomModule,
        AuthModule
    ],
    controllers: [AppController, ChannelsController, FileController],
    providers: [AppService, ChannelsService]
})

export class AppModule {
}
