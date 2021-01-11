import {HttpModule, Module} from '@nestjs/common';
import {AuthController} from "./auth.controller";
import AuthService from "./auth.service";
import {SuplaStrategy} from "./supla.strategy";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        HttpModule,
        ConfigModule
    ],
    controllers: [AuthController],
    providers: [AuthService, SuplaStrategy],
    exports: [AuthService]
})

export class AuthModule {
}
