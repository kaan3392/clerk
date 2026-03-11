import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";

const profileSchema = z.object({
  username: z.string().min(3, "En az 3 karakter").max(20, "Çok uzun"),
  phoneNumber: z
    .string()
    .length(11, "Telefon numarası 11 haneli olmalıdır (05xx...)")
    .regex(
      /^05\d{9}$/,
      "Geçerli bir telefon numarası giriniz (05 ile başlamalıdır)",
    ),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, isLoaded } = useUser();
  // const queryClient = useQueryClient();

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
      Alert.alert("Başarılı", "Profil güncellendi.");
      reset(undefined, { keepValues: true });
    },
    onError: (err: any) => {
      Alert.alert("Hata", err.errors?.[0]?.message || "Güncelleme başarısız.");
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: async (base64: string) => {
      return await user?.setProfileImage({ file: base64 });
    },
    onSuccess: () => {
      Alert.alert("Başarılı", "Fotoğraf güncellendi.");
    },
    onError: () => Alert.alert("Hata", "Fotoğraf yüklenemedi."),
  });

  const onPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
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
