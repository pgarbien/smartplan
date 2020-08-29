import {Module} from '@nestjs/common';
import {LevelService} from './level.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Level} from "./level.model";
import {LevelController} from './level.controller';
import {Location} from "../locations/location.model";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Level, Location]),
        AuthModule
    ],
    providers: [LevelService],
    controllers: [LevelController],
})
export class LevelModule {
}
