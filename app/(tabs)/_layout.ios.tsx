import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTranslation } from "react-i18next";

export default function RootLayout() {
  const { isSignedIn } = useAuth();
  const { t } = useTranslation();

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/login"} />;
  }
  return (
    <NativeTabs
      tintColor={"blue"}
      disableTransparentOnScrollEdge={false}
      minimizeBehavior="onScrollDown"
      blurEffect="light"
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t("layout.home")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>
          {t("layout.profile")}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="active-sessions">
        <NativeTabs.Trigger.Label>
          {t("layout.sessions")}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="clock.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
