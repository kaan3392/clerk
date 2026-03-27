import { SignOutButton } from "@/components/sign-out-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SignedIn, useSession, useUser } from "@clerk/clerk-expo";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function Index() {
  const { user } = useUser();
  const { t } = useTranslation();

  const { session } = useSession();
  console.log(session?.currentTask);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{t("home.welcome")}</ThemedText>
      <SignedIn>
        <ThemedText>
          {t("home.hello", { email: user?.emailAddresses[0].emailAddress })}
        </ThemedText>
        <SignOutButton />
      </SignedIn>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
});
