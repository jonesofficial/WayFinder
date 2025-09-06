import {Image, Keyboard, TouchableOpacity, View} from "react-native";
import {GoogleInputProps} from "@/types/type";
import React, {useRef, useState} from "react";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import "react-native-get-random-values";
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

    const googleRef = useRef<any>(null);
    const [hasText, setHasText] = useState(false);

    if (!userLatitude || !userLongitude) return null;

    return (
        <View
            className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
        >
            <GooglePlacesAutocomplete
                ref={googleRef}
                fetchDetails={true}
                predefinedPlaces={[]}
                placeholder="Search"
                listViewDisplayed={"auto"}
                minLength={2}
                debounce={200}
                timeout={10000}
                keyboardShouldPersistTaps="handled"
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
                        paddingRight: 35, // leave space for clear button
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

                    Keyboard.dismiss();
                    if (!details?.geometry?.location) {
                        console.warn("No location details found for:", data.description);
                        return;
                    }

                    const location = {
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                        address: data.description,
                    };
                    console.log(
                        "GoogleTextInput - Selected Location:",
                        JSON.stringify(location, null, 2)
                    );
                    handlePress(location);
                }}
                query={{
                    key: googlePlacesApiKey,
                    language: "en",
                    components: "country:in",
                    location: `${userLatitude},${userLongitude}`,
                    radius: 30000,
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
                renderRightButton={() =>
                    hasText && (
                        <TouchableOpacity
                            onPress={() => {
                                googleRef.current?.clear();
                                setHasText(false);
                            }}
                            className="justify-center items-center w-6 h-6 mr-2"
                        >
                            <Image
                                source={icons.close} // ✅ same as search button
                                className="w-3 h-3"
                                resizeMode="contain"
                                style={{tintColor: "#03045E"}} // optional → make it look different
                            />
                        </TouchableOpacity>
                    )
                }
                textInputProps={{
                    placeholderTextColor: "gray",
                    placeholder: initialLocation ?? "Where do you want to go?",
                    blurOnSubmit: true,
                    returnKeyType: "search",
                    onSubmitEditing: () => Keyboard.dismiss(),
                    onChangeText: (text) => setHasText(text.length > 0), // track input text
                }}
                onFail={(error) => console.warn("Places API error:", error)}
            />
        </View>
    );
};

export default GoogleTextInput;

