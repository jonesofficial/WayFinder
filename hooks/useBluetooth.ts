// import {useEffect, useState} from "react";
// import {Alert, Linking, PermissionsAndroid, Platform} from "react-native";
// import {BleManager, Device, State as BleState} from "react-native-ble-plx";
//
// const manager = new BleManager();
// const TARGET_DEVICE_NAME = "WayFinder";
// const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
// const CHARACTERISTIC_UUID = "abcd1234-5678-90ab-cdef-1234567890ab";
//
// export function useBluetooth() {
//     const [devices, setDevices] = useState<Device[]>([]);
//     const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
//     const [isScanning, setIsScanning] = useState(false);
//     const [isBluetoothOn, setIsBluetoothOn] = useState(false);
//
//     // Listen to BLE state changes
//     useEffect(() => {
//         const subscription = manager.onStateChange((state) => {
//             setIsBluetoothOn(state === BleState.PoweredOn);
//         }, true);
//
//         return () => subscription.remove();
//     }, []);
//
//     useEffect(() => {
//         return () => manager.stopDeviceScan();
//     }, []);
//
//     const requestPermissions = async () => {
//         if (Platform.OS === "android") {
//             const granted = await PermissionsAndroid.requestMultiple([
//                 PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//                 PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             ]);
//             if (
//                 granted["android.permission.BLUETOOTH_SCAN"] !== "granted" ||
//                 granted["android.permission.BLUETOOTH_CONNECT"] !== "granted"
//             ) {
//                 Alert.alert("Permissions required", "Please grant Bluetooth permissions.");
//                 return false;
//             }
//         }
//         return true;
//     };
//
//     const startScan = async () => {
//         const hasPermission = await requestPermissions();
//         if (!hasPermission || !isBluetoothOn) return;
//
//         setDevices([]);
//         setIsScanning(true);
//         manager.startDeviceScan(null, null, (error, device) => {
//             if (error) {
//                 console.warn("Scan error:", error);
//                 return;
//             }
//             if (device && device.name === TARGET_DEVICE_NAME) {
//                 setDevices((prev) =>
//                     prev.some((d) => d.id === device.id) ? prev : [...prev, device]
//                 );
//             }
//         });
//
//         setTimeout(() => stopScan(), 10000);
//     };
//
//     const stopScan = () => {
//         manager.stopDeviceScan();
//         setIsScanning(false);
//     };
//
//     const connectToDevice = async (device: Device) => {
//         try {
//             const connected = await manager.connectToDevice(device.id);
//             await connected.discoverAllServicesAndCharacteristics();
//             setConnectedDevice(connected);
//             console.log("✅ Connected to", connected.name ?? connected.id);
//
//             connected.onDisconnected((error) => {
//                 if (error) console.warn("❌ Disconnection error:", error);
//                 setConnectedDevice(null);
//                 Alert.alert(
//                     "Device Disconnected",
//                     "Your WayFinder device has disconnected. Please reconnect.",
//                     [{text: "Reconnect", onPress: () => startScan()}]
//                 );
//             });
//         } catch (err) {
//             console.warn("Connection error:", err);
//         }
//     };
//
//     const openBluetoothSettings = () => {
//         if (Platform.OS === "android") {
//             Linking.openSettings();
//         } else {
//             Alert.alert("Enable Bluetooth", "Please enable Bluetooth in Settings");
//         }
//     };
//
//     return {
//         devices,
//         connectedDevice,
//         isScanning,
//         isBluetoothOn,
//         startScan,
//         stopScan,
//         connectToDevice,
//         openBluetoothSettings,
//         SERVICE_UUID,
//         CHARACTERISTIC_UUID,
//     };
// }


import {useEffect, useState} from "react";
import {Alert, Linking, PermissionsAndroid, Platform} from "react-native";
import {BleManager, Device} from "react-native-ble-plx";
import {useBluetoothStore} from "@/store/bleStore"; // ✅ global store

const manager = new BleManager();
const TARGET_DEVICE_NAME = "WayFinder";
const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
const CHARACTERISTIC_UUID = "abcd1234-5678-90ab-cdef-1234567890ab";

export function useBluetooth() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const {setConnectedDevice} = useBluetoothStore(); // ✅ only in zustand

    useEffect(() => {
        return () => manager.stopDeviceScan();
    }, []);

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
                Alert.alert("Permissions required", "Please grant Bluetooth permissions.");
                return false;
            }
        }
        return true;
    };

    const startScan = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        setDevices([]);
        setIsScanning(true);
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.warn("Scan error:", error);
                return;
            }
            if (device && device.name === TARGET_DEVICE_NAME) {
                setDevices((prev) =>
                    prev.some((d) => d.id === device.id) ? prev : [...prev, device]
                );
            }
        });

        setTimeout(() => stopScan(), 10000);
    };

    const stopScan = () => {
        manager.stopDeviceScan();
        setIsScanning(false);
    };

    const connectToDevice = async (device: Device) => {
        try {
            const connected = await manager.connectToDevice(device.id);
            await connected.discoverAllServicesAndCharacteristics();
            setConnectedDevice(connected); // ✅ global
            console.log("✅ Connected to", connected.name ?? connected.id);

            connected.onDisconnected((error) => {
                if (error) console.warn("❌ Disconnection error:", error);
                setConnectedDevice(null); // reset global
                Alert.alert(
                    "Device Disconnected",
                    "Your WayFinder device has disconnected. Please reconnect.",
                    [{text: "Reconnect", onPress: () => startScan()}]
                );
            });

            return connected; // ✅ important
        } catch (err) {
            console.warn("Connection error:", err);
            return null;
        }
    };


    const openBluetoothSettings = () => {
        if (Platform.OS === "android") {
            Linking.openSettings();
        } else {
            Alert.alert("Enable Bluetooth", "Please enable Bluetooth in Settings");
        }
    };

    return {
        devices,
        isScanning,
        startScan,
        stopScan,
        connectToDevice,
        openBluetoothSettings,
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
    };
}

