import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Room} from "./room.model";

@Module({imports: [
        TypeOrmModule.forFeature([Room])
    ]
})
export class RoomModule {}
