import {Controller, Get, Headers, Param, Patch, UseGuards, UseInterceptors} from '@nestjs/common';
import {ChannelsService} from "./channels.service";
import {AuthGuard} from "../auth.guard";
import {AuthInterceptor} from "../auth.interceptor";

@Controller('channels')
@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor)
export class ChannelsController {
    constructor(private readonly channelsService: ChannelsService) {
    }

    @Get()
    getChannels(@Headers('authorization') token: string) {
        return this.channelsService.getChannels(token);
    }

    @Get('/:id')
    getChannel(@Param('id') id: number) {
        return this.channelsService.getChannelById(id);
    }

    @Patch(':id')
    changeChannelStatus(@Param('id') id: number) {
        return this.channelsService.toggleLight(id);
    }
}
