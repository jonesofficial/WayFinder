import {GestureResponderEvent, Text, TouchableOpacity} from "react-native";
import React from "react";

type Variant = "primary" | "secondary" | "danger" | "success" | "outline" | "default";

export interface ButtonProps {
    onPress: (event: GestureResponderEvent) => void;
    title: string;
    bgVariant?: Variant;
    textVariant?: Variant;
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
}

const getBgVariantStyle = (variant?: Variant) => {
    switch (variant) {
        case "secondary":
            return "bg-gray-500";
        case "danger":
            return "bg-red-500";
        case "success":
            return "bg-green-500";
        case "outline":
            return "bg-transparent border border-neutral-300";
        default:
            return "bg-[#03045E]";
    }
};

const getTextVariantStyle = (variant?: Variant) => {
    switch (variant) {
        case "primary":
            return "text-white";
        case "secondary":
            return "text-primary";
        case "danger":
            return "text-white";
        case "success":
            return "text-white";
        case "outline":
            return "text-black";
        default:
            return "text-white";
    }
};

const CustomButton = ({
                          onPress,
                          title,
                          bgVariant = "primary",
                          textVariant = "primary",
                          IconLeft,
                          IconRight,
                          className = "",
                      }: ButtonProps) => (
    <TouchableOpacity
        onPress={onPress}
        className={`w-full rounded-full flex flex-row items-center justify-center px-4 py-3 shadow-md ${getBgVariantStyle(bgVariant)} ${className}`}
    >
        {IconLeft && <IconLeft/>}
        <Text className={`text-lg font-bold ${getTextVariantStyle(textVariant)} mx-2`}>
            {title}
        </Text>
        {IconRight && <IconRight/>}
    </TouchableOpacity>
);

export default CustomButton;
