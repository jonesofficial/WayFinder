import React, {useState} from "react";
import {ActivityIndicator, FlatList, Text, TouchableOpacity, View,} from "react-native";
import {Device} from "react-native-ble-plx";
import {Bluetooth} from "lucide-react-native";
import Animated, {FadeInUp, FadeOut, ZoomIn, ZoomOut,} from "react-native-reanimated";

interface Props {
    devices: Device[];
    onConnect: (device: Device) => void;
}

export default function DeviceList({devices, onConnect}: Props) {
    const [connectingId, setConnectingId] = useState<string | null>(null);
    const [connectedId, setConnectedId] = useState<string | null>(null);

    if (!devices.length) {
        return (
            <Text className="text-neutral-500 text-center mt-6 font-JakartaMedium">
                No devices found nearby
            </Text>
        );
    }

    const handlePress = (device: Device) => {
        setConnectingId(device.id);
        onConnect(device);

        // Simulate BLE connection delay
        setTimeout(() => {
            setConnectingId(null);
            setConnectedId(device.id);

            // Hold connected state for 3s
            setTimeout(() => {
                setConnectedId(null);
            }, 3000);
        }, 3000);
    };

    return (
        <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => {
                const isConnecting = connectingId === item.id;
                const isConnected = connectedId === item.id;

                return (
                    <TouchableOpacity
                        disabled={isConnecting || isConnected}
                        className="flex-row items-center justify-between bg-white w-full px-4 py-3 rounded-2xl mb-3 shadow-sm active:opacity-80"
                        onPress={() => handlePress(item)}
                    >
                        {/* Left: Icon + Device Info */}
                        <View className="flex-row items-center">
                            <View className="bg-blue-100 p-2 rounded-xl mr-3">
                                <Bluetooth size={20} color="#2563eb"/>
                            </View>
                            <View>
                                <Text className="text-base font-JakartaBold text-black">
                                    {item.name || "Unnamed Device"}
                                </Text>
                                <Text className="text-xs text-neutral-400">{item.id}</Text>
                            </View>
                        </View>

                        {/* Right: State with animations */}
                        {isConnecting ? (
                            <Animated.View
                                entering={FadeInUp.duration(300)}
                                exiting={FadeOut.duration(200)}
                                className="flex-row items-center"
                            >
                                <ActivityIndicator size="small" color="#2563eb"/>
                                <Text className="ml-2 text-blue-600 font-JakartaSemiBold text-sm">
                                    Connecting...
                                </Text>
                            </Animated.View>
                        ) : isConnected ? (
                            <Animated.Text
                                entering={ZoomIn.duration(400)}
                                exiting={ZoomOut.duration(300)}
                                className="text-green-600 font-JakartaSemiBold text-sm"
                            >
                                Connected ✅
                            </Animated.Text>
                        ) : (
                            <Text className="text-blue-600 font-JakartaSemiBold text-sm">
                                Connect
                            </Text>
                        )}
                    </TouchableOpacity>
                );
            }}
        />
    );
}
