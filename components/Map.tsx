import React, {useEffect, useMemo, useRef, useState} from "react";
import {Platform, Text, View} from "react-native";
import {useLocationStore} from "@/store";
import {calculateRegion} from "@/lib/map";
import {icons} from "@/constants";

const Map = () => {
    const [MapComponents, setMapComponents] = useState<any>(null);
    const [routeCoords, setRouteCoords] = useState<any[]>([]); // ✅ store route polyline

    const {
        userLongitude,
        userLatitude,
        destinationLongitude,
        destinationLatitude,
    } = useLocationStore();

    const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (Platform.OS !== "web") {
            (async () => {
                const MapViewModule = await import("react-native-maps");
                const MapViewDirectionsModule = await import("react-native-maps-directions");
                setMapComponents({
                    MapView: MapViewModule.default,
                    Marker: MapViewModule.Marker,
                    PROVIDER_GOOGLE: MapViewModule.PROVIDER_GOOGLE,
                    MapViewDirections: MapViewDirectionsModule.default,
                });
            })();
        }
    }, []);

    const region = useMemo(() => {
        return calculateRegion({
            userLatitude,
            userLongitude,
            destinationLatitude,
            destinationLongitude,
        });
    }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

    // ✅ Whenever user moves or new route loaded → keep auto-zoom
    useEffect(() => {
        if (mapRef.current && routeCoords.length > 0) {
            mapRef.current.fitToCoordinates(routeCoords, {
                edgePadding: {top: 100, right: 100, bottom: 100, left: 100},
                animated: true,
            });
        }
    }, [userLatitude, userLongitude, routeCoords]);

    if (Platform.OS === "web") {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize: 16, color: "gray"}}>
                    Map is not supported on web.
                </Text>
            </View>
        );
    }

    if (!MapComponents) {
        return <View style={{flex: 1}}/>;
    }

    const {MapView, Marker, PROVIDER_GOOGLE, MapViewDirections} = MapComponents;

    return (
        <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{width: "100%", height: "100%"}}
            region={
                destinationLatitude && destinationLongitude
                    ? undefined
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
                        origin={{latitude: userLatitude, longitude: userLongitude}}
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
                            if (
                                !result ||
                                typeof result.distance !== "number" ||
                                typeof result.duration !== "number"
                            ) {
                                console.warn("❌ Invalid directions result:", result);
                                return;
                            }

                            // ✅ Save route coordinates for auto-zoom updates
                            setRouteCoords(result.coordinates);

                            const distance = Number(result.distance.toFixed(2));
                            const totalMinutes = result.duration;
                            const hours = Math.floor(totalMinutes / 60);
                            const minutes = Math.round(totalMinutes % 60);
                            const formattedTime =
                                hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

                            useLocationStore.getState().setRouteInfo({
                                distance,
                                duration: formattedTime,
                            });
                        }}
                    />
                </>
            )}
        </MapView>
    );
};

export default Map;