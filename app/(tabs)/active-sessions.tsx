import { useSession, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
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
        Alert.alert("Success", "Session revoked successfully.");
        loadSessions();
      }
    } catch (err) {
      Alert.alert("Error", "Failed to revoke session.");
    }
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
        Active Devices
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
                <Text style={{ fontSize: 12, color: "gray" }}>
                  This is your current session
                </Text>
              )}
              <Text style={{ fontWeight: "bold" }}>
                {item.latestActivity.browserName || "Mobil Uygulama"}
              </Text>
              <Text style={{ fontSize: 12, color: "gray" }}>
                {item.latestActivity.city}, {item.latestActivity.country} •{" "}
                {item.latestActivity.ipAddress}
              </Text>

              {item.id !== session?.id && (
                <TouchableOpacity
                  onPress={() => handleRevokeSession(item.id)}
                  style={{
                    marginTop: 10,
                    backgroundColor: "#ff4d4d",
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 5,
                    width: 120,
                    alignItems: "center",
                  }}
                >
                  <Text>Close Session</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
