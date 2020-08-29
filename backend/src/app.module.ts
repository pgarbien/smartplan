import {HttpModule, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {ChannelsController} from './channels/channels.controller';
import {ChannelsService} from './channels/channels.service';
import configuration from "../config/configuration";
import {AuthController} from './auth/auth.controller';
import AuthService from './auth/auth.service';
import {SuplaStrategy} from './auth/supla.strategy';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LevelModule} from './level/level.module';
import {LocationsModule} from './locations/locations.module';
import {RoomModule} from './room/room.module';
import {Point} from "./model/point.model";
import { AuthModule } from './auth/auth.module';
import {AuthGuard} from "./auth.guard";

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
        RoomModule,
        AuthModule
    ],
    controllers: [AppController, ChannelsController],
    providers: [AppService, ChannelsService]
})
export class AppModule {
}
