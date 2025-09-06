import React from "react";
import {ActivityIndicator, TouchableOpacity} from "react-native";
import {RefreshCcw} from "lucide-react-native";

interface RefreshButtonProps {
    loading: boolean;
    onPress: () => void;
}

export default function RefreshButton({loading, onPress}: RefreshButtonProps) {
    return (
        <TouchableOpacity
            disabled={loading}
            onPress={onPress}
            className={`bg-primary rounded-full w-12 h-12 items-center justify-center mt-4 ${
                loading ? "opacity-70" : ""
            }`}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#fff"/>
            ) : (
                <RefreshCcw size={22} color="#fff"/>
            )}
        </TouchableOpacity>
    );
}
