import {Stack} from "expo-router";
import {useFonts} from "expo-font";
import "./globals.css";
import {tokenCache} from "@clerk/clerk-expo/token-cache";
import {ClerkProvider} from "@clerk/clerk-expo";
import {StatusBar} from "expo-status-bar";

const RootLayout = () => {
    const [loaded] = useFonts({
        "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
        "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
        "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
        "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
        "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
        Jakarta: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
        "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    });

    if (!loaded) return null; // wait for fonts

    return (
        <ClerkProvider
            publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
            tokenCache={tokenCache}
        >
            <StatusBar style="dark" hidden={false}/>

            <Stack>
                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                <Stack.Screen name="(root)" options={{headerShown: false}}/>
            </Stack>

        </ClerkProvider>
    );
};

export default RootLayout;
