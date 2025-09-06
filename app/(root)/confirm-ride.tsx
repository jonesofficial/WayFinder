// import React, {useEffect, useState} from "react";
// import {Text, TouchableOpacity, View} from "react-native";
// import RideLayout from "@/components/RideLayout";
// import CustomButton from "@/components/CustomButton";
// import DirectionStatusCard from "@/components/DirectionStatusCard";
// import DeviceList from "@/components/DeviceList";
// import {useBluetooth} from "@/hooks/useBluetooth";
// import {useBluetoothStatus} from "@/components/BluetoothPrompt";
// import {useNavigationSteps} from "@/hooks/useNavigationSteps";
// import {useLocationStore} from "@/store";
// import {useBluetoothStore} from "@/store/bleStore";
// import LottieView from "lottie-react-native";
// import {images} from "@/constants";
//
// export default function ConfirmRide() {
//     const {destinationAddress} = useLocationStore();
//
//     // --- BLE system status ---
//     const {isBluetoothOn, openBluetoothSettings} = useBluetoothStatus();
//
//     // --- BLE scanning & connection ---
//     const {
//         devices,
//         isScanning,
//         startScan,
//         connectToDevice,
//         SERVICE_UUID,
//         CHARACTERISTIC_UUID,
//     } = useBluetooth();
//
//     // ✅ Global connected device (Zustand store)
//     const {connectedDevice, setConnectedDevice} = useBluetoothStore();
//
//     // Navigation hook depends on global connected device
//     const {
//         currentDirection,
//         currentStreet,
//         currentDistance,
//         startNavigation,
//     } = useNavigationSteps(
//         connectedDevice,
//         SERVICE_UUID,
//         CHARACTERISTIC_UUID
//     );
//
//     const [loading, setLoading] = useState(false);
//
//     const handleConnect = async (device: any) => {
//         const d = await connectToDevice(device);
//         if (d) setConnectedDevice(d);
//     };
//
//     // ✅ Auto-start navigation once destination is set & device connected
//     useEffect(() => {
//         const runNavigation = async () => {
//             if (connectedDevice && destinationAddress && !loading) {
//                 setLoading(true);
//                 try {
//                     await startNavigation(destinationAddress);
//                 } catch (err) {
//                     console.error("Navigation failed:", err);
//                 } finally {
//                     setLoading(false);
//                 }
//             }
//         };
//         runNavigation();
//     }, [destinationAddress, connectedDevice]);
//
//     return (
//         <RideLayout title="Confirm Ride" snapPoints={["85%"]}>
//             {/* --- BLE Status Card --- */}
//             <View
//                 className={`flex-row justify-between rounded-2xl p-4 mb-4 ${
//                     isBluetoothOn ? "bg-green-100" : "bg-red-100"
//                 }`}
//             >
//                 <View>
//                     <Text className="text-sm text-neutral-500 font-JakartaMedium">
//                         Bluetooth
//                     </Text>
//                     <Text
//                         className={`text-xl font-JakartaBold ${
//                             isBluetoothOn ? "text-green-700" : "text-red-700"
//                         }`}
//                     >
//                         {isBluetoothOn ? "ON" : "OFF"}
//                     </Text>
//                 </View>
//
//                 {!isBluetoothOn && (
//                     <View className="items-end">
//                         <CustomButton title="Enable BLE" onPress={openBluetoothSettings}/>
//                     </View>
//                 )}
//
//                 {connectedDevice && (
//                     <View className="items-end">
//                         <Text className="text-sm text-neutral-500 font-JakartaMedium">
//                             Connected Device
//                         </Text>
//                         <Text className="text-xl font-JakartaBold text-black">
//                             {connectedDevice.name}
//                         </Text>
//                     </View>
//                 )}
//             </View>
//
//             {/* --- Main Content --- */}
//             {!isBluetoothOn ? (
//                 <></>
//             ) : connectedDevice ? (
//                 // ✅ Device connected → navigation UI
//                 <View>
//                     <DirectionStatusCard
//                         direction={currentDirection}
//                         distance={
//                             currentDistance > 1000
//                                 ? `${(currentDistance / 1000).toFixed(1)} km`
//                                 : `${Math.round(currentDistance)} m`
//                         }
//                         streetName={currentStreet}
//                         className="my-4 h-6 w-full"
//                     />
//                 </View>
//             ) : (
//                 // ❌ Not connected → scanning / results flow
//                 <View className="items-center w-full">
//                     {isScanning ? (
//                         // 🔄 Show animation while scanning
//                         <>
//                             <Text className="text-lg font-JakartaBold mb-2">
//                                 Scanning for devices...
//                             </Text>
//                             <LottieView
//                                 source={images.bluetooth}
//                                 autoPlay
//                                 loop
//                                 style={{width: 150, height: 150}}
//                             />
//                         </>
//                     ) : devices.length > 0 ? (
//                         // 📱 Show discovered devices full width
//                         <DeviceList
//                             devices={devices}
//                             onConnect={handleConnect}
//                         />
//                     ) : (
//                         // ❌ No devices → show refresh
//                         <View className="items-center mt-4 w-full">
//                             <TouchableOpacity
//                                 onPress={startScan}
//                                 className="w-full bg-blue-600 px-4 py-3 rounded-2xl shadow-md active:opacity-80"
//                             >
//                                 <Text className="text-center text-white font-JakartaBold">
//                                     Refresh Devices 🔄
//                                 </Text>
//                             </TouchableOpacity>
//                             <Text className="text-sm text-gray-500 mt-2">
//                                 No devices found. Tap refresh to rescan.
//                             </Text>
//                         </View>
//                     )}
//                 </View>
//             )}
//         </RideLayout>
//     );
// }

