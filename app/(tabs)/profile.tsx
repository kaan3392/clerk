import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Controller, useForm } from "react-hook-form";
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
  phoneNumber: z
    .string()
    .length(11, "Phone number must be 11 digits (05xx...)")
    .regex(
      /^05\d{9}$/,
      "Please enter a valid phone number (must start with 05)",
    ),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, isLoaded } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      phoneNumber: user?.primaryPhoneNumber?.phoneNumber || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      return await user?.update({
        username: data.username,
        primaryPhoneNumberId: user.primaryPhoneNumber?.id,
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

  if (!isLoaded) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
        {updateImageMutation.isPending && (
          <ActivityIndicator style={StyleSheet.absoluteFill} color="#007AFF" />
        )}
        <TouchableOpacity onPress={onPickImage} style={styles.imageEditBadge}>
          <Text style={{ color: "white", fontSize: 12 }}>Değiştir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Kullanıcı Adı</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder="Kullanıcı adınız"
            />
          )}
        />
        {errors.username && (
          <Text style={styles.errorText}>{errors.username.message}</Text>
        )}
        <Text style={styles.label}>Telefon Numarası</Text>
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.phoneNumber && styles.inputError]}
              onChangeText={onChange}
              value={value}
              keyboardType="phone-pad"
              placeholder="05XX XXX XX XX"
            />
          )}
        />
        {errors.phoneNumber && (
          <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
        )}

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!isDirty || updateProfileMutation.isPending) && { opacity: 0.6 },
          ]}
          onPress={handleSubmit((data) => updateProfileMutation.mutate(data))}
          disabled={!isDirty || updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Kaydet</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, alignItems: "center" },
  avatarContainer: { position: "relative", marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  imageEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    padding: 5,
    borderRadius: 10,
  },
  form: { width: "100%" },
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
});
