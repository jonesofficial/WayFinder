// import {useRef, useState} from "react";
// import * as Location from "expo-location";
// import axios from "axios";
// import {encode as btoa} from "base-64";
// import {Alert} from "react-native";
// import {Device} from "react-native-ble-plx";
//
// const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
//
// interface Step {
//     dir: string;
//     distanceMeters: number;
//     lat: number;
//     lng: number;
//     streetName: string;
// }
//
// export function useNavigationSteps(
//     connectedDevice: Device | null,
//     SERVICE_UUID: string,
//     CHARACTERISTIC_UUID: string
// ) {
//     const [steps, setSteps] = useState<Step[]>([]);
//     const [currentDirection, setCurrentDirection] = useState<string>("Getting Directions...");
//     const [currentStreet, setCurrentStreet] = useState<string>("");
//     const [currentDistance, setCurrentDistance] = useState<number>(0);
//
//     const userPositionRef = useRef<Location.LocationObject | null>(null);
//     const lastUpdateTimeRef = useRef<number>(0);
//
//     const normalizeDir = (maneuver?: string): string => {
//         if (!maneuver) return "STRAIGHT";
//         switch (maneuver.toLowerCase()) {
//             case "turn-slight-left":
//                 return "TURN_SLIGHT_LEFT";
//             case "turn-left":
//                 return "TURN_LEFT";
//             case "turn-sharp-left":
//                 return "TURN_SHARP_LEFT";
//             case "turn-slight-right":
//                 return "TURN_SLIGHT_RIGHT";
//             case "turn-right":
//                 return "TURN_RIGHT";
//             case "turn-sharp-right":
//                 return "TURN_SHARP_RIGHT";
//             case "uturn-left":
//                 return "UTURN_LEFT";
//             case "uturn-right":
//                 return "UTURN_RIGHT";
//             case "merge":
//                 return "MERGE";
//             case "ramp-left":
//                 return "RAMP_LEFT";
//             case "ramp-right":
//                 return "RAMP_RIGHT";
//             case "fork-left":
//                 return "FORK_LEFT";
//             case "fork-right":
//                 return "FORK_RIGHT";
//             case "roundabout-left":
//                 return "ROUNDABOUT_LEFT";
//             case "roundabout-right":
//                 return "ROUNDABOUT_RIGHT";
//             case "arrive":
//                 return "ARRIVE";
//             case "ferry":
//                 return "FERRY";
//             case "ferry-train":
//                 return "FERRY_TRAIN";
//             default:
//                 return "STRAIGHT";
//         }
//     };
//
//     const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "");
//
//     // ✅ keep only "towards ..." if present
//     const shortenStreetName = (instruction: string) => {
//         const clean = stripHtml(instruction);
//         const match = clean.match(/towards\s+(.*)/i);
//         return match ? `towards ${match[1]}` : clean;
//     };
//
//     const getDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
//         const toRad = (x: number) => (x * Math.PI) / 180;
//         const R = 6371000;
//         const dLat = toRad(lat2 - lat1);
//         const dLon = toRad(lon2 - lon1);
//         const a =
//             Math.sin(dLat / 2) ** 2 +
//             Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         return R * c;
//     };
//
//     const sendDirection = async (direction: string, distance: number) => {
//         if (!connectedDevice) return;
//         try {
//             const services = await connectedDevice.services();
//             for (const service of services) {
//                 if (service.uuid === SERVICE_UUID) {
//                     const characteristics = await service.characteristics();
//                     for (const char of characteristics) {
//                         if (char.uuid === CHARACTERISTIC_UUID) {
//                             const message = `${direction}:${Math.round(distance)}`;
//                             await char.writeWithoutResponse(btoa(message));
//                             console.log("📤 Sent:", message);
//                             setCurrentDirection(`${direction} (${Math.round(distance)}m)`);
//                             setCurrentDistance(Math.round(distance));
//                         }
//                     }
//                 }
//             }
//         } catch (err) {
//             console.warn("Send error:", err);
//         }
//     };
//
//     const fetchDirections = async (origin: string, destination: string): Promise<Step[]> => {
//         try {
//             const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
//                 origin
//             )}&destination=${encodeURIComponent(destination)}&mode=driving&key=${GOOGLE_API_KEY}`;
//
//             const {data} = await axios.get(url);
//             if (!data.routes?.length) throw new Error("No route found");
//
//             const leg = data.routes[0].legs[0];
//             const stepsData: Step[] = leg.steps.map((s: any) => {
//                 const dir = normalizeDir(s.maneuver);
//                 const streetName = s.html_instructions
//                     ? shortenStreetName(s.html_instructions)
//                     : "Continue";
//                 return {
//                     dir,
//                     distanceMeters: s.distance?.value || 100,
//                     lat: s.end_location.lat,
//                     lng: s.end_location.lng,
//                     streetName,
//                 };
//             });
//
//             setSteps(stepsData);
//             return stepsData;   // ✅ return computed steps
//         } catch (err) {
//             console.error("❌ Error fetching directions:", err);
//             return [];
//         }
//     };
//
//
//     const startNavigation = async (destination: string) => {
//         const {status} = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") {
//             Alert.alert("Permission required", "Allow location access.");
//             return;
//         }
//
//         const location = await Location.getCurrentPositionAsync({});
//         const origin = `${location.coords.latitude},${location.coords.longitude}`;
//         userPositionRef.current = location;
//
//         // ✅ get steps directly
//         const routeSteps = await fetchDirections(origin, destination);
//
//         if (routeSteps.length > 0) {
//             const firstStep = routeSteps[0];
//             await sendDirection(firstStep.dir, firstStep.distanceMeters);
//             setCurrentStreet(firstStep.streetName);
//             setCurrentDistance(firstStep.distanceMeters);
//         }
//
//         Location.watchPositionAsync(
//             {accuracy: Location.Accuracy.High, distanceInterval: 5},
//             (loc) => {
//                 userPositionRef.current = loc;
//                 const now = Date.now();
//                 if (now - lastUpdateTimeRef.current < 500) return;
//                 lastUpdateTimeRef.current = now;
//
//                 if (!routeSteps.length) return;
//
//                 const currentStep = routeSteps[0];
//                 const remaining = getDistanceMeters(
//                     loc.coords.latitude,
//                     loc.coords.longitude,
//                     currentStep.lat,
//                     currentStep.lng
//                 );
//
//                 sendDirection(currentStep.dir, remaining);
//                 setCurrentStreet(currentStep.streetName);
//                 setCurrentDistance(Math.round(remaining));
//
//                 if (remaining < 5) {
//                     routeSteps.shift();   // ✅ move to next step
//                     setSteps([...routeSteps]);
//                 }
//             }
//         );
//     };
//
//
//     return {steps, currentDirection, currentStreet, currentDistance, startNavigation};
// }

