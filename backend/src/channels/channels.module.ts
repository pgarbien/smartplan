import {HttpModule, Module} from '@nestjs/common';
import {ChannelsService} from "./channels.service";
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        HttpModule,
        ConfigModule,
        AuthModule
    ],
    providers: [ChannelsService],
    exports: [ChannelsService],
})
export class ChannelsModule {}
