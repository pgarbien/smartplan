import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NewDevice } from "./newdevice.model";
import { NewDeviceService } from "./newdevice.service";
import { NewDeviceController } from "./newdevice.controller";

@Module({imports: [
    TypeOrmModule.forFeature([NewDevice])
    ],
    providers: [NewDeviceService],
    controllers: [NewDeviceController]
})

export class NewDeviceModule {}