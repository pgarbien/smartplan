import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LocationsService} from "./locations.service";
import {Location} from "./location.model";
import {LocationsController} from "./locations.controller";
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "../auth/auth.module";
import {DeviceModule} from "../device/device.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Location]),
        ConfigModule,
        HttpModule,
        AuthModule,
        DeviceModule
    ],
    providers: [LocationsService],
    controllers: [LocationsController]
})
export class LocationsModule {
}
