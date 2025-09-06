import {Text, View} from "react-native";

import type {Step} from "@/store";

type Props = {
    currentStep: Step | null;
    nextStep: Step | null;
    remainingDistance: number;
};

export default function TurnInstructionCard({currentStep, nextStep, remainingDistance}: Props) {
    if (!currentStep) return null;

    const arrow =
        currentStep.dir.includes("LEFT") ? "⬅️" :
            currentStep.dir.includes("RIGHT") ? "➡️" :
                "⬆️";

    return (
        <View className="bg-green-600 rounded-2xl px-4 py-3 shadow-lg items-center">
            <Text className="text-white text-2xl font-JakartaBold">
                {arrow} {Math.round(remainingDistance)} m
            </Text>
            <Text className="text-white text-lg font-JakartaMedium mt-1">
                {currentStep.streetName}
            </Text>
            {nextStep && (
                <Text className="text-white text-sm mt-2 opacity-80">
                    Then {nextStep.dir.replace("_", " ").toLowerCase()}
                </Text>
            )}
        </View>
    );
}
