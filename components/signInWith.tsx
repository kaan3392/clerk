import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect } from "react";
import { Button, Platform, View } from "react-native";

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
  useWarmUpBrowser();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
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
    }
  }, []);

  return (
    <View>
      <Button
        title={`Sign in with ${strategy === "oauth_google" ? "Google" : "Facebook"}`}
        onPress={onPress}
      />
    </View>
  );
}
