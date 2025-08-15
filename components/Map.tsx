import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useLocationStore} from "@/store";
import {calculateRegion} from "@/lib/map";
import React, {useEffect, useMemo, useRef} from 'react';
import {icons} from '@/constants';
import MapViewDirections from "react-native-maps-directions";


const Map = () => {
    const {
        userLongitude, userLatitude,
        destinationLongitude, destinationLatitude,
    } = useLocationStore();

    const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
    const mapRef = useRef<MapView>(null);

    const region = useMemo(() => {
        return calculateRegion({
            userLatitude,
            userLongitude,
            destinationLatitude,
            destinationLongitude,
        });
    }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

    // 🔁 Auto-zoom on both locations
    useEffect(() => {
        if (
            mapRef.current &&
            userLatitude && userLongitude &&
            destinationLatitude && destinationLongitude
        ) {
            mapRef.current.fitToCoordinates(
                [
                    {latitude: userLatitude, longitude: userLongitude},
                    {latitude: destinationLatitude, longitude: destinationLongitude},
                ],
                {
                    edgePadding: {top: 100, right: 100, bottom: 100, left: 100},
                    animated: true,
                }
            );
        }
    }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

    return (
        <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{width: '100%', height: '100%'}}
            region={
                destinationLatitude && destinationLongitude
                    ? undefined  // handled by fitToCoordinates
                    : {
                        latitude: userLatitude || 0,
                        longitude: userLongitude || 0,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }
            }
            showsUserLocation
            mapType="standard"
            userInterfaceStyle="light"
            showsPointsOfInterest={false}
        >
            {userLatitude && userLongitude && (
                <Marker
                    coordinate={{latitude: userLatitude, longitude: userLongitude}}
                    title="You"
                    image={icons.point}
                />
            )}

            {destinationLatitude && destinationLongitude && (
                <>
                    <Marker
                        coordinate={{
                            latitude: destinationLatitude,
                            longitude: destinationLongitude,
                        }}
                        title="Destination"
                        image={icons.pin}
                    />

                    <MapViewDirections
                        origin={{latitude: userLatitude!, longitude: userLongitude!}}
                        destination={{
                            latitude: destinationLatitude,
                            longitude: destinationLongitude,
                        }}
                        apikey={directionsAPI!}
                        strokeColor="#0286FF"
                        strokeWidth={4}
                        mode="DRIVING"
                        optimizeWaypoints={true}
                        onReady={(result) => {
                            // Defensive checks
                            if (!result || typeof result.distance !== "number" || typeof result.duration !== "number") {
                                console.warn("❌ Invalid directions result:", result);
                                return;
                            }

                            const distance = Number(result.distance.toFixed(2)); // Safe now
                            const totalMinutes = result.duration;
                            const hours = Math.floor(totalMinutes / 60);
                            const minutes = Math.round(totalMinutes % 60);
                            const formattedTime =
                                hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

                            useLocationStore.getState().setRouteInfo({
                                distance,
                                duration: formattedTime,
                            });

                            console.log("✅ Distance:", distance, "km");
                            console.log("✅ Duration:", formattedTime);
                        }}
                    />
                </>
            )}
        </MapView>
    );
};

export default Map;
