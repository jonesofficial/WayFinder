import React, {useState} from 'react';
import {Animated, Linking, Platform, TouchableWithoutFeedback, View,} from 'react-native';

const ToggleButton = () => {
    const [isOn, setIsOn] = useState(false);
    const animatedValue = useState(new Animated.Value(0))[0];

    const toggle = () => {
        const newValue = !isOn;

        Animated.timing(animatedValue, {
            toValue: newValue ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();

        setIsOn(newValue);

        // 👉 Redirect to settings when toggled ON
        if (newValue) {
            if (Platform.OS === 'android') {
                Linking.openSettings();
            } else if (Platform.OS === 'ios') {
                Linking.openURL('App-Prefs:Bluetooth'); // Might not work on iOS 16+
            }
        }
    };

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 28],
    });

    return (
        <View className="items-center mt-6">
            <TouchableWithoutFeedback onPress={toggle}>
                <View
                    className={`w-16 h-9 rounded-full p-1 ${
                        isOn ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                >
                    <Animated.View
                        className="w-7 h-7 bg-white rounded-full"
                        style={{transform: [{translateX}]}}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

export default ToggleButton;
