import {Injectable} from "@nestjs/common";
import {Action, ActionType, Device, DeviceDetails, DeviceType} from "./device.model";
import {MongoRepository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {ChannelsService} from "../channels/channels.service";

@Injectable()
export class DeviceService {
    constructor(@InjectRepository(Device) private deviceRepository: MongoRepository<Device>,
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
        devices.forEach(device => console.log(device.point));
        devices.forEach(device => this.deviceRepository.update(device.id, device))
    }

    async getDetails(userId: string, deviceId: string): Promise<DeviceDetails> {
        const device = await this.deviceRepository.findOne(deviceId);
        const data = await this.channelsService.getChannelById(userId, device.suplaDeviceId);
        return this.mapToDeviceDetails(data);
    }

    async callAction(userId: string, deviceId: string, actionType: ActionType) {
        const device = await this.deviceRepository.findOne(deviceId);
        return this.channelsService.callAction(userId, device.suplaDeviceId, actionType);
    }

    private mapToDevice(suplaDevice, userId): Device {
        return new Device(userId, suplaDevice.id, suplaDevice.caption, null, null);
    }

    private mapToDeviceDetails(suplaDevice): DeviceDetails {
        const details = suplaDevice.function;
        return new DeviceDetails(
            DeviceType[details.name as keyof typeof DeviceType],
            details.caption,
            details.possibleActions.map(data => new Action(ActionType[data.name as keyof typeof ActionType], data.caption)),
            suplaDevice.state
        );
    }

    //TODO refactor to try to make less calls to db
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
                    }, {
                        name: device.name
                    });
                }
            }
        );

        return this.deviceRepository.findOne({
            suplaDeviceId: device.suplaDeviceId,
            userId: device.userId
        });
    }
}
