import { useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

SplashScreen.preventAutoHideAsync();

const WelcomeScreen = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  const checkFirstLaunch = useCallback(async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      if (hasSeenOnboarding === null) {
        router.replace("/onboarding");
      } else {
        if (isSignedIn) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
      }
    } catch (error) {
      console.log("Hata:", error);
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    if (isLoaded) {
      SplashScreen.hideAsync();

      const timeout = setTimeout(() => {
        checkFirstLaunch();
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [isLoaded, isSignedIn, checkFirstLaunch, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>SA</Text>
        </View>
        <Text style={styles.appName}>Social Auth</Text>
      </Animated.View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#6C63FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoIcon: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
});
