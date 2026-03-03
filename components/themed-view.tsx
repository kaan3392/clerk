import { View, type ViewProps, useColorScheme } from "react-native";

export function ThemedView({ style, ...otherProps }: ViewProps) {
  const colorScheme = useColorScheme();

  // Temaya göre arka plan rengi (İstersen burayı değiştirebilirsin)
  const backgroundColor = colorScheme === "dark" ? "#151718" : "#fff";

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
