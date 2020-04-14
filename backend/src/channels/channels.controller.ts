import {Controller, Get, Param, Patch} from '@nestjs/common';
import {ChannelsService} from "./channels.service";

@Controller('channels')
export class ChannelsController {
    constructor(private readonly channelsService: ChannelsService) {
    }

    @Get()
    getChannels() {
        return this.channelsService.getChannels();
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
