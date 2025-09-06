// import {SafeAreaView} from "react-native-safe-area-context";
// import {useAuth, useUser} from "@clerk/clerk-expo";
// import {
//     FlatList,
//     Image,
//     Keyboard,
//     KeyboardAvoidingView,
//     Platform,
//     Text,
//     TouchableOpacity,
//     TouchableWithoutFeedback,
//     View
// } from "react-native";
// import {icons} from "@/constants";
// import React, {useEffect, useState} from "react";
// import Map from "@/components/Map"
// import {useLocationStore} from "@/store";
// import * as Location from 'expo-location';
// import {router} from "expo-router";
// import GoogleTextInput from "@/components/GoogleTextInput";
// import 'react-native-get-random-values';
//
//
// export default function Page() {
//     const {user} = useUser();
//     const {signOut} = useAuth();
//
//     const {setUserLocation, setDestinationLocation} = useLocationStore();
//
//     const [hasPermissions, setHasPermissions] = useState(false);
//
//     const handleSignOut = () => {
//         signOut();
//         router.replace("/(auth)/sign-in");
//     }
//
//     const handleDestinationPress = (location: {
//         latitude: number;
//         longitude: number;
//         address: string;
//     }) => {
//         // Keyboard.dismiss();
//         // console.log("Page - handleDestinationPress:", JSON.stringify(location, null, 2));
//         setDestinationLocation(location);
//         router.push("/(root)/find-ride");
//     };
//
//
//     useEffect(() => {
//         const requestLocation = async () => {
//             let {status} = await Location.requestForegroundPermissionsAsync();
//
//             if (status !== "granted") {
//                 setHasPermissions(false);
//                 return;
//             }
//
//
//             let location = await Location.getCurrentPositionAsync();
//
//             const address = await Location.reverseGeocodeAsync({
//                 latitude: location.coords?.latitude!,
//                 longitude: location.coords?.longitude!,
//             });
//
//             setUserLocation({
//                 latitude: location.coords.latitude,
//                 longitude: location.coords.longitude,
//                 address: `${address[0].name}, ${address[0].region}`,
//             })
//         };
//
//         requestLocation();
//     }, [])
//
//     // useEffect(() => {
//     //     const requestLocation = async () => {
//     //         let {status} = await Location.requestForegroundPermissionsAsync();
//     //
//     //         if (status !== "granted") {
//     //             setHasPermissions(false);
//     //             return;
//     //         }
//     //
//     //         let location = await Location.getCurrentPositionAsync();
//     //
//     //         const address = await Location.reverseGeocodeAsync({
//     //             latitude: location.coords?.latitude!,
//     //             longitude: location.coords?.longitude!,
//     //         });
//     //
//     //         const currentLat = location.coords.latitude;
//     //         const currentLng = location.coords.longitude;
//     //         const currentAddress = `${address[0].name}, ${address[0].region}`;
//     //
//     //         const {
//     //             userLatitude,
//     //             userLongitude,
//     //             userAddress,
//     //         } = useLocationStore.getState();
//     //
//     //         const locationChanged =
//     //             userLatitude !== currentLat ||
//     //             userLongitude !== currentLng ||
//     //             userAddress !== currentAddress;
//     //
//     //         if (locationChanged) {
//     //             setUserLocation({
//     //                 latitude: currentLat,
//     //                 longitude: currentLng,
//     //                 address: currentAddress,
//     //             });
//     //         }
//     //     };
//     //
//     //     requestLocation();
//     // }, []);
//
//     return (
//
//
//         <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={{flex: 1}}
//         >
//             <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                 <SafeAreaView className={"bg-general-500 px-7"}>
//
//                     <FlatList
//                         keyboardShouldPersistTaps="handled"
//                         ListHeaderComponent={() => (
//                             <>
//                                 <View
//                                     className={"flex flex-row items-center justify-between p-5"}>
//                                     <Text className={"text-2xl capitalize font-JakartaBold "}>Welcome Rider👋
//                                         {user?.firstName || user?.emailAddresses[0].emailAddress.split('@')[0]}
//                                     </Text>
//                                     <TouchableOpacity onPress={handleSignOut}>
//                                         <Image source={icons.out} className={"h-4 w-4"}/>
//                                     </TouchableOpacity>
//                                 </View>
//
//                                 <GoogleTextInput
//                                     icon={icons.search}
//                                     containerStyle="bg-white shadow-md shadow-neutral-300"
//                                     handlePress={handleDestinationPress}
//                                 />
//
//                                 <>
//                                     <Text className={"text-2xl font-JakartaBold py-4 px-2"}>
//                                         Your Current Location
//                                     </Text>
//
//                                     <View
//                                         className={"flex flex-row items-center bg-transparent h-[600px] rounded-2xl"}>
//                                         <Map/>
//                                     </View>
//
//                                 </>
//
//                             </>
//                         )}
//                     >
//                     </FlatList>
//                 </SafeAreaView>
//             </TouchableWithoutFeedback>
//         </KeyboardAvoidingView>
//     );
// }

