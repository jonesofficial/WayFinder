import {create} from "zustand";

type BleStore = {
    lastConnectedDevice: any | null;
    setLastConnectedDevice: (device: any) => void;
};

export const useBleStore = create<BleStore>((set) => ({
    lastConnectedDevice: null,
    setLastConnectedDevice: (device) => set({lastConnectedDevice: device}),
}));

export type Step = {
    dir: string;
    distanceMeters: number;
    lat: number;
    lng: number;
    streetName: string;
};

type LocationStore = {
    userAddress: string | null;
    userLongitude: number | null;
    userLatitude: number | null;
    destinationLatitude: number | null;
    destinationLongitude: number | null;
    destinationAddress: string | null;
    distance: string | null;
    duration: string | null;

    steps: Step[];
    setSteps: (steps: Step[]) => void;


    setUserLocation: (loc: { latitude: number; longitude: number; address: string }) => void;
    setDestinationLocation: (loc: { latitude: number; longitude: number; address: string }) => void;
    setRouteInfo: (info: { distance?: string; duration?: string }) => void;
};

export const useLocationStore = create<LocationStore>((set) => ({
    userAddress: null,
    userLongitude: null,
    userLatitude: null,
    destinationLatitude: null,
    destinationLongitude: null,
    destinationAddress: null,
    distance: null,
    duration: null,

    steps: [],
    setSteps: (steps) => set({steps}),

    setUserLocation: ({latitude, longitude, address}) => {
        set(() => ({
            userLatitude: latitude,
            userLongitude: longitude,
            userAddress: address,
        }));
    },

    setDestinationLocation: ({latitude, longitude, address}) => {
        set(() => ({
            destinationLongitude: longitude,
            destinationLatitude: latitude,
            destinationAddress: address,
        }));
    },

    setRouteInfo: ({distance, duration}) => {
        set(() => ({
            distance: distance || null,
            duration: duration || null,
        }));
    },
}));


