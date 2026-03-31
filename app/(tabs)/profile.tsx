import LangModal from "@/components/langModal";
import VerificationModal from "@/components/verificationModal";
import { themeAtom } from "@/utils/atom";
import { Colors } from "@/utils/constant";
import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useAtom } from "jotai";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";

const profileSchema = z.object({
  username: z.string().min(3, "At least 3 characters").max(20, "Too long"),
});

// const phoneNumberSchema = z.object({
//   phoneNumber: z
//     .string()
//     .length(11, "Phone number must be 11 digits (05xx...)")
//     .regex(
//       /^05\d{9}$/,
//       "Please enter a valid phone number (must start with 05)",
//     ),
// });

//clerk test modu için bunu yaptım yoksa devde izin vermedi türkiye olmasına...
const phoneNumberSchema = z.object({
  phoneNumber: z.string().min(5, "Test numarası için en az 5 hane girin"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type PhoneNumberFormValues = z.infer<typeof phoneNumberSchema>;

const Profile = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const [showModal, setShowModal] = useState(false);
  const { user, isLoaded } = useUser();
  const [langVisible, setLangVisible] = useState(false);
  const { i18n, t } = useTranslation();
  const activeColors = theme === "dark" ? Colors.dark : Colors.light;

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
    },
  });

  const {
    control: phoneControl,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors, isDirty: isPhoneDirty },
    reset: resetPhone,
  } = useForm<PhoneNumberFormValues>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: user?.primaryPhoneNumber?.phoneNumber || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      return await user?.update({
        username: data.username,
        // primaryPhoneNumberId: user.primaryPhoneNumber?.id,
      });
    },
    onSuccess: () => {
      Alert.alert("Success", "Profile updated successfully.");
      reset(undefined, { keepValues: true });
    },
    onError: (err: any) => {
      Alert.alert("Error", err.errors?.[0]?.message || "");
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: async (base64: string) => {
      return await user?.setProfileImage({ file: base64 });
    },
    onSuccess: () => {
      Alert.alert("Success", "Profile picture updated.");
    },
    onError: () => Alert.alert("Error", "Failed to update profile picture."),
  });

  const onPickImage = async () => {
    //izin isteme
    const { status, canAskAgain } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    console.log("Permission Status:", status, "Can Ask Again:", canAskAgain);

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant permission to access your photos.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Settings",
            onPress: () => {
              if (Platform.OS === "ios") {
                Linking.openURL("app-settings:");
              } else {
                Linking.openSettings();
              }
            },
          },
        ],
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      console.log("Base64 Image String:", base64);
      updateImageMutation.mutate(base64);
    }
  };

  //tr için buydu
  // const onPhoneVerifyPress = async (data: PhoneNumberFormValues) => {
  //   try {
  //     const formattedPhone = `+90${data.phoneNumber.substring(1)}`;

  //     const phoneNumberResource = await user?.createPhoneNumber({
  //       phoneNumber: formattedPhone,
  //     });

  //     if (phoneNumberResource) {
  //       await phoneNumberResource.prepareVerification();
  //       setShowModal(true);
  //     }
  //   } catch (err: any) {
  //     Alert.alert(
  //       "Error",
  //       err.errors?.[0]?.longMessage || "SMS gönderilemedi.",
  //     );
  //   }
  // };

  const onPhoneVerifyPress = async (data: PhoneNumberFormValues) => {
    try {
      let formattedPhone = data.phoneNumber.startsWith("+")
        ? data.phoneNumber
        : `+${data.phoneNumber}`;

      if (
        !data.phoneNumber.startsWith("+") &&
        data.phoneNumber.startsWith("0")
      ) {
        formattedPhone = `+90${data.phoneNumber.substring(1)}`;
      }

      console.log("Gönderilen Numara:", formattedPhone); // Terminalden kontrol et

      const phoneNumberResource = await user?.createPhoneNumber({
        phoneNumber: formattedPhone,
      });

      if (phoneNumberResource) {
        await phoneNumberResource.prepareVerification();
        setShowModal(true);
      }
    } catch (err: any) {
      if (err.errors?.[0]?.code === "form_identifier_exists") {
        setShowModal(true);
      } else {
        Alert.alert(
          "Error",
          err.errors?.[0]?.longMessage || "SMS gönderilemedi.",
        );
      }
    }
  };

  if (!isLoaded) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
        {updateImageMutation.isPending && (
          <ActivityIndicator style={StyleSheet.absoluteFill} color="#007AFF" />
        )}
        <TouchableOpacity
          onPress={onPickImage}
          style={[
            styles.imageEditBadge,
            { backgroundColor: activeColors.button },
          ]}
        >
          <Text style={{ color: "white", fontSize: 12 }}>
            {t("profile.change")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: activeColors.text }]}>
          {t("profile.nameLabel")}
        </Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                errors.username && styles.inputError,
                {
                  color: activeColors.text,
                  backgroundColor: activeColors.inputBg,
                  borderColor: activeColors.border,
                },
              ]}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder={t("profile.nameLabelPlaceholder")}
            />
          )}
        />
        {errors.username && (
          <Text style={[styles.errorText, { color: activeColors.text }]}>
            {errors.username.message}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!isDirty || updateProfileMutation.isPending) && { opacity: 0.6 },
            {
              backgroundColor: activeColors.button,
              borderColor: activeColors.border,
            },
          ]}
          onPress={handleSubmit((data) => updateProfileMutation.mutate(data))}
          disabled={!isDirty || updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={[styles.submitButtonText, { color: activeColors.text }]}
            >
              {t("profile.updateButton")}
            </Text>
          )}
        </TouchableOpacity>
        <Text style={[styles.label, { color: activeColors.text }]}>
          {t("profile.phoneLabel")}
        </Text>
        <Controller
          control={phoneControl}
          name="phoneNumber"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                phoneErrors.phoneNumber && styles.inputError,
                {
                  backgroundColor: activeColors.inputBg,
                  borderColor: activeColors.border,
                  color: activeColors.text,
                },
              ]}
              onChangeText={onChange}
              value={value}
              keyboardType="phone-pad"
              placeholder={t("profile.phonePlaceholder")}
            />
          )}
        />
        {phoneErrors.phoneNumber && (
          <Text style={[styles.errorText, { color: activeColors.text }]}>
            {phoneErrors.phoneNumber.message}
          </Text>
        )}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isPhoneDirty && { opacity: 0.6 },
            {
              backgroundColor: activeColors.button,
              borderColor: activeColors.border,
            },
          ]}
          onPress={handlePhoneSubmit(onPhoneVerifyPress)}
          disabled={!isPhoneDirty}
        >
          <Text style={[styles.submitButtonText, { color: activeColors.text }]}>
            {t("profile.verifyButton")}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.label, { color: activeColors.text }]}>
          {t("profile.languageLabel")}
        </Text>
        <TouchableOpacity
          style={[
            styles.languageSelector,
            {
              borderColor: activeColors.border,
              backgroundColor: activeColors.inputBg,
            },
          ]}
          onPress={() => setLangVisible(true)}
        >
          <Text style={{ color: activeColors.text }}>
            {i18n.language === "tr" ? "🇹🇷 Türkçe" : "🇺🇸 English"}
          </Text>
          <Text style={{ color: "#007AFF" }}>{t("profile.change")}</Text>
        </TouchableOpacity>
        <Text style={[styles.label, { color: activeColors.text }]}>
          {t("profile.themeLabel")}
        </Text>
        <View style={styles.themeSelector}>
          <TouchableOpacity
            style={[
              styles.themeOption,
              {
                borderColor: activeColors.border,
                backgroundColor:
                  theme === "light" ? "#fff" : activeColors.button,
              },
            ]}
            onPress={() => {
              console.log("Light mode selected");
              setTheme("light");
            }}
          >
            <Text style={[styles.themeText, { color: activeColors.text }]}>
              ☀️ {t("profile.lightMode")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              {
                borderColor: activeColors.border,
                backgroundColor: activeColors.button,
              },
            ]}
            onPress={() => {
              console.log("Dark mode selected");
              setTheme("dark");
            }}
          >
            <Text style={[styles.themeText, { color: activeColors.text }]}>
              🌙 {t("profile.darkMode")}
            </Text>
          </TouchableOpacity>
        </View>
        <LangModal
          visible={langVisible}
          onClose={() => setLangVisible(false)}
        />

        <VerificationModal
          visible={showModal}
          onClose={() => {
            setShowModal(false);
            user?.reload();
          }}
          phoneNumber={phoneControl._formValues.phoneNumber}
        />
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, alignItems: "center" },
  avatarContainer: { position: "relative", marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  imageEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 5,
    borderRadius: 10,
  },
  form: { width: "100%", gap: 10 },
  label: { fontWeight: "bold", marginTop: 15 },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 5,
  },
  inputError: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12 },
  submitButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontWeight: "bold" },
  languageSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 10,
  },
  themeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  themeOption: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },

  themeText: {
    color: "#333",
    fontWeight: "500",
  },
});
