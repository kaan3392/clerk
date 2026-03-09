import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

type CustomButtonProps = {
  text: string;
} & PressableProps;

export function CustomButton({ text, ...props }: CustomButtonProps) {
  return (
    <Pressable {...props} style={[styles.button]}>
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4353FD",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
