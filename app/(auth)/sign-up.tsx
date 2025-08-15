import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import React, {useRef, useState} from 'react';
import InputField from '@/components/InputField';
import {icons, images} from '@/constants';
import CustomButton from "@/components/CustomButton";
import {Link, router} from "expo-router";
import {ReactNativeModal} from "react-native-modal";
import OAuth from '@/components/OAuth';
import {useSignUp} from '@clerk/clerk-react';
import {fetchAPI} from "@/lib/fetch";

export default function SignUp() {


    const {isLoaded, signUp, setActive} = useSignUp();

    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    // const router = useRouter();

    const [lastCodeSentAt, setLastCodeSentAt] = useState<number | null>(null);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [verification, setVerification] = useState({
        state: "default",
        error: "",
        code: ""
    });

    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const resendIntervalRef = useRef<NodeJS.Timeout | null>(null);


    const onSignUpPress = async () => {
        if (!isLoaded) return;

        // Prevent sending code within 60 seconds
        const now = Date.now();
        if (lastCodeSentAt && now - lastCodeSentAt < 60000) {
            Alert.alert("Please wait", "Try again after a minute.");
            return;
        }

        try {
            await signUp.create({
                emailAddress: form.email,
                password: form.password,
            });

            await signUp.prepareEmailAddressVerification({strategy: 'email_code'});

            setLastCodeSentAt(now);
            startResendCountdown();// 🔐 Save timestamp
            setVerification({...verification, state: "pending", error: ""});
        } catch (err: any) {
            Alert.alert('Error', err?.errors?.[0]?.longMessage || "Something went wrong");
        }
    };

    const startResendCountdown = () => {
        setResendTimer(60);
        setCanResend(false);

        resendIntervalRef.current = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(resendIntervalRef.current!);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const onVerifyPress = async () => {
        if (!isLoaded) return;

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: verification.code,
            });

            if (completeSignUp.status === 'complete') {
                try {
                    await fetchAPI('/(api)/user', {
                        method: 'POST',
                        body: JSON.stringify({
                            name: form.name,
                            email: form.email,
                            clerk_id: completeSignUp.createdUserId,
                        }),
                    });
                } catch (dbError: any) {
                    if (
                        dbError?.message?.includes("duplicate key") ||
                        dbError?.message?.includes("already exists")
                    ) {
                        console.log("Duplicate email: continuing");
                    } else {
                        throw dbError;
                    }
                }

                await setActive({session: completeSignUp.createdSessionId});

                setIsSuccessModalVisible(true); // ✅ Show modal here
                setVerification({...verification, state: 'default'}); // optional
            } else {
                setVerification({...verification, error: 'Verification failed', state: 'failed'});
            }
        } catch (err: any) {
            setVerification({
                ...verification,
                error: err?.errors?.[0]?.longMessage || "Error during verification",
                state: "failed",
            });
        }
    };

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

                        <View className="ml-6">
                            <Text className="text-4xl font-JakartaBold">Create an account</Text>
                        </View>

                        <View className="p-9">

                            <InputField
                                label="Name"
                                placeholder="Enter your name"
                                icon={icons.person}
                                value={form.name}
                                onChangeText={(value: string) => setForm({...form, name: value})}
                            />
                            <InputField
                                label="Email"
                                placeholder="Enter your email address"
                                icon={icons.email}
                                value={form.email}
                                onChangeText={(value: string) => setForm({...form, email: value})}
                            />
                            <InputField
                                label="Password"
                                placeholder="Enter your password"
                                icon={icons.lock}
                                secureTextEntry
                                value={form.password}
                                onChangeText={(value: string) => setForm({...form, password: value})}
                            />

                            <CustomButton
                                onPress={() => onSignUpPress()}
                                title="Sign Up"
                                className="mt-5"
                            />

                            <OAuth/>


                            <Link href="/sign-in" className="text-lg text-center text-general-200 mt-5">
                                <Text className={"font-Jakarta"}>Already have an account? </Text>
                                <Text className={"text-primary font-JakartaBold"}>Log in</Text>
                            </Link>
                        </View>

                        {/* ✅ Verification Modal */}
                        {verification.state === 'pending' && (
                            <ReactNativeModal isVisible={true}>
                                <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] relative">
                                    <TouchableOpacity
                                        className="absolute top-4 right-4 z-10"
                                        onPress={() => setVerification({...verification, state: "default"})}
                                    >
                                        <Text className="text-2xl text-gray-400 font-bold">×</Text>
                                    </TouchableOpacity>
                                    <Text className="text-3xl mb-3 font-JakartaBold">Verification</Text>
                                    <Text className="font-Jakarta mb-5">
                                        We have sent a verification code to {form.email}.
                                    </Text>

                                    <InputField
                                        label="Code"
                                        icon={icons.lock}
                                        placeholder="123456"
                                        value={verification.code}
                                        keyboardType="numeric"
                                        onChangeText={(code) => setVerification({...verification, code})}
                                    />

                                    {verification.error && (
                                        <Text className="text-red-500 text-sm mt-1">{verification.error}</Text>
                                    )}

                                    <CustomButton
                                        onPress={onVerifyPress}
                                        title="Verify Email"
                                        className="font-JakartaBold mt-5"
                                    />

                                    {!canResend ? (
                                        <Text className="text-gray-400 font-Jakarta mt-4 text-e">
                                            Resend code in {resendTimer}s
                                        </Text>
                                    ) : (
                                        <CustomButton
                                            onPress={onSignUpPress}
                                            title="Resend Code"
                                            className="mt-4"
                                            bgVariant={"secondary"}
                                        />
                                    )}
                                </View>
                            </ReactNativeModal>
                        )}


                        {/* ✅ Success Modal */}
                        {verification.state === 'success' && (
                            <ReactNativeModal isVisible={isSuccessModalVisible}>
                                <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                                    <TouchableOpacity
                                        className="absolute top-4 right-4 z-10"
                                        onPress={() => setVerification({...verification, state: "default"})}
                                    >
                                        <Text className="text-2xl text-gray-400 font-bold">×</Text>
                                    </TouchableOpacity>
                                    <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5"/>
                                    <Text className="text-3xl font-JakartaBold text-center">Verified</Text>
                                    <Text className="text-base text-gray-500 font-JakartaBold mt-3 text-center">
                                        Your email has been verified successfully!
                                    </Text>
                                    <CustomButton
                                        onPress={() => {
                                            setIsSuccessModalVisible(false); // ✅ Close modal
                                            router.push("/(root)/(tabs)/home");
                                        }}
                                        title="Browse Home"
                                        className="mt-5"
                                    />
                                </View>
                            </ReactNativeModal>

                        )}

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

