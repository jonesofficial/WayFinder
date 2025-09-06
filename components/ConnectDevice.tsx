import React, {useEffect, useState} from "react";
import {Alert, FlatList, PermissionsAndroid, Platform, Text, TouchableOpacity, View} from "react-native";
import {BleManager, Device} from "react-native-ble-plx";
import {encode} from "base-64";

const manager = new BleManager();
const TARGET_DEVICE_NAME = "WayFinder";
const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
const CHARACTERISTIC_UUID = "abcd1234-5678-90ab-cdef-1234567890ab";

interface ConnectDeviceProps {
    bleOn: boolean;
    setBleOn: (on: boolean) => void;
}

const ConnectDevice: React.FC<ConnectDeviceProps> = ({bleOn, setBleOn}) => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    useEffect(() => {
        if (Platform.OS === "android") {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT).then((granted) => {
                if (!granted) requestPermissions();
            });
        }
    }, []);

    useEffect(() => {
        if (bleOn) startScan();
        else stopScan();
    }, [bleOn]);

    const requestPermissions = async () => {
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);
            if (
                granted["android.permission.BLUETOOTH_SCAN"] !== "granted" ||
                granted["android.permission.BLUETOOTH_CONNECT"] !== "granted"
            ) {
                Alert.alert("Permissions required", "Please grant Bluetooth permissions to scan devices.");
                return;
            }
        }
        startScan();
    };

    const startScan = () => {
        console.log("🔍 Looking for devices...");
        setDevices([]);

        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.warn("Scan error:", error);
                return;
            }
            if (device && device.name === TARGET_DEVICE_NAME) {
                setDevices((prev) => (prev.some((d) => d.id === device.id) ? prev : [...prev, device]));
            }
        });

        setTimeout(stopScan, 10000);
    };

    const stopScan = () => {
        manager.stopDeviceScan();
        console.log("🛑 Scan stopped");
    };

    const connectToDevice = async (device: Device) => {
        console.log("🔗 Connecting to", device.name);
        try {
            const connected = await manager.connectToDevice(device.id);
            await connected.discoverAllServicesAndCharacteristics();
            setConnectedDevice(connected);
            console.log("✅ Connected to", connected.name ?? connected.id);

            connected.onDisconnected((error, dev) => {
                if (error) console.warn("❌ Disconnection error:", error);
                console.log("❌ Device disconnected:", dev?.name ?? dev?.id);
                setConnectedDevice(null);
            });
        } catch (err) {
            console.warn("Connection error:", err);
        }
    };

    const sendDirection = async (direction: string, distance: string) => {
        if (!connectedDevice) return;
        try {
            const services = await connectedDevice.services();
            for (const service of services) {
                if (service.uuid === SERVICE_UUID) {
                    const characteristics = await service.characteristics();
                    for (const char of characteristics) {
                        if (char.uuid === CHARACTERISTIC_UUID) {
                            const message = `${direction}:${distance}`;
                            await char.writeWithResponse(encode(message));
                            console.log("📤 Sent:", message);
                        }
                    }
                }
            }
        } catch (err) {
            console.warn("Send error:", err);
        }
    };

    return (
        <View className="flex-1">
            {connectedDevice && (
                <Text className="mb-4 text-green-600">
                    Connected to: {connectedDevice.name || connectedDevice.id}
                </Text>
            )}

            <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <TouchableOpacity
                        className="p-3 border-b border-gray-300"
                        onPress={() => connectToDevice(item)}
                    >
                        <Text className="text-base">{item.name || "Unnamed Device"}</Text>
                        <Text className="text-xs text-gray-500">{item.id}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default ConnectDevice;


