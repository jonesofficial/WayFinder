import React, {useEffect, useState} from 'react';
import {FlatList, PermissionsAndroid, Platform, Text, TouchableOpacity, View} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';

const manager = new BleManager();

const ConnectDevice: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    useEffect(() => {
        requestPermissions();
        return () => manager.destroy();
    }, []);

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);
        }
        startScan();
    };

    const startScan = () => {
        setDevices([]);
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.warn(error);
                return;
            }
            if (device && !devices.some(d => d.id === device.id)) {
                setDevices(prev => [...prev, device]);
            }
        });

        setTimeout(() => {
            manager.stopDeviceScan();
        }, 10000);
    };

    const connectToDevice = async (device: Device) => {
        try {
            const connected = await manager.connectToDevice(device.id);
            await connected.discoverAllServicesAndCharacteristics();
            setConnectedDevice(connected);
            console.log('Connected to', connected.name);
        } catch (err) {
            console.warn('Connection error:', err);
        }
    };

    return (
        <View className="flex-1 bg-white p-5">
            <Text className="text-xl font-bold mb-3">BLE Devices</Text>

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
                        <Text className="text-base">{item.name || 'Unnamed Device'}</Text>
                        <Text className="text-xs text-gray-500">{item.id}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default ConnectDevice;
