import React from "react";
import {Text, View} from "react-native";

interface Props {
    connected: boolean;
    deviceName?: string;
}

export default function BluetoothStatusCard({connected, deviceName}: Props) {
    return (
        <View
            className={`w-full rounded-2xl px-4 py-3 shadow-md ${
                connected ? "bg-green-100" : "bg-red-100"
            }`}
        >
            <View className="flex-row justify-between">
                <View>
                    <Text className="text-sm text-neutral-500 font-JakartaMedium">
                        Bluetooth
                    </Text>
                    <Text
                        className={`text-xl font-JakartaBold ${
                            connected ? "text-green-700" : "text-red-700"
                        }`}
                    >
                        {connected ? "ON" : "OFF"}
                    </Text>
                </View>

                <View className="items-end">
                    <Text className="text-sm text-neutral-500 font-JakartaMedium">
                        Connected to
                    </Text>
                    <Text className="text-xl font-JakartaBold text-black">
                        {connected && deviceName ? deviceName : "—"}
                    </Text>
                </View>
            </View>
        </View>
    );
}
