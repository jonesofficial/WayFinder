import React, {createContext, ReactNode, useContext, useState} from "react";
import {Image, Modal, Text, View} from "react-native";
import {images} from "@/constants";

type LoadingContextType = {
    percent: number;
    active: boolean;
    setPercent: (value: number) => void;
    reset: () => void;
    finish: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({children}: { children: ReactNode }) => {
    const [percent, setPercentState] = useState(0);
    const [active, setActive] = useState(false);

    const setPercent = (value: number) => {
        setActive(true);
        setPercentState(value);
    };

    const reset = () => {
        setActive(true);
        setPercentState(0);
    };

    const finish = () => {
        setPercentState(100);
        setTimeout(() => setActive(false), 800); // hide after finishing
    };

    return (
        <LoadingContext.Provider value={{percent, active, setPercent, reset, finish}}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoadingProgress = () => {
    const ctx = useContext(LoadingContext);
    if (!ctx) throw new Error("useLoadingProgress must be used inside LoadingProvider");
    return ctx;
};

// 👇 Global overlay loader
export const GlobalLoader = () => {
    const {percent, active} = useLoadingProgress();

    if (!active) return null;

    return (
        <Modal transparent animationType="fade">
            <View className="flex-1 bg-white items-center justify-center">
                {/* Center icon */}
                <Image
                    source={images.icon} // change path to your icon
                    style={{width: 120, height: 120, resizeMode: "contain"}}
                />

                {/* Progress bar at bottom */}
                <View className="absolute bottom-10 w-[80%] h-3 bg-gray-200 rounded-full overflow-hidden">
                    <View
                        style={{
                            width: `${percent}%`,
                            height: "100%",
                            backgroundColor: "#000", // black bar
                        }}
                    />
                </View>

                <Text style={{position: "absolute", bottom: 4, fontFamily: "Jakarta-SemiBold", color: "#4B5563"}}>
                    {percent}%
                </Text>
            </View>
        </Modal>
    );
};
