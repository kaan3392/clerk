import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";

export default function RootLayout() {
  const { isSignedIn } = useAuth();

  console.log("isSignedIn", isSignedIn);

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/login"} />;
  }
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ headerShown: false }} />
    </Tabs>
  );
}
