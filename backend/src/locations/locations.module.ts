import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LocationsService} from "./locations.service";
import {Location} from "./location.model";
import {LocationsController} from "./locations.controller";
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Location]),
        ConfigModule,
        HttpModule,
        AuthModule
    ],
    providers: [LocationsService],
    controllers: [LocationsController]
})
export class LocationsModule {
}
