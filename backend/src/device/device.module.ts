import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Device} from "./device.model";
import {DeviceService} from "./device.service";
import {DeviceController} from "./device.controller";
import {ChannelsModule} from "../channels/channels.module";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Device]),
        ChannelsModule,
        AuthModule
    ],
    providers: [DeviceService],
    controllers: [DeviceController],
    exports: [DeviceService]
})

export class DeviceModule {
}
