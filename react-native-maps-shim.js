// Prevent web from breaking when react-native-maps is imported
export default function MapView() {
    throw new Error("react-native-maps is not supported on web.");
}
