import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { z } from "zod";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const CELL_COUNT = 6;

const verifySchema = z.object({
  code: z.string().length(CELL_COUNT, "Kod 6 haneli olmalıdır"),
});

type VerifyFields = z.infer<typeof verifySchema>;

export default function VerifyScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<VerifyFields>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });

  const codeValue = watch("code");
  const ref = useBlurOnFulfill({ value: codeValue, cellCount: CELL_COUNT });
  const [props, getCellConfig] = useClearByFocusCell({
    value: codeValue,
    setValue: (val) => setValue("code", val),
  });

  const onVerify = async ({ code }: VerifyFields) => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else {
        setError("root", { message: "Verification failed. Please try again." });
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setError("code", { message: err.errors[0].longMessage });
      } else {
        setError("root", { message: "An unknown error occurred." });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (codeValue.length === CELL_COUNT) {
      handleSubmit(onVerify)();
    }
  }, [codeValue]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>
        Please enter the 6-digit code sent to your email.
      </Text>

      <View style={styles.codeFieldContainer}>
        <CodeField
          ref={ref}
          {...props}
          value={codeValue}
          onChangeText={(text) => setValue("code", text)}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              onLayout={getCellConfig(index)}
              style={[
                styles.cell,
                isFocused && styles.focusCell,
                errors.code && styles.errorCell,
              ]}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
      </View>

      {errors.code && (
        <Text style={styles.errorText}>{errors.code.message}</Text>
      )}
      {errors.root && (
        <Text style={styles.errorText}>{errors.root.message}</Text>
      )}

      {loading && (
        <ActivityIndicator color="#4353FD" style={{ marginTop: 20 }} />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  codeFieldContainer: {
    marginVertical: 20,
  },
  codeFieldRoot: {
    justifyContent: "space-between",
  },
  cell: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#00",
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  focusCell: {
    borderColor: "#4353FD",
    backgroundColor: "#fff",
  },
  errorCell: {
    borderColor: "#FF4D4D",
  },
  errorText: {
    color: "#FF4D4D",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
});
