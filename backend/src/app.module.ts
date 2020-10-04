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
import {AuthModule} from './auth/auth.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from 'path';
import {FileController} from './file/file.controller';
import {Device} from "./device/device.model";
import {DeviceModule} from "./device/device.module";
import {ChannelsModule} from './channels/channels.module';

@Module({
    imports: [
        HttpModule,
        ConfigModule.forRoot({
            envFilePath: './config/api_config.env',
            load: [configuration]
        }),
        TypeOrmModule.forRoot({
            type: 'mongodb',
            host: '192.168.99.100',
            port: 27017,
            database: 'supla_db',
            synchronize: true,
            autoLoadEntities: true,
            entities: [Device],
            logging: false
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../../static')
        }),
        LevelModule,
        LocationsModule,
        RoomModule,
        AuthModule,
        DeviceModule,
        ChannelsModule
    ],
    controllers: [AppController, ChannelsController, FileController],
    providers: [AppService, ChannelsService]
})

export class AppModule {
}
