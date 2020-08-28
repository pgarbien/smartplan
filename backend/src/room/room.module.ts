import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Room} from "./room.model";
import {RoomService} from "./room.service";
import { RoomController } from './room.controller';

@Module({imports: [
        TypeOrmModule.forFeature([Room])
    ],
    providers: [RoomService],
    controllers: [RoomController]
})
export class RoomModule {}
