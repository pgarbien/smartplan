import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LocationsService} from "./locations.service";
import {Location} from "./location.model";
import {LocationsController} from "./locations.controller";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forFeature([Location]),
        ConfigModule,
        HttpModule
    ],
    providers: [LocationsService],
    controllers: [LocationsController]
})
export class LocationsModule {}