//
// import React, {useEffect, useState} from "react";
// import {Text, TouchableOpacity, View} from "react-native";
// import RideLayout from "@/components/RideLayout";
// import CustomButton from "@/components/CustomButton";
// import DirectionStatusCard from "@/components/DirectionStatusCard";
// import DeviceList from "@/components/DeviceList";
// import PolylinePreview from "@/components/PolylinePreview"; // ✅ updated
// import {useBluetooth} from "@/hooks/useBluetooth";
// import {useBluetoothStatus} from "@/components/BluetoothPrompt";
// import {useNavigationSteps} from "@/hooks/useNavigationSteps";
// import {useLocationStore} from "@/store";
// import {useBluetoothStore} from "@/store/bleStore";
// import LottieView from "lottie-react-native";
// import {images} from "@/constants";
//
// export default function ConfirmRide() {
//     const {destinationAddress, steps} = useLocationStore();
//
//     // --- BLE system status ---
//     const {isBluetoothOn, openBluetoothSettings} = useBluetoothStatus();
//
//     // --- BLE scanning & connection ---
//     const {
//         devices,
//         isScanning,
//         startScan,
//         connectToDevice,
//         SERVICE_UUID,
//         CHARACTERISTIC_UUID,
//     } = useBluetooth();
//
//     // ✅ Global connected device (Zustand store)
//     const {connectedDevice, setConnectedDevice} = useBluetoothStore();
//
//     // Navigation hook depends on global connected device
//     const {
//         currentDirection,
//         currentStreet,
//         currentDistance,
//         startNavigation,
//     } = useNavigationSteps(
//         connectedDevice,
//         SERVICE_UUID,
//         CHARACTERISTIC_UUID
//     );
//
//     const [loading, setLoading] = useState(false);
//
//     const handleConnect = async (device: any) => {
//         const d = await connectToDevice(device);
//         if (d) setConnectedDevice(d);
//     };
//
//     // ✅ Auto-start navigation once destination is set & device connected
//     useEffect(() => {
//         const runNavigation = async () => {
//             if (connectedDevice && destinationAddress && !loading) {
//                 setLoading(true);
//                 try {
//                     await startNavigation(destinationAddress);
//                 } catch (err) {
//                     console.error("Navigation failed:", err);
//                 } finally {
//                     setLoading(false);
//                 }
//             }
//         };
//         runNavigation();
//     }, [destinationAddress, connectedDevice]);
//
//     return (
//         <RideLayout title="Confirm Ride" snapPoints={["85%"]}>
//             {/* --- BLE Status Card --- */}
//             <View
//                 className={`flex-row justify-between rounded-2xl p-4 mb-4 ${
//                     isBluetoothOn ? "bg-green-100" : "bg-red-100"
//                 }`}
//             >
//                 <View>
//                     <Text className="text-sm text-neutral-500 font-JakartaMedium">
//                         Bluetooth
//                     </Text>
//                     <Text
//                         className={`text-xl font-JakartaBold ${
//                             isBluetoothOn ? "text-green-700" : "text-red-700"
//                         }`}
//                     >
//                         {isBluetoothOn ? "ON" : "OFF"}
//                     </Text>
//                 </View>
//
//                 {!isBluetoothOn && (
//                     <View className="items-end">
//                         <CustomButton title="Enable Bluetooth" onPress={openBluetoothSettings}/>
//                     </View>
//                 )}
//
//                 {connectedDevice && (
//                     <View className="items-end">
//                         <Text className="text-sm text-neutral-500 font-JakartaMedium">
//                             Connected Device
//                         </Text>
//                         <Text className="text-xl font-JakartaBold text-black">
//                             {connectedDevice.name}
//                         </Text>
//                     </View>
//                 )}
//             </View>
//
//             {/* --- Polyline Preview (new card) --- */}
//             {connectedDevice && destinationAddress && <PolylinePreview/>}
//
//
//             {/* --- Main Content --- */}
//             {!isBluetoothOn ? (
//                 <></>
//             ) : connectedDevice ? (
//                 // ✅ Device connected → navigation UI
//                 <View>
//                     <DirectionStatusCard
//                         direction={currentDirection}
//                         distance={
//                             currentDistance > 1000
//                                 ? `${(currentDistance / 1000).toFixed(1)} km`
//                                 : `${Math.round(currentDistance)} m`
//                         }
//                         streetName={currentStreet}
//                         className="my-4 h-6 w-full"
//                     />
//                 </View>
//             ) : (
//                 // ❌ Not connected → scanning / results flow
//                 <View className="items-center w-full">
//                     {isScanning ? (
//                         // 🔄 Show animation while scanning
//                         <>
//                             <Text className="text-lg font-JakartaBold mb-2">
//                                 Scanning for devices...
//                             </Text>
//                             <LottieView
//                                 source={images.bluetooth}
//                                 autoPlay
//                                 loop
//                                 style={{width: 250, height: 250}}
//                             />
//                         </>
//                     ) : devices.length > 0 ? (
//                         // 📱 Show discovered devices full width
//                         <DeviceList
//                             devices={devices}
//                             onConnect={handleConnect}
//                         />
//                     ) : (
//                         // ❌ No devices → show refresh
//                         <View className="items-center mt-4 w-full">
//                             <TouchableOpacity
//                                 onPress={startScan}
//                                 className="w-full bg-blue-600 px-4 py-3 rounded-2xl shadow-md active:opacity-80"
//                             >
//                                 <Text className="text-center text-white font-JakartaBold">
//                                     Refresh Devices 🔄
//                                 </Text>
//                             </TouchableOpacity>
//                             <Text className="text-sm text-gray-500 mt-2">
//                                 No devices found. Tap refresh to rescan.
//                             </Text>
//                         </View>
//                     )}
//                 </View>
//             )}
//         </RideLayout>
//     );
// }
//


