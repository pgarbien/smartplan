import {Injectable} from "@nestjs/common";
import {Device} from "./device.model";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {ChannelsService} from "../channels/channels.service";

@Injectable()
export class DeviceService {
    constructor(@InjectRepository(Device) private deviceRepository: Repository<Device>,
                private readonly channelsService: ChannelsService) {
    }

    save(device: Device): Promise<Device> {
        return this.deviceRepository.save(device);
    }

    async getAll(userId: string): Promise<Device[]> {
        const promises = this.channelsService.getChannels(userId)
            .then(suplaDevices =>
                suplaDevices.map(device => this.updateAndGet(this.mapToDevice(device, userId)))
            );
        return Promise.all(await promises);
    }

    updateAll(userId: string, devices: Device[]): void {
        devices.forEach(device => this.deviceRepository.update({
            userId: device.userId,
            id: device.id
        }, {
            color: device.color,
            point: device.point
        }))
    }

    private mapToDevice(suplaDevice, userId): Device {
        return new Device(userId, suplaDevice.id, suplaDevice.caption, null, null);
    }

    private async updateAndGet(device: Device): Promise<Device> {
        this.deviceRepository.findOne({
            suplaDeviceId: device.suplaDeviceId,
            userId: device.userId
        }).then(
            async dbDevice => {
                if (dbDevice == undefined) {
                    await this.deviceRepository.save(device)
                } else {
                    await this.deviceRepository.update({
                        userId: device.userId,
                        suplaDeviceId: device.suplaDeviceId
                    }, {name: device.name});
                }
            }
        );

        return this.deviceRepository.findOne({
            suplaDeviceId: device.suplaDeviceId,
            userId: device.userId
        });
    }
}
