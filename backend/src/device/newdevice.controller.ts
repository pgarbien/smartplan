import { Controller, Get } from "@nestjs/common";
import {NewDeviceService} from "./newdevice.service";

@Controller('device')
export class NewDeviceController {
    constructor(private readonly deviceService: NewDeviceService) {
    }

    @Get()
    async add() {
        
    }
}