import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import InputField from '@/components/InputField';
import {icons, images} from '@/constants';
import CustomButton from "@/components/CustomButton";
import {Link, useRouter} from "expo-router";
import OAuth from "@/components/OAuth";
import {useAuth, useSignIn} from '@clerk/clerk-expo';
import {useEffect, useState} from 'react';


const SignIn = () => {
    const {signIn, setActive, isLoaded} = useSignIn();
    const {isSignedIn} = useAuth();
    const router = useRouter()

    const [form, setForm] = useState({
        email: '',
        password: '',
    });


    useEffect(() => {
        if (isSignedIn) {
            router.replace('/(root)/(tabs)/home'); // Redirect to home if already signed in
        }
    }, [isSignedIn]);

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
        if (!isLoaded) return

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: form.email,
                password: form.password,
            })


            if (signInAttempt.status === 'complete') {
                await setActive({session: signInAttempt.createdSessionId})
                router.replace('/')
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handlinga
            // for more info on error handling
            Alert.alert('Error', err?.errors[0]?.longMessage);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex: 1}}
            >
                <ScrollView
                    className="bg-white flex-1"
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 bg-white">
                        <View className="items-center">
                            <Image
                                source={images.signUpDashboard}
                                className="w-full h-[300px]"
                            />
                        </View>

                        <View className='ml-6'>
                            <Text className="text-4xl font-JakartaBold">
                                Welcome Back!
                            </Text>
                        </View>

                        <View className="p-9">
                            <InputField
                                label="Email"
                                placeholder="Enter your email address"
                                icon={icons.email}
                                value={form.email}
                                onChangeText={(value: string) => setForm({...form, email: value})}
                                labelStyle={undefined} containerStyle={undefined} inputStyle={undefined}
                                iconStyle={undefined} className={undefined}/>
                            <InputField
                                label="Password"
                                placeholder="Enter your password"
                                icon={icons.lock}
                                secureTextEntry
                                value={form.password}
                                onChangeText={(value: string) => setForm({...form, password: value})}
                                labelStyle={undefined} containerStyle={undefined} inputStyle={undefined}
                                iconStyle={undefined} className={undefined}
                            />

                            <Link href="/forgotPassword"
                                  className="text-primary text-end mt-3 font-JakartaBold">
                                Forgot Password?
                            </Link>


                            <CustomButton
                                onPress={onSignInPress}
                                title="Sign Up"
                                className="mt-5"
                            />

                            <OAuth/>

                            <Link href="/sign-up" className="text-lg text-center text-general-200 mt-5">
                                <Text className={"font-Jakarta"}>Don't have an account?{"  "}</Text>
                                <Text className={"text-primary font-JakartaBold"}>Sign Up</Text>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default SignIn;
