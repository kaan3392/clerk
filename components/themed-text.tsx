import { StyleSheet, Text, useColorScheme, type TextProps } from "react-native";

export function ThemedText({
  style,
  type = "default",
  ...rest
}: TextProps & { type?: "default" | "title" | "subtitle" | "link" }) {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#ECEDEE" : "#11181C";

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24 },
  title: { fontSize: 32, fontWeight: "bold", lineHeight: 32 },
  subtitle: { fontSize: 20, fontWeight: "bold" },
  link: { lineHeight: 30, fontSize: 16, color: "#0a7ea4" },
});
