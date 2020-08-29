import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Level} from "./level.model";
import { LevelController } from './level.controller';
import {LocationsModule} from "../locations/locations.module";
import {Location} from "../locations/location.model";

@Module({
  imports: [
      TypeOrmModule.forFeature([Level, Location])
  ],
  providers: [LevelService],
  controllers: [LevelController],
})
export class LevelModule {}
