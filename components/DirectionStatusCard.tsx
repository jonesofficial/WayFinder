import React from "react";
import {Text, View} from "react-native";
import {
    ArrowDown,
    ArrowDownLeft,
    ArrowDownRight,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    ArrowUpLeft,
    ArrowUpRight,
    CircleArrowLeft,
    CircleArrowRight,
    RefreshCcw,
    Route,
    Split,
} from "lucide-react-native";

interface Props {
    direction: string;   // STRAIGHT, TURN_LEFT, etc.
    distance: string;    // e.g., "187m"
    streetName?: string; // Optional
    onRetry: () => Promise<void>; // 🔹 parent fn to resend directions
}

// 🔹 Utility to shorten long street names
function formatStreetName(name: string): string {
    if (!name) return "";
    let shortened = name;

    const replacements: Record<string, string> = {
        Street: "St",
        Road: "Rd",
        Avenue: "Ave",
        Boulevard: "Blvd",
        Drive: "Dr",
        Lane: "Ln",
        Terrace: "Ter",
        Court: "Ct",
        Highway: "Hwy",
        Expressway: "Expy",
    };

    Object.entries(replacements).forEach(([full, abbr]) => {
        const regex = new RegExp(`\\b${full}\\b`, "gi");
        shortened = shortened.replace(regex, abbr);
    });

    if (shortened.length > 25) shortened = shortened.slice(0, 25) + "…";
    return shortened;
}

export default function DirectionStatusCard({
                                                direction,
                                                distance,
                                                streetName,
                                                onRetry,
                                            }: Props) {

    const renderIcon = () => {
        switch (direction.toUpperCase()) {
            case "TURN_LEFT":
                return <ArrowLeft size={64} color="#0077B6"/>;
            case "TURN_RIGHT":
                return <ArrowRight size={64} color="#0077B6"/>;
            case "TURN_SLIGHT_LEFT":
                return <ArrowUpLeft size={64} color="#0077B6"/>;
            case "TURN_SLIGHT_RIGHT":
                return <ArrowUpRight size={64} color="#0077B6"/>;
            case "TURN_SHARP_LEFT":
                return <ArrowDownLeft size={64} color="#0077B6"/>;
            case "TURN_SHARP_RIGHT":
                return <ArrowDownRight size={64} color="#0077B6"/>;
            case "UTURN_LEFT":
            case "UTURN_RIGHT":
                return <RefreshCcw size={64} color="#0077B6"/>;
            case "MERGE":
                return <Route size={64} color="#0077B6"/>;
            case "RAMP_LEFT":
            case "FORK_LEFT":
                return <CircleArrowLeft size={64} color="#0077B6"/>;
            case "RAMP_RIGHT":
            case "FORK_RIGHT":
                return <CircleArrowRight size={64} color="#0077B6"/>;
            case "ROUNDABOUT_LEFT":
            case "ROUNDABOUT_RIGHT":
                return <Split size={64} color="#0077B6"/>;
            case "ARRIVE":
                return <ArrowDown size={64} color="green"/>;
            default:
                return <ArrowUp size={64} color="#0077B6"/>;
        }
    };

    const cleanDirection = direction.replace(/\(.*?\)/, ""); // remove anything in ( )


    const formatDirection = (dir: string) =>
        dir.toUpperCase().replace(/_/g, " ");

    return (
        <View className="w-full bg-white rounded-2xl px-5 py-6 shadow-md flex-row items-center">
            {/* Icon */}
            <View className="mr-5">{renderIcon()}</View>

            {/* Text + Refresh */}
            <View className="flex-1">
                <Text className="text-2xl font-JakartaBold text-black mb-2">
                    {formatDirection(cleanDirection)}
                </Text>

                <Text className="text-2xl font-JakartaBold text-secondary">
                    {distance}
                </Text>

                {streetName && (
                    <Text
                        className="text-base text-neutral-500 mt-1"
                        numberOfLines={3}
                        ellipsizeMode="tail"
                    >
                        {formatStreetName(streetName)}
                    </Text>
                )}
            </View>
        </View>
    );
}
