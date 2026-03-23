import { useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface LangModalProps {
  visible: boolean;
  onClose: () => void;
}

const languages = [
  { label: "Türkçe", value: "tr", flag: "🇹🇷" },
  { label: "English", value: "en", flag: "🇺🇸" },
];

export default function LangModal({ visible, onClose }: LangModalProps) {
  const { i18n } = useTranslation();
  const { user } = useUser();

  const mutation = useMutation({
    mutationFn: async (lang: string) => {
      await i18n.changeLanguage(lang);

      await AsyncStorage.setItem("user-language", lang);

      return await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          language: lang,
        },
      });
    },
    onSuccess: () => {
      onClose();
    },
    onError: (error) => {
      console.error("Dil güncelleme hatası:", error);
      Alert.alert("Hata", "Dil tercihi senkronize edilemedi.");
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Dil Seçimi / Language</Text>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.value}
              style={[
                styles.option,
                i18n.language === lang.value && styles.selected,
              ]}
              onPress={() => mutation.mutate(lang.value)}
              disabled={mutation.isPending}
            >
              <Text style={styles.optionText}>
                {lang.flag} {lang.label}
              </Text>
              {mutation.isPending && mutation.variables === lang.value && (
                <ActivityIndicator size="small" color="#000" />
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={{ color: "red" }}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  option: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selected: {
    borderColor: "#007AFF",
    borderWidth: 1,
    backgroundColor: "#eef6ff",
  },
  optionText: { fontSize: 16 },
  closeBtn: { marginTop: 10, alignItems: "center", padding: 10 },
});