import React, {useEffect, useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import RideLayout from "@/components/RideLayout";
import CustomButton from "@/components/CustomButton";
import DirectionStatusCard from "@/components/DirectionStatusCard";
import DeviceList from "@/components/DeviceList";
// import PolylinePreview from "@/components/PolylinePreview";
import {useBluetooth} from "@/hooks/useBluetooth";
import {useBluetoothStatus} from "@/components/BluetoothPrompt";
import {useNavigationSteps} from "@/hooks/useNavigationSteps";
import {useLocationStore} from "@/store";
import {useBluetoothStore} from "@/store/bleStore";
import LottieView from "lottie-react-native";
import {images} from "@/constants";

export default function ConfirmRide() {
    const {destinationAddress, steps} = useLocationStore();

    // --- BLE system status ---
    const {isBluetoothOn, openBluetoothSettings} = useBluetoothStatus();

    // --- BLE scanning & connection ---
    const {
        devices,
        isScanning,
        startScan,
        connectToDevice,
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
    } = useBluetooth();

    // ✅ Global connected device (Zustand store)
    const {connectedDevice, setConnectedDevice} = useBluetoothStore();

    // Navigation hook depends on global connected device
    const {
        currentDirection,
        currentStreet,
        currentDistance,
        startNavigation,
    } = useNavigationSteps(
        connectedDevice,
        SERVICE_UUID,
        CHARACTERISTIC_UUID
    );

    const [loading, setLoading] = useState(false);

    const handleConnect = async (device: any) => {
        const d = await connectToDevice(device);
        if (d) setConnectedDevice(d);
    };

    // ✅ Auto-start navigation once destination is set & device connected
    useEffect(() => {
        const runNavigation = async () => {
            if (connectedDevice && destinationAddress && !loading) {
                setLoading(true);
                try {
                    await startNavigation(destinationAddress);
                } catch (err) {
                    console.error("Navigation failed:", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        runNavigation();
    }, [destinationAddress, connectedDevice]);

    return (
        <RideLayout title="Confirm Ride" snapPoints={["85%"]}>
            {/* --- BLE Status Card --- */}
            <View
                className={`flex-row justify-between rounded-2xl p-4 mb-4 ${
                    isBluetoothOn ? "bg-green-100" : "bg-red-100"
                }`}
            >
                <View>
                    <Text className="text-sm text-neutral-500 font-JakartaMedium">
                        Bluetooth
                    </Text>
                    <Text
                        className={`text-xl font-JakartaBold ${
                            isBluetoothOn ? "text-green-700" : "text-red-700"
                        }`}
                    >
                        {isBluetoothOn ? "ON" : "OFF"}
                    </Text>
                </View>

                {!isBluetoothOn && (
                    <View className="items-end">
                        <CustomButton title="Enable Bluetooth" onPress={openBluetoothSettings}/>
                    </View>
                )}

                {connectedDevice && (
                    <View className="items-end">
                        <Text className="text-sm text-neutral-500 font-JakartaMedium">
                            Connected Device
                        </Text>
                        <Text className="text-xl font-JakartaBold text-black">
                            {connectedDevice.name}
                        </Text>
                    </View>
                )}
            </View>

            {/* --- Polyline Preview (new card) --- */}
            {/*{connectedDevice && destinationAddress && <PolylinePreview/>}*/}


            {/* --- Main Content --- */}
            {!isBluetoothOn ? (
                <></>
            ) : connectedDevice ? (
                // ✅ Device connected → navigation UI
                <View>
                    <DirectionStatusCard
                        direction={currentDirection}
                        distance={
                            currentDistance > 1000
                                ? `${(currentDistance / 1000).toFixed(1)} km`
                                : `${Math.round(currentDistance)} m`
                        }
                        streetName={currentStreet}
                        className="my-4 h-6 w-full"
                    />
                </View>
            ) : (
                // ❌ Not connected → scanning / results flow
                <View className="items-center w-full">
                    {isScanning ? (
                        // 🔄 Show animation while scanning
                        <>
                            <Text className="text-lg font-JakartaBold mb-2">
                                Scanning for devices...
                            </Text>
                            <LottieView
                                source={images.bluetooth}
                                autoPlay
                                loop
                                style={{width: 250, height: 250}}
                            />
                        </>
                    ) : devices.length > 0 ? (
                        // 📱 Show discovered devices full width
                        <DeviceList
                            devices={devices}
                            onConnect={handleConnect}
                        />
                    ) : (
                        // ❌ No devices → show refresh
                        <View className="items-center mt-4 w-full">
                            <TouchableOpacity
                                onPress={startScan}
                                className="w-full bg-blue-600 px-4 py-3 rounded-2xl shadow-md active:opacity-80"
                            >
                                <Text className="text-center text-white font-JakartaBold">
                                    Refresh Devices 🔄
                                </Text>
                            </TouchableOpacity>
                            <Text className="text-sm text-gray-500 mt-2">
                                No devices found. Tap refresh to rescan.
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </RideLayout>
    );
}
