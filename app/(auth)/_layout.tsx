// import {Stack} from "expo-router";
//
// const Layout = () => {
//     return (
//         <Stack>
//             <Stack.Screen name="welcome" options={{headerShown: false}}/>
//             <Stack.Screen name="sign-up" options={{headerShown: false}}/>
//             <Stack.Screen name="sign-in" options={{headerShown: false}}/>
//         </Stack>
//     );
// };
//
// export default Layout;

import {Stack, useRouter} from "expo-router";
import {useAuth} from "@clerk/clerk-expo";
import {useEffect} from "react";
import {ActivityIndicator, View} from "react-native";

const Layout = () => {
    const {isLoaded, isSignedIn} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded) return; // wait for Clerk

        if (isSignedIn) {
            // ✅ Already signed in, skip auth stack
            router.replace("/(root)/(tabs)/home");
        }
    }, [isLoaded, isSignedIn]);

    if (!isLoaded) {
        // Optional loading screen while Clerk restores session
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Screen name="welcome" options={{headerShown: false}}/>
            <Stack.Screen name="sign-up" options={{headerShown: false}}/>
            <Stack.Screen name="sign-in" options={{headerShown: false}}/>
        </Stack>
    );
};

export default Layout;
