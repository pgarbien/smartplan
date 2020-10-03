import {Body, Controller, Get, Headers, Put, UseGuards, UseInterceptors} from "@nestjs/common";
import {DeviceService} from "./device.service";
import {AuthGuard} from "../auth.guard";
import {AuthInterceptor} from "../auth.interceptor";
import {Device} from "./device.model";

@Controller('devices')
@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor)
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) {
    }

    @Get()
    getAll(@Headers('user_id') userId: string): Promise<Device[]> {
        return this.deviceService.getAll(userId);
    }

    @Put()
    updateAll(@Headers('user_id') userId: string, @Body() devices: Device[]): void {
        this.deviceService.updateAll(userId, devices);
    }
}
