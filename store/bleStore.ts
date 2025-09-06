// store/bluetoothStore.ts
import {create} from "zustand";

interface BluetoothState {
    connectedDevice: any | null;
    setConnectedDevice: (device: any | null) => void;
}

export const useBluetoothStore = create<BluetoothState>((set) => ({
    connectedDevice: null,
    setConnectedDevice: (device) => set({connectedDevice: device}),
}));
