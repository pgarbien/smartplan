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
import {ApiBearerAuth, ApiHideProperty, ApiOkResponse, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {ActionTypeRequest, DeviceQuery} from "./device.api.model";
import AuthService from "../auth/auth.service";

@Controller('devices')
@ApiBearerAuth()
@ApiTags('Devices')
@ApiUnauthorizedResponse()
@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor, ClassSerializerInterceptor)
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) {
    }

    @Get()
    @ApiOkResponse({type: [Device]})
    getAll(@Req() req, @Query() query: DeviceQuery): Promise<Device[]> {
        return this.deviceService.getAll(req.userId, query, AuthService.getTokenFromRequest(req));
    }

    @Put()
    @ApiOkResponse({type: [Device]})
    updateAll(@Req() req, @Body() devices: Device[]): void {
        this.deviceService.updateAll(req.userId, devices, AuthService.getTokenFromRequest(req));
    }

    @Get('/details/:id')
    @ApiOkResponse({type: [DeviceDetails]})
    getDetails(@Req() req, @Param('id') deviceId: string): Promise<DeviceDetails> {
        return this.deviceService.getDetails(req.userId, deviceId, AuthService.getTokenFromRequest(req));
    }

    @Post('/actions/:id')
    @ApiOkResponse()
    callAction(@Req() req, @Param('id') deviceId: string,
               @Body() actionType: ActionTypeRequest): Promise<any> {
        return this.deviceService.callAction(req.userId, deviceId, actionType.actionType, AuthService.getTokenFromRequest(req));
    }

    @Get('/states')
    @ApiOkResponse({type: [DeviceState]})
    getStates(@Req() req, @Query() query: DeviceQuery): Promise<DeviceState[]> {
        return this.deviceService.getStates(req.userId, query, AuthService.getTokenFromRequest(req));
    }
}
