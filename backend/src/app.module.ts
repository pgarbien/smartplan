import {HttpModule, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import { ChannelsController } from './channels/channels.controller';
import { LocationsController } from './locations/locations.controller';
import { ChannelsService } from './channels/channels.service';
import { LocationsService } from './locations/locations.service';
import { AuthController } from './auth/auth.controller';
import configuration from "../config/configuration";

@Module({
    imports: [
        HttpModule,
        ConfigModule.forRoot({
            envFilePath: './config/api_config.env',
            load: [configuration]
        })
    ],
    controllers: [AppController, ChannelsController, LocationsController, AuthController],
    providers: [AppService, ChannelsService, LocationsService],
})
export class AppModule {
}
