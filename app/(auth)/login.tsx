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

    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        setActive({ session: signInAttempt.createdSessionId });
      } else {
        console.log("Sign in failed");
        setError("root", { message: "Sign in could not be completed" });
      }
    } catch (err) {
      console.log("Sign in error: ", JSON.stringify(err, null, 2));

      if (isClerkAPIResponseError(err)) {
        err.errors.forEach((error) => {
          const fieldName = mapClerkErrorToFormField(error);
          setError(fieldName, {
            message: error.longMessage,
          });
        });
      } else {
        setError("root", { message: "Unknown error" });
      }
    }

    console.log("Sign in: ", data.email, data.password);
  };

  // const onSignInPress = React.useCallback(async () => {
  //   if (!isLoaded) return;

  //   try {
  //     const signInAttempt = await signIn.create({
  //       identifier: emailAddress,
  //       password,
  //     });

  //     if (signInAttempt.status === "complete") {
  //       await setActive({
  //         session: signInAttempt.createdSessionId,
  //         navigate: async ({ session }) => {
  //           if (session?.currentTask) {
  //             console.log(session?.currentTask);
  //             return;
  //           }

  //           router.replace("/");
  //         },
  //       });
  //     } else if (signInAttempt.status === "needs_second_factor") {
  //       const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
  //         (factor): factor is EmailCodeFactor =>
  //           factor.strategy === "email_code",
  //       );

  //       if (emailCodeFactor) {
  //         await signIn.prepareSecondFactor({
  //           strategy: "email_code",
  //           emailAddressId: emailCodeFactor.emailAddressId,
  //         });
  //         setShowEmailCode(true);
  //       }
  //     } else {
  //       console.error(JSON.stringify(signInAttempt, null, 2));
  //     }
  //   } catch (err) {
  //     console.error(JSON.stringify(err, null, 2));
  //   }
  // }, [isLoaded, signIn, setActive, router, emailAddress, password]);

  // const onVerifyPress = React.useCallback(async () => {
  //   if (!isLoaded) return;

  //   try {
  //     const signInAttempt = await signIn.attemptSecondFactor({
  //       strategy: "email_code",
  //       code,
  //     });

  //     if (signInAttempt.status === "complete") {
  //       await setActive({
  //         session: signInAttempt.createdSessionId,
  //         navigate: async ({ session }) => {
  //           if (session?.currentTask) {
  //             console.log(session?.currentTask);
  //             return;
  //           }

  //           router.replace("/");
  //         },
  //       });
  //     } else {
  //       console.error(JSON.stringify(signInAttempt, null, 2));
  //     }
  //   } catch (err) {
  //     console.error(JSON.stringify(err, null, 2));
  //   }
  // }, [isLoaded, signIn, setActive, router, code]);

  // if (showEmailCode) {
  //   return (
  //     <ThemedView style={styles.container}>
  //       <ThemedText type="title" style={styles.title}>
  //         Verify your email
  //       </ThemedText>
  //       <ThemedText style={styles.description}>
  //         A verification code has been sent to your email.
  //       </ThemedText>
  //       <TextInput
  //         style={styles.input}
  //         value={code}
  //         placeholder="Enter verification code"
  //         placeholderTextColor="#666666"
  //         onChangeText={(code) => setCode(code)}
  //         keyboardType="numeric"
  //       />

  //       <Pressable
  //         style={({ pressed }) => [
  //           styles.button,
  //           pressed && styles.buttonPressed,
  //         ]}
  //         onPress={onVerifyPress}
  //       >
  //         <ThemedText style={styles.buttonText}>Verify</ThemedText>
  //       </Pressable>
  //     </ThemedView>
  //   );
  // }

  // return (
  //   <ThemedView style={styles.container}>
  //     <ThemedText type="title" style={styles.title}>
  //       Sign in
  //     </ThemedText>
  //     <ThemedText style={styles.label}>Email address</ThemedText>
  //     <TextInput
  //       style={styles.input}
  //       autoCapitalize="none"
  //       value={emailAddress}
  //       placeholder="Enter email"
  //       placeholderTextColor="#666666"
  //       onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
  //       keyboardType="email-address"
  //     />
  //     <ThemedText style={styles.label}>Password</ThemedText>
  //     <TextInput
  //       style={styles.input}
  //       value={password}
  //       placeholder="Enter password"
  //       placeholderTextColor="#666666"
  //       secureTextEntry={true}
  //       onChangeText={(password) => setPassword(password)}
  //     />
  //     <GoogleSignIn />
  //     <Pressable
  //       style={({ pressed }) => [
  //         styles.button,
  //         (!emailAddress || !password) && styles.buttonDisabled,
  //         pressed && styles.buttonPressed,
  //       ]}
  //       onPress={onSignInPress}
  //       disabled={!emailAddress || !password}
  //     >
  //       <ThemedText style={styles.buttonText}>Sign in</ThemedText>
  //     </Pressable>
  //     <View style={styles.linkContainer}>
  //       <ThemedText>Don&apos;t have an account? </ThemedText>
  //       <Link href="/(auth)/register">
  //         <ThemedText type="link">Sign up</ThemedText>
  //       </Link>
  //     </View>
  //   </ThemedView>
  // );

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
          <Text style={{ color: "crimson" }}>{errors.root.message}</Text>
        )}
      </View>
      <CustomButton text="Sign in" onPress={handleSubmit(onSignIn)} />

      <Link href="/register" style={styles.link}>
        Don&apos;t have an account? Sign up
      </Link>
      <View style={{ flexDirection: "row", gap: 10, marginHorizontal: "auto" }}>
        {/* <SignInWith strategy="oauth_google" /> */}
        {/* <SignInWith /> */}
        <SignInWith />
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
});
