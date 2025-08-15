// lib/bleScanner.ts
import {BleManager, Device} from "react-native-ble-plx";

const manager = new BleManager();

export const scanForDevices = (
    onDeviceFound: (device: Device) => void,
    onError: (error: Error) => void
) => {
    manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            onError(error);
            return;
        }

        if (device && (device.name || device.localName)) {
            onDeviceFound(device);
        }
    });
};

export const stopScanning = () => {
    manager.stopDeviceScan();
};
