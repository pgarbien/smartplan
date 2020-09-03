import { Injectable } from "@nestjs/common";
import { NewDevice } from "./newdevice.model";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class NewDeviceService {
    constructor(@InjectRepository(NewDevice) private deviceRepository: Repository<NewDevice>) {
    }

    save(device: NewDevice): Promise<NewDevice> {
        return this.deviceRepository.save(device);
    }
}