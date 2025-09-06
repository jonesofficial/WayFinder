import React, {useMemo} from "react";
import {Text, View} from "react-native";
import Svg, {Circle, Path, Polyline} from "react-native-svg";
import type {Step} from "@/store"; // <-- reuse type directly
import {useLocationStore} from "@/store"; // <-- your zustand store

type PolylinePreviewProps = {
    title?: string;
    steps?: Step[]; // can pass manually, otherwise will fallback to store
};

const PolylinePreview = ({title, steps}: PolylinePreviewProps) => {
    const {userLatitude, userLongitude, distance, duration, steps: storeSteps} =
        useLocationStore();

    const routeSteps = steps ?? storeSteps; // use prop or fallback to store
    const scale = 0.001;

    // Extract polyline points
    const {polyPoints, offsetLat, offsetLng, polyline} = useMemo(() => {
        if (!routeSteps.length)
            return {polyPoints: "", offsetLat: 0, offsetLng: 0, polyline: []};

        const polyline = routeSteps.map((s) => ({lat: s.lat, lng: s.lng}));
        const offsetLat = polyline[0].lat;
        const offsetLng = polyline[0].lng;

        const polyPoints = polyline
            .map(
                (s) =>
                    `${(s.lng - offsetLng) / scale},${-(s.lat - offsetLat) / scale}`
            )
            .join(" ");

        return {polyPoints, offsetLat, offsetLng, polyline};
    }, [routeSteps, scale]);

    // Cursor (user projected position)
    const cursor = useMemo(() => {
        if (!polyline.length || userLatitude == null || userLongitude == null)
            return null;

        return {
            x: (userLongitude - offsetLng) / scale,
            y: -(userLatitude - offsetLat) / scale,
        };
    }, [polyline, userLatitude, userLongitude, offsetLat, offsetLng, scale]);

    return (
        <View className="w-full my-3 px-4">
            {title && (
                <Text className="mb-2 text-gray-700 font-JakartaBold text-sm">
                    {title}
                </Text>
            )}

            <View className="w-full bg-white rounded-xl border border-gray-300 p-4 shadow-md">
                {distance && duration && (
                    <Text className="text-gray-900 font-JakartaBold text-base text-center mb-2">
                        🚗 {distance} • {duration}
                    </Text>
                )}

                {/* Mini map with route preview */}
                <Svg height="150" width="100%">
                    {/* Full route */}
                    <Polyline
                        points={polyPoints}
                        stroke="gray"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Highlight next turn */}
                    {polyline[1] && (
                        <Circle
                            cx={(polyline[1].lng - offsetLng) / scale}
                            cy={-(polyline[1].lat - offsetLat) / scale}
                            r="6"
                            fill="orange"
                        />
                    )}

                    {/* User cursor */}
                    {cursor && (
                        <Path
                            d={`M${cursor.x},${cursor.y} l8,16 l-16,0 z`}
                            fill="blue"
                            stroke="white"
                            strokeWidth="2"
                        />
                    )}
                </Svg>

                {/* Next step info */}
                <View className="flex-row items-center justify-center mt-3">
                    <Text className="text-gray-900 text-lg font-JakartaBold">
                        {routeSteps[0]?.dir ? `${routeSteps[0].dir} • ` : ""}
                        {routeSteps[0]?.distanceMeters
                            ? `${Math.round(routeSteps[0].distanceMeters)} m`
                            : "—"}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default PolylinePreview;
