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
            entities: [],
            synchronize: true
        })
    ],
    controllers: [AppController, ChannelsController, LocationsController, AuthController],
    providers: [AppService, ChannelsService, LocationsService, AuthService, SuplaStrategy]
})
export class AppModule { }
