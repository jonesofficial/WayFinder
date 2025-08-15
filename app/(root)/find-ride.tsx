import {Text, View} from 'react-native';
import {useLocationStore} from "@/store";
import RideLayout from "@/components/RideLayout";
import GoogleTextInput from '@/components/GoogleTextInput';
import {icons} from '@/constants';
import CustomButton from '@/components/CustomButton';
import {router} from 'expo-router';

export default function FindRide() {

    const {
        userAddress,
        destinationAddress,
        setDestinationLocation,
        setUserLocation,
        distance,
        duration,
        setRouteInfo
    } = useLocationStore();

    console.log("User:", userAddress);
    console.log("Destination:", destinationAddress);


    return (
        <RideLayout title="Ride" snapPoints={['85%']}>
            <View className="my-3">
                <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>

                <GoogleTextInput
                    icon={icons.target}
                    initialLocation={userAddress!}
                    containerStyle="bg-neutral-100"
                    textInputBackgroundColor="#f5f5f5"
                    handlePress={(location) => setUserLocation(location)}
                />
            </View>

            <View className="my-3">
                <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>

                <GoogleTextInput
                    icon={icons.map}
                    initialLocation={destinationAddress!}
                    containerStyle="bg-neutral-100"
                    textInputBackgroundColor="transparent"
                    handlePress={(location) => setDestinationLocation(location)}
                />
            </View>

            <View className="my-4 flex-row justify-between">
                <View className="flex-1 bg-white mr-2 rounded-2xl px-4 py-3 shadow-md items-center justify-center">
                    <Text className="text-sm text-neutral-500 font-JakartaMedium">Distance</Text>
                    <Text className="text-xl font-JakartaBold text-black">
                        {distance ? `${Number(distance).toFixed(2)} km` : '—'}
                    </Text>
                </View>

                <View className="flex-1 bg-white ml-2 rounded-2xl px-4 py-3 shadow-md items-center justify-center">
                    <Text className="text-sm text-neutral-500 font-JakartaMedium">Duration</Text>
                    <Text className="text-xl font-JakartaBold text-black">
                        {duration ?? '—'}
                    </Text>
                </View>
            </View>


            <CustomButton
                title="Get Directions Now!"
                onPress={() => router.push("/(root)/confirm-ride")}
                className="mt-5"
            />
        </RideLayout>
    )
}
