import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    Put, Query,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {DeviceService} from "./device.service";
import {AuthGuard} from "../auth.guard";
import {AuthInterceptor} from "../auth.interceptor";
import {ActionType, Device, DeviceDetails, DeviceState} from "./device.model";

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
    getAll(@Headers('user_id') userId: string, @Query() query: DeviceQuery): Promise<Device[]> {
        console.log(query);
        return this.deviceService.getAll(userId, query);
    }

    @Put()
    updateAll(@Headers('user_id') userId: string, @Body() devices: Device[]): void {
        this.deviceService.updateAll(userId, devices);
    }

    @Get('/details/:id')
    getDetails(@Headers('user_id') userId: string, @Param('id') deviceId: string): Promise<DeviceDetails> {
        return this.deviceService.getDetails(userId, deviceId);
    }

    @Post('/actions/:id')
    callAction(@Headers('user_id') userId: string, @Param('id') deviceId: string,
               @Body() actionType: Req): Promise<any> {
        //TODO change this request body
        return this.deviceService.callAction(userId, deviceId, actionType.actionType);
    }

    @Get('/states')
    getStates(@Headers('user_id') userId: string, @Query() query: DeviceQuery): Promise<DeviceState[]> {
        return this.deviceService.getStates(userId, query);
    }
}

export interface DeviceQuery {
    locationId: string;
    levelId: string;
    roomId: string;
}
