// import {Image, Text, View} from "react-native";
// import CustomButton from "@/components/CustomButton";
// import {icons} from "@/constants";
// import {useSSO} from "@clerk/clerk-expo";
// import {useCallback} from "react";
//
//
// const OAuth = () => {
//
//     const {startSSOFlow} = useSSO();
//
//     const handleGoogleSignIn = useCallback(async () => {
//         try {
//             // Start the authentication process by calling `startSSOFlow()`
//             const {createdSessionId, setActive, signIn, signUp} = await startSSOFlow({
//                 strategy: 'oauth_google',
//                 // For web, defaults to current path
//                 // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
//                 // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
//                 redirectUrl: AuthSession.makeRedirectUri(),
//             })
//
//             // If sign in was successful, set the active session
//             if (createdSessionId) {
//                 setActive!({session: createdSessionId})
//             } else {
//                 // If there is no `createdSessionId`,
//                 // there are missing requirements, such as MFA
//                 // Use the `signIn` or `signUp` returned from `startSSOFlow`
//                 // to handle next steps
//             }
//         } catch (err) {
//             // See https://clerk.com/docs/custom-flows/error-handling
//             // for more info on error handling
//             console.error(JSON.stringify(err, null, 2))
//         }
//     }, [])
//     return (
//         <View>
//             <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
//                 <View className='flex-1 h-[1px] bg-general-100'/>
//                 <Text className='text-lg'>Or</Text>
//                 <View className='flex-1 h-[1px] bg-general-100'/>
//             </View>
//
//             <CustomButton title="Log In with Google" className={"mt-5 shadow-none w-full"}
//                           IconLeft={() => (
//                               <Image source={icons.google} resizeMode={"contain"} className="w-5 h-5 mx-2"/>)}
//                           bgVariant="outline"
//                           textVariant='secondary'
//                           onPress={handleGoogleSignIn}
//             />
//         </View>
//     )
// }
//
// export default OAuth;
import React, {useCallback, useEffect} from "react";
import {Alert, Image, Text, View} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import {useSSO} from "@clerk/clerk-expo";

import CustomButton from "@/components/CustomButton";
import {icons} from "@/constants";
import {router} from "expo-router";

// Warm up browser to reduce delay on Android
WebBrowser.maybeCompleteAuthSession();

const useWarmUpBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};

const OAuth = () => {
    useWarmUpBrowser();

    const {startSSOFlow} = useSSO();

    const handleGoogleSignIn = useCallback(async () => {
        try {
            const {createdSessionId, setActive, signUp} = await startSSOFlow({
                strategy: "oauth_google",
                redirectUrl: AuthSession.makeRedirectUri({path: "/(root)/(tabs)/home"}),
            });

            if (createdSessionId && setActive) {
                await setActive({session: createdSessionId});

                // Optional: send user data to backend if needed
                if (signUp?.createdUserId) {
                    // Hit your API if needed
                    console.log("User signed up:", signUp);
                }

                Alert.alert("Success", "You’ve successfully signed in!");
                router.replace("/(root)/(tabs)/home");
            } else {
                Alert.alert("Attention", "Missing session info. Please try again.");
            }
        } catch (err: any) {
            console.error("SSO error:", err);
            Alert.alert("Error", err?.errors?.[0]?.longMessage || "Something went wrong.");
        }
    }, [startSSOFlow]);

    return (
        <View>
            <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
                <View className="flex-1 h-[1px] bg-general-100"/>
                <Text className="text-lg">Or</Text>
                <View className="flex-1 h-[1px] bg-general-100"/>
            </View>

            <CustomButton
                title="Log In with Google"
                className="mt-5 w-full shadow-none"
                IconLeft={() => (
                    <Image source={icons.google} resizeMode="contain" className="w-5 h-5 mx-2"/>
                )}
                bgVariant="outline"
                textVariant="secondary"
                onPress={handleGoogleSignIn}
            />
        </View>
    );
};

export default OAuth;
