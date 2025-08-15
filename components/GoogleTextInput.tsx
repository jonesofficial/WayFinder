import {Image, Keyboard, View} from "react-native";
import {GoogleInputProps} from "@/types/type";
import React from "react";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import 'react-native-get-random-values';
import {icons} from "@/constants";
import {useLocationStore} from "@/store";


const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;


const GoogleTextInput = ({
                             icon,
                             initialLocation,
                             containerStyle,
                             textInputBackgroundColor,
                             handlePress,
                         }: GoogleInputProps) => {
    const {userLatitude, userLongitude} = useLocationStore();


    if (!userLatitude || !userLongitude) return null;
    return (

        <View
            className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
        >
            <GooglePlacesAutocomplete
                fetchDetails={true}
                predefinedPlaces={[]}
                placeholder="Search"
                listViewDisplayed={"auto"}
                minLength={2}
                debounce={200}
                timeout={10000}
                styles={{
                    textInputContainer: {
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 20,
                        marginHorizontal: 20,
                        position: "relative",
                        shadowColor: "#d4d4d4",
                    },
                    textInput: {
                        flex: 1,
                        backgroundColor: textInputBackgroundColor
                            ? textInputBackgroundColor
                            : "white",
                        fontSize: 16,
                        fontWeight: "600",
                        marginTop: 5,
                        width: "100%",
                        borderRadius: 20,
                    },
                    listView: {
                        backgroundColor: textInputBackgroundColor
                            ? textInputBackgroundColor
                            : "white",
                        position: "absolute",
                        top: 50,
                        width: "100%",
                        borderRadius: 10,
                        shadowColor: "#d4d4d4",
                        zIndex: 1000,
                        elevation: 10,

                    },
                }}
                onPress={(data, details = null) => {
                    if (!details?.geometry?.location) {
                        console.warn("No location details found for:", data.description);
                        return;
                    }
                    Keyboard.dismiss();
                    const location = {
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                        address: data.description,
                    };
                    console.log("GoogleTextInput - Selected Location:", JSON.stringify(location, null, 2));
                    handlePress(location);
                }}
                query={{
                    key: googlePlacesApiKey,
                    language: "en",
                    components: "country:in",                     // 🇮🇳 Limit to India// Only addresses & localities
                    location: `${userLatitude},${userLongitude}`, // Bias to user's current location
                    radius: 30000                                 // 30 km bias radius
                }}

                renderLeftButton={() => (
                    <View className="justify-center items-center w-6 h-6">
                        <Image
                            source={icon ? icon : icons.search}
                            className="w-6 h-6"
                            resizeMode="contain"
                        />
                    </View>
                )}
                textInputProps={{
                    placeholderTextColor: "gray",
                    placeholder: initialLocation ?? "Where do you want to go?",
                    blurOnSubmit: true, // 🟢 Important for Android
                    returnKeyType: "search", // Optional, UX
                    onSubmitEditing: () => Keyboard.dismiss(), // 🟢 Dismiss keyboard
                }}

                onFail={(error) =>
                    console.warn("Places API error:", error
                    )}
            />
        </View>
    );
};

export default GoogleTextInput;



