import {Text, View,} from "react-native";
import RideLayout from "@/components/RideLayout";
import {images} from "@/constants";
import LottieView from "lottie-react-native";
import ToggleButton from "@/components/ToggleButton";

const ConfirmRide = () => {

    return (
        <RideLayout title="Connect Device" snapPoints={["85%"]}>
            <View className="my-3 items-center ">
                <View className="flex-row justify-between items-center w-full px-4 mb-4">
                    <Text className="font-JakartaBold text-2xl mt-4">Bluetooth</Text>
                    <ToggleButton/>
                </View>

                <Text className="text-lg font-JakartaSemiBold">
                    Searching for devices.....
                </Text>
                <LottieView
                    source={images.bluetooth}
                    autoPlay
                    loop
                    style={{width: 200, height: 200}}
                />
            </View>
        </RideLayout>
    );
};

export default ConfirmRide;

