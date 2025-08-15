import { KeyboardAvoidingView, Text, View, TouchableWithoutFeedback, Image, TextInput, Keyboard, Platform } from "react-native";

const InputField = ({
                        label,
                        labelStyle,
                        icon,
                        secureTextEntry = false,
                        containerStyle,
                        inputStyle,
                        iconStyle,
                        className,
                        placeholder,
                        value,
                        onChangeText,
                        ...props
                    }) => {
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className={`mb-4 ${className}`}>
                    {label && (
                        <Text className={`text-lg font-JakartaBold ${labelStyle}`}>
                            {label}
                        </Text>
                    )}

                    <View className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500 ${containerStyle}`}>
                    {icon && (
                        <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
                    )}
                        <TextInput
                            className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 text-left ${inputStyle}`}
                            placeholder={placeholder}
                            secureTextEntry={secureTextEntry}
                            value={value}
                            onChangeText={onChangeText}
                            {...props}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default InputField;
