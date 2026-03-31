import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import * as z from "zod";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z.object({
  code: z.string().length(6, "Code must be 6 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type EmailFields = z.infer<typeof emailSchema>;
type ResetFields = z.infer<typeof resetSchema>;

export default function ForgotPassword() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailForm = useForm<EmailFields>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetFields>({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: "", password: "" },
  });

  const codeValue = resetForm.watch("code");

  const ref = useBlurOnFulfill({ value: codeValue, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: codeValue,
    setValue: (val) => resetForm.setValue("code", val),
  });
  const onRequestReset = async (data: EmailFields) => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });
      setSuccessfulCreation(true);
      Alert.alert("Success", "Reset code sent to your email.");
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) {
        Alert.alert("Error", err.errors[0].longMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (data: ResetFields) => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        Alert.alert(
          "Success",
          "Your password has been updated and you have been logged in.",
        );
      }
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) {
        Alert.alert("Error", err.errors[0].longMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      {!successfulCreation ? (
        <View style={styles.form}>
          <Controller
            control={emailForm.control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Email address"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                style={[
                  styles.input,
                  emailForm.formState.errors.email && styles.inputError,
                ]}
              />
            )}
          />
          {emailForm.formState.errors.email && (
            <Text style={styles.errorText}>
              {emailForm.formState.errors.email.message}
            </Text>
          )}

          <TouchableOpacity
            onPress={emailForm.handleSubmit(onRequestReset)}
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Code</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.label}>Verification Code</Text>
          <Controller
            control={resetForm.control}
            name="code"
            render={({ field: { onChange, value } }) => (
              <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={onChange}
                cellCount={6}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                renderCell={({ index, symbol, isFocused }) => (
                  <View
                    onLayout={getCellOnLayoutHandler(index)}
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                  >
                    <Text style={styles.cellText}>
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                  </View>
                )}
              />
            )}
          />

          <Text style={styles.label}>New Password</Text>
          <Controller
            control={resetForm.control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="At least 8 characters"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                style={styles.input}
              />
            )}
          />

          <TouchableOpacity
            onPress={resetForm.handleSubmit(onResetPassword)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: { width: "100%" },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 5,
    fontSize: 16,
  },
  inputError: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginBottom: 10 },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  label: { fontWeight: "bold", marginTop: 15, marginBottom: 5 },
  codeFieldRoot: {
    width: "100%",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  cell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 18,
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#007AFF",
  },
});
