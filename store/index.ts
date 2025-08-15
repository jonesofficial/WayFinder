import {create} from "zustand";
import {LocationStore} from "@/types/type";
// In your store file
export const useLocationStore = create<LocationStore>((set) => ({
    userAddress: null,
    userLongitude: null,
    userLatitude: null,
    destinationLatitude: null,
    destinationLongitude: null,
    destinationAddress: null,
    distance: null,
    duration: null,

    setUserLocation: ({latitude, longitude, address}) => {
        set(() => ({
            userLatitude: latitude,
            userLongitude: longitude,
            userAddress: address
        }));
    },

    setDestinationLocation: ({latitude, longitude, address}) => {
        set(() => ({
            destinationLongitude: longitude,
            destinationLatitude: latitude,
            destinationAddress: address
        }));
    },

    setRouteInfo: ({distance, duration}) => {
        set(() => ({
            distance,
            duration
        }));
    },
}));
