import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    Put, Query, Req,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {DeviceService} from "./device.service";
import {AuthGuard} from "../auth.guard";
import {AuthInterceptor} from "../auth.interceptor";
import {Device, DeviceDetails, DeviceState} from "./device.model";
import {ApiBearerAuth, ApiHideProperty, ApiOkResponse, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {ActionTypeRequest, DeviceQuery} from "./device.api.model";

@Controller('devices')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor, ClassSerializerInterceptor)
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) {
    }

    @Get()
    @ApiOkResponse({type: [Device]})
    getAll(@Req() req, @Query() query: DeviceQuery): Promise<Device[]> {
        return this.deviceService.getAll(req.userId, query);
    }

    @Put()
    @ApiOkResponse({type: [Device]})
    updateAll(@Req() req, @Body() devices: Device[]): void {
        this.deviceService.updateAll(req.userId, devices);
    }

    @Get('/details/:id')
    @ApiOkResponse({type: [DeviceDetails]})
    getDetails(@Req() req, @Param('id') deviceId: string): Promise<DeviceDetails> {
        return this.deviceService.getDetails(req.userId, deviceId);
    }

    @Post('/actions/:id')
    @ApiOkResponse()
    callAction(@Req() req, @Param('id') deviceId: string,
               @Body() actionType: ActionTypeRequest): Promise<any> {
        return this.deviceService.callAction(req.userId, deviceId, actionType.actionType);
    }

    @Get('/states')
    @ApiOkResponse({type: [DeviceState]})
    getStates(@Req() req, @Query() query: DeviceQuery): Promise<DeviceState[]> {
        return this.deviceService.getStates(req.userId, query);
    }
}
