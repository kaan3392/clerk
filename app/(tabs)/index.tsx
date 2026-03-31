import { SignOutButton } from "@/components/sign-out-button";
import { themeAtom } from "@/utils/atom";
import { Colors } from "@/utils/constant";
import { SignedIn, useSession, useUser } from "@clerk/clerk-expo";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { user } = useUser();
  const { t } = useTranslation();
  const [theme] = useAtom(themeAtom);
  const activeColors = theme === "dark" ? Colors.dark : Colors.light;

  const { session } = useSession();
  console.log(session?.currentTask);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: activeColors.text }]}>
        {t("home.welcome")}
      </Text>
      <SignedIn>
        <Text style={[styles.subtitle, { color: activeColors.text }]}>
          {t("home.hello", { email: user?.emailAddresses[0].emailAddress })}
        </Text>
        <SignOutButton />
      </SignedIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  title: { fontSize: 32, fontWeight: "bold", lineHeight: 32 },
  subtitle: { fontSize: 18, lineHeight: 24 },
});
