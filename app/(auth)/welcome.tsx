import {SafeAreaView} from "react-native-safe-area-context";
import {Dimensions, Image, Text, TouchableOpacity, View} from "react-native";
import Carousel from "react-native-reanimated-carousel"; //grp of imgs stacked together
import {router} from "expo-router";
import {useRef, useState} from "react"; //use
import {onboarding} from "@/constants";
import CustomButton from "@/components/CustomButton";


const {width} = Dimensions.get("window");

export default function Onboarding() {
    const carouselRef = useRef<any>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const isLastSlide = activeIndex === onboarding.length - 1;


    return (
        <SafeAreaView className="flex h-full justify-between items-center bg-white">
            <TouchableOpacity
                onPress={() => router.replace("/(auth)/sign-up")}
                className="w-full flex justify-end items-end p-5"
            >
                <Text className="text-black font-bold">Skip</Text>
            </TouchableOpacity>

            <View className="flex-1 justify-center items-center w-full">
                <Carousel
                    ref={carouselRef}
                    loop={false}
                    width={width}
                    height={600}
                    autoPlay={false}
                    data={onboarding}
                    scrollAnimationDuration={500}
                    onSnapToItem={index => setActiveIndex(index)}
                    renderItem={({item}) => (
                        <View className="justify-center items-center p-5">
                            {item.image && (
                                <Image
                                    source={item.image}
                                    className="w-full h-[300px]"
                                    resizeMode="contain"
                                />
                            )}
                            <Text className="text-4xl  text-center text-primary mt-8 p-2 font-JakartaBold">
                                {item.title}
                            </Text>
                            <Text className="text-2xl text-secondary text-center mt-3 font-JakartaSemiBold">
                                {item.description}
                            </Text>
                        </View>
                    )}
                    pagingEnabled
                    style={{flexGrow: 0}}
                />

                <View className="flex-row justify-center mt-6">
                    {onboarding.map((_, index) => (
                        <View
                            key={index}
                            className={`mx-2 rounded-full ${
                                index === activeIndex
                                    ? "bg-primary w-8 h-1.5"
                                    : "bg-[#E2E8F0] w-8 h-1.5"
                            }`}
                        />
                    ))}
                </View>
                <CustomButton
                    title={isLastSlide ? "Get Started" : "Next"}

                    onPress={() => isLastSlide ? router.replace("/(auth)/sign-up") : carouselRef.current?.next()}
                    className="w-10/12 mt-10 mb-5 p-10"
                />
            </View>


        </SafeAreaView>
    );
};
