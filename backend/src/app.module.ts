import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { ChannelsController } from './channels/channels.controller';
import { LocationsController } from './locations/locations.controller';
import { ChannelsService } from './channels/channels.service';
import { LocationsService } from './locations/locations.service';
import configuration from "../config/configuration";
import { AuthController } from './auth/auth.controller';
import AuthService from './auth/auth.service';
import { SuplaStrategy } from './auth/supla.strategy';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Location} from "./locations/location.model";
import {Level} from "./level/level.model";
import { LevelModule } from './level/level.module';
import { LocationsModule } from './locations/locations.module';
import { RoomService } from './room/room.service';
import { RoomModule } from './room/room.module';
import {Point} from "./model/point.model";

@Module({
    imports: [
        HttpModule,
        ConfigModule.forRoot({
            envFilePath: './config/api_config.env',
            load: [configuration]
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'admin',
            password: 'password',
            database: 'supla_test',
            synchronize: true,
            autoLoadEntities: true,
            entities: [Point]
        }),
        LevelModule,
        LocationsModule,
        RoomModule
    ],
    controllers: [AppController, ChannelsController, AuthController],
    providers: [AppService, ChannelsService, AuthService, SuplaStrategy]
})
export class AppModule { }
