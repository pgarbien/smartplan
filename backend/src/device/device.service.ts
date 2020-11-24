import {Injectable} from "@nestjs/common";
import {
    Action,
    ActionType,
    Device,
    DeviceDetails,
    DeviceState,
    DeviceType,
    DeviceConfig,
    BaseDevice
} from "./device.model";
import {MongoRepository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {ChannelsService} from "../channels/channels.service";
import {DeviceQuery} from "./device.controller";
import devicesConfig from "../../config/devices_config";

@Injectable()
export class DeviceService {
    constructor(@InjectRepository(Device) private readonly deviceRepository: MongoRepository<Device>,
                private readonly channelsService: ChannelsService) {
    }

    save(device: Device): Promise<Device> {
        return this.deviceRepository.save(device);
    }

    async getAll(userId: string, query: DeviceQuery): Promise<Device[]> {
        const channels = await this.channelsService.getChannels(userId);
        const devices: Device[] = await Promise.all(channels.map(device => this.updateAndGet(this.mapToDevice(device, userId))));

        for await (const device of devices) {
            if (devicesConfig.has(device.type)) {
                await this.setDeviceIconsAndDefaultAction(device, userId);
            }
        }

        return devices.filter(device => this.assertQuery(device, query));
    }

    updateAll(userId: string, devices: Device[]): void {
        devices.forEach(device => this.deviceRepository.update(device.id, device))
    }

    async getDetails(userId: string, deviceId: string): Promise<DeviceDetails> {
        const device = await this.deviceRepository.findOne(deviceId);
        const data = await this.channelsService.getChannelById(userId, device.suplaDeviceId);
        const deviceDetails: DeviceDetails = this.mapToDeviceDetails(data);

        await this.setDeviceIconsAndDefaultAction(deviceDetails, userId);

        return deviceDetails;
    }

    async callAction(userId: string, deviceId: string, actionType: ActionType) {
        const device = await this.deviceRepository.findOne(deviceId);
        return this.channelsService.callAction(userId, device.suplaDeviceId, actionType);
    }

    async getStates(userId: string, query: DeviceQuery): Promise<DeviceState[]> {
        const suplaDevicesWithStates = await this.channelsService.getChannelsWithStates(userId);
        const deviceStates: DeviceState[] = await Promise.all(suplaDevicesWithStates.map(device => this.mapToDeviceState(device, userId)));
        const devices = {};

        //TODO think of other model to not make calls to db twice for each device as it is now (because we want the state and locationId etc.. maybe search for device model and only return DeviceState
        for (const deviceState of deviceStates) {
            devices[deviceState.id] = await this.deviceRepository.findOne(deviceState.id, {
                where: {
                    "userId": userId
                }
            });
        }
        return deviceStates.filter(deviceState => this.assertQuery(devices[deviceState.id], query));
    }

    private async setDeviceIconsAndDefaultAction(device: BaseDevice, userId: string) {
        const config: DeviceConfig = devicesConfig.get(device.type);
        if(device.suplaIconId == null) {
            device.icons = config.images;
        } else {
            const iconsData = await this.channelsService.getIconById(userId, device.suplaIconId);
            device.icons = iconsData[0].images;
        }
        device.defaultAction = config.defaultAction;
    }

    private assertQuery(device: Device, query: DeviceQuery): boolean {
        return (query.roomId != null && device.roomId == query.roomId)
            || (query.levelId != null && query.roomId == null && device.levelId == query.levelId)
            || (query.locationId != null && query.roomId == null && query.levelId == null && device.locationId == query.locationId)
            || (query.locationId == null && query.levelId == null && query.roomId == null)
    }

    private async mapToDeviceState(suplaDevice, userId): Promise<DeviceState> {
        const device = await this.deviceRepository.findOne({
            suplaDeviceId: suplaDevice.id,
            userId: userId
        });
        return new DeviceState(device.id.toString(), suplaDevice.state);
    }

    private mapToDevice(suplaDevice, userId): Device {
        return new Device(
            userId,
            suplaDevice.id,
            suplaDevice.caption,
            suplaDevice.userIconId,
            DeviceType[suplaDevice.function.name as keyof typeof DeviceType],
            suplaDevice.function.possibleVisualStates
        );
    }

    private mapToDeviceDetails(suplaDevice): DeviceDetails {
        const details = suplaDevice.function;
        return new DeviceDetails(
            DeviceType[details.name as keyof typeof DeviceType],
            details.caption,
            details.possibleActions.map(data => new Action(ActionType[data.name as keyof typeof ActionType], data.caption)),
            suplaDevice.state,
            suplaDevice.userIconId,
            details.possibleVisualStates
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
                        name: device.name,
                        suplaIconId: device.suplaIconId,
                        type: device.type,
                        possibleVisualStates: device.possibleVisualStates
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
