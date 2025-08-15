import {Tabs} from "expo-router";
import {Animated, Image, ImageSourcePropType} from "react-native";
import {icons} from "@/constants";
import {useEffect, useRef} from "react";

const TabIcon = ({source, focused}: { source: ImageSourcePropType, focused: boolean }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: focused ? 1.2 : 1,
            friction: 4,
            useNativeDriver: true,
        }).start();
    }, [focused]);

    return (
        <Animated.View
            style={{
                transform: [{scale: scaleAnim}],
                backgroundColor: focused ? '#0077B6' : '#1F2937',  // Indigo and Gray
                borderRadius: 50,
                padding: 12,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
            }}
        >
            <Image
                source={source}
                tintColor="white"
                resizeMode="contain"
                style={{width: 26, height: 26}}
            />
        </Animated.View>
    );
};

const Layout = () => (
    <Tabs
        initialRouteName="home"
        screenOptions={{
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "#aaa",
            tabBarShowLabel: false,
            tabBarStyle: {
                backgroundColor: "#111",
                borderRadius: 50,
                paddingBottom: 25,
                overflow: "hidden",
                marginHorizontal: 20,
                marginBottom: 20,
                height: 78,
                position: "absolute",
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowOffset: {width: 0, height: 3},
                shadowRadius: 8,
                elevation: 10,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",  // evenly spaces tabs
                alignItems: "center",
            },
        }}
    >
        <Tabs.Screen
            name="home"
            options={{
                title: "Home",
                headerShown: false,
                tabBarIcon: ({focused}) => <TabIcon focused={focused} source={icons.home}/>
            }}
        />
        <Tabs.Screen
            name="rides"
            options={{
                title: "Rides",
                headerShown: false,
                tabBarIcon: ({focused}) => <TabIcon focused={focused} source={icons.list}/>
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
                title: "Profile",
                headerShown: false,
                tabBarIcon: ({focused}) => <TabIcon focused={focused} source={icons.profile}/>
            }}
        />
    </Tabs>
);

export default Layout;
