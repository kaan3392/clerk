import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function RootLayout() {
  const { isSignedIn } = useAuth();
  const { t } = useTranslation();
  if (!isSignedIn) {
    return <Redirect href={"/(auth)/login"} />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#f0f0f0",
          height: 40,
          paddingBottom: 5,
        },

        tabBarShowLabel: false,
        headerStatusBarHeight: 0,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("layout.home"),
          headerTitle: t("layout.home"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("layout.profile"),
          headerTitle: t("layout.profile"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="active-sessions"
        options={{
          title: t("layout.sessions"),
          headerTitle: t("layout.sessions"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