import {useRef, useState} from "react";
import * as Location from "expo-location";
import axios from "axios";
import {encode as btoa} from "base-64";
import {Alert} from "react-native";
import {Device} from "react-native-ble-plx";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

interface Step {
    dir: string;
    distanceMeters: number;
    lat: number;
    lng: number;
    streetName: string;
}

export function useNavigationSteps(
    connectedDevice: Device | null,
    SERVICE_UUID: string,
    CHARACTERISTIC_UUID: string
) {
    const [steps, setSteps] = useState<Step[]>([]);
    const [currentDirection, setCurrentDirection] = useState<string>("Getting Directions...");
    const [currentStreet, setCurrentStreet] = useState<string>("");
    const [currentDistance, setCurrentDistance] = useState<number>(0);

    const userPositionRef = useRef<Location.LocationObject | null>(null);
    const lastUpdateTimeRef = useRef<number>(0);
    const destinationRef = useRef<string>(""); // save destination for rerouting

    const normalizeDir = (maneuver?: string): string => {
        if (!maneuver) return "STRAIGHT";
        switch (maneuver.toLowerCase()) {
            case "turn-slight-left":
                return "TURN_SLIGHT_LEFT";
            case "turn-left":
                return "TURN_LEFT";
            case "turn-sharp-left":
                return "TURN_SHARP_LEFT";
            case "turn-slight-right":
                return "TURN_SLIGHT_RIGHT";
            case "turn-right":
                return "TURN_RIGHT";
            case "turn-sharp-right":
                return "TURN_SHARP_RIGHT";
            case "uturn-left":
                return "UTURN_LEFT";
            case "uturn-right":
                return "UTURN_RIGHT";
            case "merge":
                return "MERGE";
            case "ramp-left":
                return "RAMP_LEFT";
            case "ramp-right":
                return "RAMP_RIGHT";
            case "fork-left":
                return "FORK_LEFT";
            case "fork-right":
                return "FORK_RIGHT";
            case "roundabout-left":
                return "ROUNDABOUT_LEFT";
            case "roundabout-right":
                return "ROUNDABOUT_RIGHT";
            case "arrive":
                return "ARRIVE";
            case "ferry":
                return "FERRY";
            case "ferry-train":
                return "FERRY_TRAIN";
            default:
                return "STRAIGHT";
        }
    };

    const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "");

    // const shortenStreetName = (instruction: string) => {
    //     const clean = stripHtml(instruction);
    //     const match = clean.match(/towards\s+(.*)/i);
    //     return match ? `towards ${match[1]}` : clean;
    // };
    const shortenStreetName = (instruction: string): string => {
        const clean = stripHtml(instruction);

        // Case 1: "Head south on This Street"
        const headMatch = clean.match(/Head [^ ]+ on (.+)/i);
        if (headMatch && headMatch[1]) {
            return `TOWARDS ${headMatch[1].trim()}`;
        }

        // Case 2: "Turn left onto Some Road" / "Continue towards Some Street"
        const ontoMatch = clean.match(/(?:onto|towards)\s+(.+)/i);
        if (ontoMatch && ontoMatch[1]) {
            return `TOWARDS ${ontoMatch[1].trim()}`;
        }

        // Case 3: If it already looks like a road name by itself
        if (/road|street|lane|avenue|blvd|drive|rd|st/i.test(clean)) {
            return `TOWARDS ${clean.trim()}`;
        }

        // Fallback → just return instruction as-is (like "Destination will be on the left")
        return clean;
    };


    const getDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (x: number) => (x * Math.PI) / 180;
        const R = 6371000;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const sendDirection = async (direction: string, distance: number) => {
        if (!connectedDevice) return;
        try {
            const services = await connectedDevice.services();
            for (const service of services) {
                if (service.uuid === SERVICE_UUID) {
                    const characteristics = await service.characteristics();
                    for (const char of characteristics) {
                        if (char.uuid === CHARACTERISTIC_UUID) {
                            const message = `${direction}:${Math.round(distance)}`;
                            await char.writeWithoutResponse(btoa(message));
                            console.log("📤 Sent:", message);
                            setCurrentDirection(`${direction} (${Math.round(distance)}m)`);
                            setCurrentDistance(Math.round(distance));
                        }
                    }
                }
            }
        } catch (err) {
            console.warn("Send error:", err);
        }
    };

    const fetchDirections = async (origin: string, destination: string): Promise<Step[]> => {
        try {
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
                origin
            )}&destination=${encodeURIComponent(destination)}&mode=driving&key=${GOOGLE_API_KEY}`;

            const {data} = await axios.get(url);
            if (!data.routes?.length) throw new Error("No route found");

            const leg = data.routes[0].legs[0];
            const stepsData: Step[] = leg.steps.map((s: any) => {
                const dir = normalizeDir(s.maneuver);
                const streetName = s.html_instructions
                    ? shortenStreetName(s.html_instructions)
                    : "Continue";
                return {
                    dir,
                    distanceMeters: s.distance?.value || 100,
                    lat: s.end_location.lat,
                    lng: s.end_location.lng,
                    streetName,
                };
            });

            setSteps(stepsData);
            return stepsData;
        } catch (err) {
            console.error("❌ Error fetching directions:", err);
            return [];
        }
    };

    const startNavigation = async (destination: string) => {
        destinationRef.current = destination;

        const {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission required", "Allow location access.");
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const origin = `${location.coords.latitude},${location.coords.longitude}`;
        userPositionRef.current = location;

        let routeSteps = await fetchDirections(origin, destination);

        if (routeSteps.length > 0) {
            const firstStep = routeSteps[0];
            await sendDirection(firstStep.dir, firstStep.distanceMeters);
            setCurrentStreet(firstStep.streetName);
            setCurrentDistance(firstStep.distanceMeters);
        }

        Location.watchPositionAsync(
            {accuracy: Location.Accuracy.High, distanceInterval: 5},
            async (loc) => {
                userPositionRef.current = loc;
                const now = Date.now();
                if (now - lastUpdateTimeRef.current < 500) return;
                lastUpdateTimeRef.current = now;

                if (!routeSteps.length) return;

                const currentStep = routeSteps[0];
                const remaining = getDistanceMeters(
                    loc.coords.latitude,
                    loc.coords.longitude,
                    currentStep.lat,
                    currentStep.lng
                );

                // ✅ update next step 20m before reaching
                if (remaining <= 20) {
                    routeSteps.shift();
                    setSteps([...routeSteps]);
                    if (routeSteps.length > 0) {
                        const next = routeSteps[0];
                        await sendDirection(next.dir, next.distanceMeters);
                        setCurrentStreet(next.streetName);
                        setCurrentDistance(next.distanceMeters);
                        return;
                    }
                }

                // ✅ if user goes off-route (missed turn), reroute
                if (remaining > 30 && routeSteps.length > 0) {
                    console.log("⚠️ Off-route, recalculating...");
                    const newOrigin = `${loc.coords.latitude},${loc.coords.longitude}`;
                    routeSteps = await fetchDirections(newOrigin, destinationRef.current);
                    if (routeSteps.length > 0) {
                        const first = routeSteps[0];
                        await sendDirection(first.dir, first.distanceMeters);
                        setCurrentStreet(first.streetName);
                        setCurrentDistance(first.distanceMeters);
                    }
                    return;
                }

                // normal update
                sendDirection(currentStep.dir, remaining);
                setCurrentStreet(currentStep.streetName);
                setCurrentDistance(Math.round(remaining));
            }
        );
    };

    return {steps, currentDirection, currentStreet, currentDistance, startNavigation};
}
