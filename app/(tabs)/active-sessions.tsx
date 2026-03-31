import { themeAtom } from "@/utils/atom";
import { Colors } from "@/utils/constant";
import { useSession, useUser } from "@clerk/clerk-expo";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const renderSeparator = () => (
  <View
    style={{
      height: 1,
      backgroundColor: "#CED0CE", // Hafif gri bir renk
      marginVertical: 10, // Çizginin üstten ve alttan boşluğu
    }}
  />
);

export default function ActiveSessions() {
  const { user } = useUser();
  const { session } = useSession();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [theme] = useAtom(themeAtom);
  const activeColors = theme === "dark" ? Colors.dark : Colors.light;

  const loadSessions = async () => {
    try {
      setLoading(true);
      // Kullanıcının tüm aktif oturumlarını çek
      const activeSessions = await user?.getSessions();
      setSessions(activeSessions || []);
    } catch (err) {
      console.error("Oturumlar yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const sessionToRevoke = sessions.find((s) => s.id === sessionId);
      if (sessionToRevoke) {
        await sessionToRevoke.revoke();
        Alert.alert("Success", t("sessions.revokeSuccess"));
        loadSessions();
      }
    } catch (err) {
      Alert.alert("Error", t("sessions.revokeError"));
    }
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View style={{ padding: 20 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 15,
          color: activeColors.text,
        }}
      >
        {t("sessions.title")}
      </Text>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={renderSeparator}
        renderItem={({ item }) => {
          console.log("Session Item: ", item);
          return (
            <View>
              {/* current session */}
              {item.id === session?.id && (
                <Text style={{ fontSize: 12, color: activeColors.text }}>
                  {t("sessions.currentSession")}
                </Text>
              )}
              <Text style={{ fontWeight: "bold", color: activeColors.text }}>
                {item.latestActivity.browserName || "Mobil Uygulama"}
              </Text>
              <Text style={{ fontSize: 12, color: activeColors.text }}>
                {item.latestActivity.city}, {item.latestActivity.country} •{" "}
                {item.latestActivity.ipAddress}
              </Text>

              {item.id !== session?.id && (
                <TouchableOpacity
                  onPress={() => handleRevokeSession(item.id)}
                  style={{
                    marginTop: 10,
                    backgroundColor: activeColors.button,
                    borderColor: activeColors.border,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 5,
                    width: 120,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: activeColors.text }}>
                    {t("sessions.revokeButton")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
