import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    Put,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {DeviceService} from "./device.service";
import {AuthGuard} from "../auth.guard";
import {AuthInterceptor} from "../auth.interceptor";
import {ActionType, Device, DeviceDetails} from "./device.model";

export class Req {
    actionType: ActionType;
}

@Controller('devices')
@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor, ClassSerializerInterceptor)
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

    @Get('/details/:id')
    getDetails(@Headers('user_id') userId: string, @Param('id') deviceId: string): Promise<DeviceDetails> {
        return this.deviceService.getDetails(userId, deviceId);
    }

    @Get('/locations/:locationId')
    getAllByLocationId(@Headers('user_id') userId: string, @Param('locationId') locationId: string): Promise<Device[]> {
        return this.deviceService.getAllByLocationId(userId, locationId);
    }

    @Post('/actions/:id')
    callAction(@Headers('user_id') userId: string, @Param('id') deviceId: string,
               @Body() actionType: Req) {
        //TODO change this request body
        return this.deviceService.callAction(userId, deviceId, actionType.actionType);
    }

    @Get('/states')
    getStates(@Headers('user_id') userId: string) {
        return this.deviceService.getStates(userId);
    }
}
