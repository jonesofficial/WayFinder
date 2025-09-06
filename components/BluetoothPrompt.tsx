// // BluetoothPrompt.jsx
// import {useEffect, useState} from "react";
// import * as IntentLauncher from "expo-intent-launcher";
// import {Linking, Platform} from "react-native";
// import {BleManager} from "react-native-ble-plx";
//
// const manager = new BleManager();
//
// export const useBluetoothStatus = () => {
//     const [isBluetoothOn, setIsBluetoothOn] = useState(false);
//
//     useEffect(() => {
//         const subscription = manager.onStateChange((state) => {
//             setIsBluetoothOn(state === "PoweredOn");
//         }, true);
//
//         return () => subscription.remove();
//     }, []);
//
//     const openBluetoothSettings = () => {
//         if (Platform.OS === "android") {
//             IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.BLUETOOTH_SETTINGS);
//         } else {
//             Linking.openURL("App-Prefs:Bluetooth");
//         }
//     };
//
//     return {isBluetoothOn, openBluetoothSettings};
// };

// BluetoothPrompt.tsx
import {useEffect, useState} from "react";
import * as IntentLauncher from "expo-intent-launcher";
import {Linking, Platform} from "react-native";
import {BleManager} from "react-native-ble-plx";

const manager = new BleManager();

export const useBluetoothStatus = () => {
    const [isBluetoothOn, setIsBluetoothOn] = useState(false);

    useEffect(() => {
        const subscription = manager.onStateChange((state) => {
            setIsBluetoothOn(state === "PoweredOn");
        }, true);

        return () => subscription.remove();
    }, []);

    const openBluetoothSettings = () => {
        if (Platform.OS === "android") {
            IntentLauncher.startActivityAsync(
                IntentLauncher.ActivityAction.BLUETOOTH_SETTINGS
            );
        } else {
            Linking.openURL("App-Prefs:Bluetooth");
        }
    };

    return {isBluetoothOn, openBluetoothSettings};
};
