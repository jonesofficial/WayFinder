// import {useEffect, useState} from "react";
// import {Alert, FlatList, Text, TextInput, TouchableOpacity, View} from "react-native";
// import RideLayout from "@/components/RideLayout";
// import GoogleTextInput from "@/components/GoogleTextInput";
// import FavoriteCard from "@/components/FavoriteCard";
// import axios from "axios";
// import {useAuth, useUser} from "@clerk/clerk-expo";
//
//
// const markerTypes = ["star", "heart", "pin", "home"];
// const API_URL = "http://192.168.29.150:3000/api/favorites"; // Update to your serverless API URL
//
// type Favorite = {
//     id: number;
//     name: string;
//     address?: string;
//     marker_type?: string;
// };
//
// const Favorites = () => {
//     const {user} = useUser();
//     const {getToken} = useAuth();
//     const [favorites, setFavorites] = useState<Favorite[]>([]);
//     const [name, setName] = useState("");
//     const [location, setLocation] = useState<any | null>(null);
//     const [selectedMarker, setSelectedMarker] = useState(markerTypes[0]);
//
//     // Fetch favorites
//     const fetchFavorites = async () => {
//         if (!user) return;
//         try {
//             const token = await getToken();
//             const res = await axios.get(API_URL, {
//                 headers: {Authorization: `Bearer ${token}`},
//             });
//             setFavorites(res.data.favorites);
//         } catch (error) {
//             console.error(error);
//             Alert.alert("Error", "Failed to fetch favorites");
//         }
//     };
//
//     useEffect(() => {
//         fetchFavorites();
//     }, [user]);
//
//     // Save favorite
//     const handleSaveFavorite = async () => {
//         if (!user) {
//             Alert.alert("Error", "You must be logged in to save favorites");
//             return;
//         }
//         if (!name || !location) {
//             Alert.alert("Error", "Please provide a name and location");
//             return;
//         }
//
//         try {
//             const token = await getToken();
//             await axios.post(
//                 API_URL,
//                 {
//                     name,
//                     address: location.address ?? "",
//                     lat: location.latitude,
//                     lng: location.longitude,
//                     marker_type: selectedMarker,
//                 },
//                 {headers: {Authorization: `Bearer ${token}`}}
//             );
//
//             Alert.alert("Success", "Favorite added!");
//             setName("");
//             setLocation(null);
//             setSelectedMarker(markerTypes[0]);
//             fetchFavorites();
//         } catch (error) {
//             console.error(error);
//             Alert.alert("Error", "Failed to add favorite");
//         }
//     };
//
//     // Delete favorite
//     const handleDeleteFavorite = async (id: number) => {
//         try {
//             const token = await getToken();
//             await axios.delete(API_URL, {
//                 headers: {Authorization: `Bearer ${token}`},
//                 data: {id},
//             });
//             setFavorites((prev) => prev.filter((fav) => fav.id !== id));
//         } catch (error) {
//             console.error(error);
//             Alert.alert("Error", "Failed to delete favorite");
//         }
//     };
//
//     return (
//         <RideLayout title="Favorites" snapPoints={["50%", "85%"]}>
//             <View className="flex-1">
//                 <Text className="text-lg font-JakartaSemiBold mb-2">Add a Favorite</Text>
//
//                 <TextInput
//                     className="border border-gray-300 rounded-lg p-3 mb-3"
//                     placeholder="Favorite name"
//                     value={name}
//                     onChangeText={setName}
//                 />
//
//                 <GoogleTextInput
//                     containerStyle="w-full mb-3"
//                     handlePress={(loc) => setLocation(loc)}
//                     initialLocation={location?.address}
//                 />
//
//                 <View className="flex-row gap-4 mb-4">
//                     {markerTypes.map((marker) => (
//                         <TouchableOpacity
//                             key={marker}
//                             className={`px-4 py-2 rounded-full border ${
//                                 selectedMarker === marker ? "border-blue-600 bg-blue-100" : "border-gray-300"
//                             }`}
//                             onPress={() => setSelectedMarker(marker)}
//                         >
//                             <Text className="capitalize">{marker}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//
//                 <TouchableOpacity
//                     className="bg-blue-600 p-4 rounded-lg mb-6"
//                     onPress={handleSaveFavorite}
//                 >
//                     <Text className="text-white font-JakartaMedium text-center">Save Favorite</Text>
//                 </TouchableOpacity>
//
//                 <Text className="text-lg font-JakartaSemiBold mb-2">Your Favorites</Text>
//                 <FlatList
//                     data={favorites}
//                     keyExtractor={(item) => item.id.toString()}
//                     renderItem={({item}) => (
//                         <FavoriteCard favorite={item} onDelete={handleDeleteFavorite}/>
//                     )}
//                 />
//             </View>
//         </RideLayout>
//     );
// };
//
// export default Favorites;


import React from "react";
import {Text, View} from "react-native";

const FavoritesScreen = () => {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-3xl font-bold text-black mb-2">⭐ Favorites</Text>
            <Text className="text-lg text-gray-500">More features coming soon...</Text>
        </View>
    );
};

export default FavoritesScreen;
