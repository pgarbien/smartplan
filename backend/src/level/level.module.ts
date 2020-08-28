import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Level} from "./level.model";

@Module({
  imports: [TypeOrmModule.forFeature([Level])],
  providers: [LevelService]
})
export class LevelModule {}
