import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LocationsService} from "./locations.service";
import {Location} from "./location.model";
import {LocationsController} from "./locations.controller";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "../auth.guard";
import AuthService from "../auth/auth.service";
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
export class LocationsModule {}
