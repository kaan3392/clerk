import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type CustomButtonProps = {
  text: string;
} & TouchableOpacityProps;

export function CustomButton({ text, ...props }: CustomButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      style={[styles.button, props.disabled && styles.buttonDisabled]}
    >
      {props.disabled && <ActivityIndicator color="#fff" />}

      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4353FD",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
});
