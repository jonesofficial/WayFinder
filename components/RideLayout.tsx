// import {icons} from "@/constants";
// import {router} from "expo-router";
// import {Image, Text, TouchableOpacity, View} from "react-native";
// import {GestureHandlerRootView} from "react-native-gesture-handler";
// import Map from "@/components/Map"
// import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
// import {useRef} from "react";
//
// const RideLayout = ({children, title, snapPoints}: {
//     title: string;
//     snapPoints?: string[];
//     children: React.ReactNode
// }) => {
//
//     const bottomSheetRef = useRef<BottomSheet>(null);
//     return (
//         <GestureHandlerRootView>
//             <View className="flex-1 bg-white">
//                 <View className={"flex flex-col h-screen bg-blue-500"}>
//                     <View className={"flex flex-row absolute z-10 top-14"}>
//                         <TouchableOpacity onPress={() => router.back()}>
//                             <View className="w-10 h-10 ml-5 bg-white rounded-full items-center justify-center">
//                                 <Image
//                                     source={icons.backArrow}
//                                     resizeMode="contain"
//                                     className="w-6 h-6"
//                                 />
//                             </View>
//                         </TouchableOpacity>
//                         <Text className="text-xl font-JakartaSemiBold ml-3 mt-2">
//                             {title || "Go Back"}
//                         </Text>
//                     </View>
//                     <Map/>
//                 </View>
//
//                 <BottomSheet keyboardBehavior={"extend"} ref={bottomSheetRef} snapPoints={snapPoints || ['40%', '85%']}
//                              index={0}>
//                     <BottomSheetView style={{flex: 1, padding: 20}}>
//                         {children}
//                     </BottomSheetView>
//                 </BottomSheet>
//             </View>
//         </GestureHandlerRootView>
//     )
// }
//
// export default RideLayout;
//


import {icons} from "@/constants";
import {router} from "expo-router";
import {Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View} from "react-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Map from "@/components/Map";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import {useRef} from "react";

const RideLayout = ({children, title, snapPoints}: {
    title: string;
    snapPoints?: string[];
    children: React.ReactNode
}) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <View className="flex-1 bg-white">
                {/* Header + Map */}
                <View className="flex flex-col h-screen bg-blue-500">
                    <View className="flex flex-row absolute z-10 top-14">
                        <TouchableOpacity onPress={() => router.back()}>
                            <View className="w-10 h-10 ml-5 bg-white rounded-full items-center justify-center">
                                <Image
                                    source={icons.backArrow}
                                    resizeMode="contain"
                                    className="w-6 h-6"
                                />
                            </View>
                        </TouchableOpacity>
                        <Text className="text-xl font-JakartaSemiBold ml-3 mt-2">
                            {title || "Go Back"}
                        </Text>
                    </View>
                    <Map/>
                </View>

                {/* BottomSheet with Keyboard Avoiding */}
                <BottomSheet
                    keyboardBehavior="interactive" // better than "extend" for this case
                    ref={bottomSheetRef}
                    snapPoints={snapPoints || ['40%', '85%']}
                    index={0}
                >
                    <BottomSheetView style={{flex: 1}}>
                        <KeyboardAvoidingView
                            style={{flex: 1, padding: 20}}
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                        >
                            {children}
                        </KeyboardAvoidingView>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    )
}

export default RideLayout;
