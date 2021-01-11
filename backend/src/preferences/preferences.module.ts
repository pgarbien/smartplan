import { Module } from '@nestjs/common';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Preferences} from "./preferences.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports:[
    TypeOrmModule.forFeature([Preferences]),
    AuthModule
  ],
  controllers: [PreferencesController],
  providers: [PreferencesService]
})
export class PreferencesModule {}
