import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Preloads the browser for Android devices to reduce authentication load time
// See: https://docs.expo.dev/guides/authentication/#improving-user-experience
export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

type SignInWithProps = {
  strategy: "oauth_google" | "oauth_facebook";
};

export function SignInWith({ strategy }: SignInWithProps) {
  const [isLoading, setIsLoading] = useState(false);
  useWarmUpBrowser();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const buttonIcon = () => {
    if (strategy === "oauth_facebook") {
      return <Ionicons name="logo-facebook" size={24} color="#1977F3" />;
    } else {
      return <Ionicons name="logo-google" size={24} color="#DB4437" />;
    }
  };

  const buttonText = () => {
    if (isLoading) {
      return "Loading...";
    }

    if (strategy === "oauth_facebook") {
      return "Continue with Facebook";
    } else {
      return "Continue with Google";
    }
  };

  const onPress = useCallback(async () => {
    setIsLoading(true);
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "socialauth",
        path: "(tabs)",
      });

      console.log("Redirect URI:", redirectUri);

      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy,
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri({
            scheme: "socialauth",
            path: "(tabs)",
          }),
        });

      console.log("**************");
      console.log("Created Session ID:", createdSessionId);
      console.log("**************");
      console.log("Set Active:", setActive);
      console.log("*****************");
      console.log("Sign In:", signIn);
      console.log("*****************");
      console.log("Sign Up:", signUp);
      console.log("*****************");

      // If sign in was successful, set the active session
      if (createdSessionId) {
        console.log("Setting active session with ID:", createdSessionId);
        setActive!({
          session: createdSessionId,
          // Check for session tasks and navigate to custom UI to help users resolve them
          // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log("current task:", session?.currentTask);
              // router.push('/sign-in/tasks')
              return;
            }

            // router.push('/')
          },
        });

        console.log("Active session set successfully.");
        router.replace("/(tabs)");
      } else {
        console.error(
          "SSO flow did not return a createdSessionId. This may indicate missing requirements, such as MFA.",
        );
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // See https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error("Error occurred during SSO flow:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          buttonIcon()
        )}
        <Text style={styles.buttonText}>{buttonText()}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    width: "100%",
    gap: 100,
    marginHorizontal: "auto",
  },
  button: {
    width: "100%",
    borderColor: "gray",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "medium",
    color: "black",
  },
});
