import React, {useEffect, useRef} from "react";
import {Animated, Dimensions, Easing, Text, View} from "react-native";
import {useLoadingProgress} from "./BikeLoadingBar";
import LottieView from "lottie-react-native";

const screenWidth = Dimensions.get("window").width;
const bikeWidth = 100;

const LoadingScreen = () => {
    const translateX = useRef(new Animated.Value(0)).current;
    const {percent, setPercent} = useLoadingProgress(); // ✅ shared state

    useEffect(() => {
        const id = translateX.addListener(({value}) => {
            const progress = value / (screenWidth - bikeWidth);
            const percentValue = Math.min(100, Math.floor(progress * 100));
            setPercent(percentValue);
        });

        const moveTo65 = Animated.timing(translateX, {
            toValue: (screenWidth - bikeWidth) * 0.65,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        });

        const holdAt65 = Animated.delay(1500);

        const moveTo100 = Animated.timing(translateX, {
            toValue: screenWidth - bikeWidth,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        });

        const resetPosition = Animated.timing(translateX, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
        });

        const fullCycle = Animated.sequence([moveTo65, holdAt65, moveTo100, resetPosition]);

        Animated.loop(fullCycle).start();

        return () => {
            translateX.removeListener(id);
        };
    }, [translateX, setPercent]);

    return (
        <View className="w-full h-[150px] justify-center relative">
            {/* Loading bar container */}
            <View className="absolute bottom-14 left-0 right-0 h-2 rounded bg-gray-300 overflow-hidden">
                <Animated.View
                    style={{
                        height: "100%",
                        width: `${percent}%`,
                        backgroundColor: "#03045E",
                        borderRadius: 4,
                    }}
                />
            </View>

            {/* Percentage */}
            <Text className="absolute bottom-9 left-0 right-0 text-center text-primary text-s font-JakartaBold">
                {percent}%
            </Text>

            {/* Animated bike */}
            <Animated.View
                style={{
                    transform: [
                        {translateX},
                        {translateY: -10},
                    ],
                }}
            >
                <LottieView
                    source={require("@/assets/images/Bike.json")}
                    autoPlay
                    loop
                    style={{
                        width: bikeWidth,
                        height: bikeWidth,
                        transform: [{scaleX: -1}],
                        marginBottom: -40,
                    }}
                />
            </Animated.View>
        </View>
    );
};

export default LoadingScreen;
