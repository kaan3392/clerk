import { themeAtom } from "@/utils/atom";
import { Colors } from "@/utils/constant";
import { useAtom } from "jotai";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type CustomInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
} & TextInputProps;

export function CustomInput<T extends FieldValues>({
  control,
  name,
  ...props
}: CustomInputProps<T>) {
  const [theme] = useAtom(themeAtom);
  const activeColors = theme === "dark" ? Colors.dark : Colors.light;
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          <TextInput
            {...props}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            style={[
              styles.input,
              props.style,
              { borderColor: error ? "red" : "gray" },
              { color: activeColors.text },
              { backgroundColor: activeColors.inputBg },
            ]}
          />
          {error ? (
            <Text style={styles.error}>{error.message}</Text>
          ) : (
            <View style={{ height: 18 }} />
          )}
        </View>
      )}
    />
  );
}

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "#ccc",
  },
  error: {
    color: "red",
    minHeight: 18,
  },
});
