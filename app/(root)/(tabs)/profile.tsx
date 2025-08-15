import {useAuth, useUser} from "@clerk/clerk-expo";
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import {router} from "expo-router";
import React, {useState} from "react";
import {ReactNativeModal} from "react-native-modal";
import CustomButton from "@/components/CustomButton";

const Profile = () => {
    const {user} = useUser();
    const {signOut} = useAuth();
    const [isSignOutModalVisible, setSignOutModalVisible] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        setSignOutModalVisible(false);
        router.replace("/(auth)/sign-in");
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                contentContainerStyle={{paddingBottom: 120}}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <View className="bg-white shadow-sm shadow-neutral-200 rounded-b-3xl px-6 pt-10 pb-8 items-center">
                    <Image
                        source={{
                            uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
                        }}
                        className="w-[110px] h-[110px] rounded-full border-[3px] border-white shadow-md"
                    />
                    <Text className="text-2xl font-JakartaBold mt-4">
                        {user?.firstName} {user?.lastName}
                    </Text>
                    <Text className="text-gray-500 font-Jakarta mt-1">
                        {user?.primaryEmailAddress?.emailAddress}
                    </Text>
                </View>

                {/* Profile Details */}
                <View className="px-5 mt-6">
                    <Text className="text-lg font-JakartaBold text-gray-700 mb-3">
                        Personal Information
                    </Text>

                    <View className="bg-white rounded-xl shadow-sm shadow-neutral-200 p-5 space-y-4">
                        <InputField
                            label="First name"
                            placeholder={user?.firstName || "Not Found"}
                            containerStyle="w-full"
                            inputStyle="p-3.5"
                            editable={false}
                        />

                        <InputField
                            label="Email"
                            placeholder={user?.primaryEmailAddress?.emailAddress || "Not Found"}
                            containerStyle="w-full"
                            inputStyle="p-3.5"
                            editable={false}
                        />

                        <TouchableOpacity
                            onPress={() => setSignOutModalVisible(true)}
                        >
                            <Text className="text-red-500 text-xl font-JakartaBold">Log Out</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Logout Button */}

                </View>
            </ScrollView>

            {/* Sign-Out Confirmation Modal */}
            <ReactNativeModal isVisible={isSignOutModalVisible}>
                <View className="bg-white px-7 py-9 rounded-2xl min-h-[200px]">
                    <Text className="text-2xl font-JakartaBold text-center mb-3">
                        Sign Out
                    </Text>
                    <Text className="text-base text-gray-500 font-Jakarta text-center mb-6">
                        Are you sure you want to sign out of your account?
                    </Text>

                    <CustomButton
                        onPress={handleSignOut}
                        title="Yes, Sign Out"
                        className="mt-2"
                    />
                    <CustomButton
                        onPress={() => setSignOutModalVisible(false)}
                        title="Cancel"
                        className="mt-3"
                        bgVariant="secondary"
                    />
                </View>
            </ReactNativeModal>
        </SafeAreaView>
    );
};

export default Profile;