import React, {useEffect, useState} from "react";
import {
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuth, useUser} from "@clerk/clerk-expo";
import * as Location from "expo-location";
import {router} from "expo-router";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import {icons} from "@/constants";
import {useLocationStore} from "@/store";
import {ReactNativeModal} from "react-native-modal";
import CustomButton from "@/components/CustomButton";


export default function Page() {
    const {user} = useUser();
    const {signOut} = useAuth();

    const {setUserLocation, setDestinationLocation} = useLocationStore();
    const [hasPermissions, setHasPermissions] = useState(false);
    const [isSignOutModalVisible, setSignOutModalVisible] = useState(false);

    // Handle confirmed sign out
    const confirmSignOut = async () => {
        await signOut();
        setSignOutModalVisible(false);
        router.replace("/(auth)/sign-in");
    };

    // Set destination and navigate
    const handleDestinationPress = (location: {
        latitude: number;
        longitude: number;
        address: string;
    }) => {
        setDestinationLocation(location);
        router.push("/(root)/find-ride");
    };

    // Fetch current location on mount
    useEffect(() => {
        const requestLocation = async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                setHasPermissions(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync();
            const address = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                address: `${address[0].name}, ${address[0].region}`,
            });

            setHasPermissions(true);
        };

        requestLocation();
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{flex: 1}}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView className="flex-1 bg-general-500 px-5">
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        data={[]}
                        ListHeaderComponent={
                            <>
                                {/* Header */}
                                <View className="flex-row justify-between items-center py-5">
                                    <Text className="text-2xl font-JakartaBold">
                                        Welcome{" "}
                                        {user?.firstName ||
                                            user?.emailAddresses?.[0]?.emailAddress.split("@")[0]}
                                        👋
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setSignOutModalVisible(true)}
                                    >
                                        <Image source={icons.out} className="w-4 h-4"/>
                                    </TouchableOpacity>
                                </View>

                                {/* Search Input */}
                                <GoogleTextInput
                                    icon={icons.search}
                                    containerStyle="bg-white shadow-md shadow-neutral-300"
                                    handlePress={handleDestinationPress}
                                />


                                {/* Current Location */}
                                <Text className="text-xl font-JakartaBold py-4">
                                    Your Current Location
                                </Text>
                                <View className="h-[600px] rounded-2xl overflow-hidden">
                                    <Map/>
                                </View>
                            </>
                        }
                    />
                </SafeAreaView>
            </TouchableWithoutFeedback>

            {/* Sign-Out Confirmation Modal */}
            <ReactNativeModal isVisible={isSignOutModalVisible}>
                <View className="bg-white px-7 py-9 rounded-2xl min-h-[200px]">
                    <Text className="text-2xl font-JakartaBold text-center mb-3">
                        Sign Out
                    </Text>
                    <Text className="text-base text-gray-500 font-Jakarta text-center mb-6">
                        Are you sure you want to sign out of your account?
                    </Text>

                    <CustomButton
                        onPress={confirmSignOut}
                        title="Yes, Sign Out"
                        className="mt-2"
                    />
                    <CustomButton
                        onPress={() => setSignOutModalVisible(false)}
                        title="Cancel"
                        className="mt-3"
                        bgVariant="secondary"
                    />
                </View>
            </ReactNativeModal>
        </KeyboardAvoidingView>
    );
}


