import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useSignIn} from '@clerk/clerk-expo';
import {router} from 'expo-router';
import {ReactNativeModal} from 'react-native-modal';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import {icons, images} from '@/constants';

export default function ForgotPassword() {
    const {isLoaded, signIn, setActive} = useSignIn();

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState<'email' | 'reset' | 'success'>('email');

    const closeModal = () => {
        setStep(null); // <- This hides all modals
        setEmail('');
        setCode('');
        setNewPassword('');
        setError('');
    };


    const sendCode = async () => {
        if (!isLoaded) return;
        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            });
            setError('');
            setStep('reset');
        } catch (e: any) {
            setError(e.errors?.[0]?.longMessage || 'Error sending reset code');
        }
    };

    const resetPassword = async () => {
        if (!isLoaded) return;
        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password: newPassword,
            });

            if (result.status === 'complete') {
                await setActive({session: result.createdSessionId});

                setTimeout(() => {
                    setStep('success');
                }, 100);
            } else {
                setError('Password reset failed');
            }
        } catch (e: any) {
            setError(e.errors?.[0]?.longMessage || 'Error resetting password');
        }
    };


    return (
        <>
            {/* Step 1: Email Modal */}
            <ReactNativeModal isVisible={step === 'email'}>
                <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                    <TouchableOpacity className="absolute top-4 right-4 z-10"
                                      onPress={() => {
                                          closeModal();         // This hides the modal
                                          router.push("/(auth)/sign-in"); // Navigate to the sign-in page
                                      }}
                    >
                        <Text className="text-2xl text-gray-400 font-bold">×</Text>
                    </TouchableOpacity>

                    <Text className="text-3xl font-JakartaBold mb-3">Reset Password</Text>
                    <Text className="font-Jakarta mb-5">Enter your email to receive a reset code.</Text>

                    <InputField
                        label="Email"
                        placeholder="Enter your email"
                        icon={icons.email}
                        value={email}
                        onChangeText={setEmail}
                    />

                    {error && (
                        <Text className="text-red-500 text-sm mt-2 mb-3 font-Jakarta">{error}</Text>
                    )}

                    <CustomButton onPress={sendCode} title="Send Reset Code" className="mt-5"/>
                </View>
            </ReactNativeModal>

            {/* Step 2: Reset Modal */}
            <ReactNativeModal isVisible={step === 'reset'}>
                <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                    <TouchableOpacity className="absolute top-4 right-4 z-10" onPress={() => {
                        closeModal();         // This hides the modal
                        router.push("/(auth)/sign-in"); // Navigate to the sign-in page
                    }}>
                        <Text className="text-2xl text-gray-400 font-bold">×</Text>
                    </TouchableOpacity>

                    <Text className="text-3xl font-JakartaBold mb-3">Reset Password</Text>
                    <Text className="font-Jakarta mb-5">We've sent a reset code to {email}.</Text>

                    <InputField
                        label="Code"
                        icon={icons.lock}
                        placeholder="123456"
                        keyboardType="numeric"
                        value={code}
                        onChangeText={setCode}
                    />

                    <InputField
                        label="New Password"
                        icon={icons.lock}
                        placeholder="Enter new password"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                        className="mt-4"
                    />

                    {error && (
                        <Text className="text-red-500 text-sm mt-2 font-Jakarta">{error}</Text>
                    )}

                    <CustomButton onPress={resetPassword} title="Reset Password" className="mt-5"/>
                </View>
            </ReactNativeModal>

            {/* Step 3: Success Modal */}
            {step === 'success' && (
                <ReactNativeModal isVisible={true}>
                    <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                        <TouchableOpacity className="absolute top-4 right-4 z-10" onPress={() => {
                            closeModal();
                            router.push("/(auth)/sign-in");
                        }}>
                            <Text className="text-2xl text-gray-400 font-bold">×</Text>
                        </TouchableOpacity>

                        <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5"/>
                        <Text className="text-3xl font-JakartaBold text-center">Password Changed</Text>
                        <Text className="text-base text-gray-500 font-JakartaBold mt-3 text-center">
                            Your password has been changed successfully!
                        </Text>

                        <CustomButton
                            onPress={() => {
                                closeModal();
                                router.push('/(auth)/sign-in');
                            }}
                            title="Go to Login"
                            className="mt-5"
                        />
                    </View>
                </ReactNativeModal>
            )}
        </>
    );
}
