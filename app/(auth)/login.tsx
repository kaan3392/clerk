import { Link, useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CustomButton } from "@/components/customButton";
import { CustomInput } from "@/components/customInput";
import { SignInWith } from "@/components/signInWith";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";

const signInSchema = z.object({
  email: z.string({ message: "Email is required" }).email("Invalid email"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password should be at least 8 characters long"),
});

type SignInFields = z.infer<typeof signInSchema>;

const mapClerkErrorToFormField = (error: any) => {
  switch (error.meta?.paramName) {
    case "identifier":
      return "email";
    case "password":
      return "password";
    default:
      return "root";
  }
};

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
  });

  const onSignIn = async (data: SignInFields) => {
    if (!isLoaded) return;

    setIsSubmitting(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      console.log("Sign in attempt: ", signInAttempt);

      if (signInAttempt.status === "complete") {
        setActive({ session: signInAttempt.createdSessionId });
      } else {
        console.log("Sign in failed");
        setError("root", { message: "Sign in could not be completed" });
      }
    } catch (err) {
      console.log("Sign in error: ", err);

      if (isClerkAPIResponseError(err)) {
        console.log("Clerk API error: ", err.errors);
        err.errors.forEach((error) => {
          const fieldName = mapClerkErrorToFormField(error);
          setError(fieldName, {
            message: error.longMessage,
          });
        });
      } else {
        setError("root", { message: "Unknown error" });
      }
    } finally {
      setIsSubmitting(false);
    }

    console.log("Sign in: ", data.email, data.password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Sign in</Text>

      <View style={styles.form}>
        <CustomInput
          control={control}
          name="email"
          placeholder="Email"
          autoFocus
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <CustomInput
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry
        />
        {errors.root && (
          <Text style={styles.errorText}>{errors.root.message}</Text>
        )}
      </View>
      <CustomButton
        text="Sign in"
        onPress={handleSubmit(onSignIn)}
        disabled={isSubmitting}
      />

      <Link href="/register" style={styles.link}>
        Don&apos;t have an account? Sign up
      </Link>
      <View style={styles.buttonContainer}>
        <SignInWith strategy="oauth_google" />
        <SignInWith strategy="oauth_facebook" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  form: {
    gap: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  link: {
    color: "#4353FD",
    fontWeight: "600",
  },
  buttonContainer: {
    gap: 10,
    marginHorizontal: "auto",
    width: "100%",
  },
  errorText: {
    color: "crimson",
  },
});
