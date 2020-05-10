import NewDevice from './model/NewDevice'

export default class CreatorNewDevices {
    private devices: NewDevice[] = [];
    private currentDevice: NewDevice = new NewDevice();

    getDevices() {
        return this.devices;
    }

    setDevices(devices: NewDevice[]) {
        this.devices = devices;
    }

    getCurrentDevice() {
        return this.currentDevice;
    }

    setCurrentDevice(newDevice: NewDevice) {
        this.currentDevice = newDevice;
    }

    removeDevice(devices: NewDevice[], newDevice: NewDevice) {
        devices.splice(devices.indexOf(newDevice), 1);
    }
}