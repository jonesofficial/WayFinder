import {Text, TouchableOpacity, View} from "react-native";

type Favorite = {
    id: number;
    name: string;
    address?: string;
    marker_type?: string;
};

type Props = {
    favorite: Favorite;
    onDelete: (id: number) => void;
};

const FavoriteCard = ({favorite, onDelete}: Props) => {
    return (
        <View className="flex-row justify-between items-center mb-3 p-4 bg-white rounded-2xl shadow">
            <View className="flex-1">
                <Text className="text-lg font-JakartaBold">{favorite.name}</Text>
                {favorite.address && (
                    <Text className="text-sm text-gray-500 mt-1">{favorite.address}</Text>
                )}
                {favorite.marker_type && (
                    <Text className="text-xs text-blue-500 mt-1 capitalize">
                        Marker: {favorite.marker_type}
                    </Text>
                )}
            </View>

            <TouchableOpacity
                className="px-3 py-1 bg-red-100 rounded-xl"
                onPress={() => onDelete(favorite.id)}
            >
                <Text className="text-red-600 font-semibold">Delete</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FavoriteCard;
