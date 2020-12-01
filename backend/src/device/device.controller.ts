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
import {Device, DeviceDetails, DeviceState} from "./device.model";
import {ApiBearerAuth, ApiHideProperty, ApiOkResponse} from "@nestjs/swagger";
import {ActionTypeRequest, DeviceQuery} from "./device.api.model";

@Controller('devices')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor, ClassSerializerInterceptor)
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) {
    }

    @Get()
    @ApiOkResponse({type: [Device]})
    getAll(@Headers('user_id') userId: string, @Query() query: DeviceQuery): Promise<Device[]> {
        return this.deviceService.getAll(userId, query);
    }

    @Put()
    @ApiOkResponse({type: [Device]})
    updateAll(@Headers('user_id') userId: string, @Body() devices: Device[]): void {
        this.deviceService.updateAll(userId, devices);
    }

    @Get('/details/:id')
    @ApiOkResponse({type: [DeviceDetails]})
    getDetails(@Headers('user_id') userId: string, @Param('id') deviceId: string): Promise<DeviceDetails> {
        return this.deviceService.getDetails(userId, deviceId);
    }

    @Post('/actions/:id')
    @ApiOkResponse()
    callAction(@Headers('user_id') userId: string, @Param('id') deviceId: string,
               @Body() actionType: ActionTypeRequest): Promise<any> {
        return this.deviceService.callAction(userId, deviceId, actionType.actionType);
    }

    @Get('/states')
    @ApiOkResponse({type: [DeviceState]})
    getStates(@Headers('user_id') userId: string, @Query() query: DeviceQuery): Promise<DeviceState[]> {
        return this.deviceService.getStates(userId, query);
    }
}
