import {HttpModule, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
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
import { FileModule } from './file/file.module';
import { PreferencesModule } from './preferences/preferences.module';

@Module({
    imports: [
        HttpModule,
        ConfigModule.forRoot({
            envFilePath: './config/config.local.env',
            load: [configuration]
        }),
        TypeOrmModule.forRoot({
            type: 'mongodb',
            host: configuration().database.host,
            port: configuration().database.port,
            database: configuration().database.name,
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
        ChannelsModule,
        FileModule,
        PreferencesModule
    ],
    controllers: [AppController, FileController],
    providers: [AppService, ChannelsService]
})

export class AppModule {
}
