import { themeAtom } from "@/utils/atom";
import { Colors } from "@/utils/constant";
import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const { t } = useTranslation();

  const [theme] = useAtom(themeAtom);
  const activeColors = theme === "dark" ? Colors.dark : Colors.light;

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      style={{
        padding: 12,
        backgroundColor: activeColors.button,
        borderRadius: 8,
        alignItems: "center",
        borderColor: activeColors.border,
        borderWidth: 1,
      }}
    >
      <Text>{t("home.logout")}</Text>
    </TouchableOpacity>
  );
};
