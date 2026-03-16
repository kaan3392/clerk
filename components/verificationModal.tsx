import { isClerkAPIResponseError, useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { z } from "zod";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  phoneNumber: string;
}

const CELL_COUNT = 6;

const verifySchema = z.object({
  code: z.string().length(CELL_COUNT, "Kod 6 haneli olmalıdır"),
});

type VerifyFields = z.infer<typeof verifySchema>;

const VerificationModal = ({
  visible,
  onClose,
  phoneNumber,
}: VerificationModalProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const { handleSubmit, setValue, watch } = useForm<VerifyFields>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });

  const value = watch("code");

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: (val) => setValue("code", val),
  });

  const handleVerify = async (data: VerifyFields) => {
    if (!user) return;
    setLoading(true);

    try {
      const unverifiedPhone = user.phoneNumbers.find(
        (p) => p.verification.status !== "verified",
      );

      if (!unverifiedPhone)
        throw new Error("Recorded phone number not found or already verified.");

      const result = await unverifiedPhone.attemptVerification({
        code: data.code,
      });

      if (result.verification.status === "verified") {
        //yen numarayı tercih edilen hale getirdim
        await user.update({
          primaryPhoneNumberId: result.id,
        });

        // eski telleri silmek için yaptım burasnı
        const otherPhones = user.phoneNumbers.filter((p) => p.id !== result.id);
        for (const phone of otherPhones) {
          await phone.destroy();
        }

        Alert.alert("Başarılı", "Telefon numaranız güncellendi.");
        onClose();
      }
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) {
        Alert.alert("Verification Error", err.errors[0].longMessage);
      } else {
        Alert.alert("Error", err.message || "An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!visible) {
      setValue("code", "");
      setLoading(false);
    }
  }, [visible, setValue]);

  useEffect(() => {
    if (value.length === CELL_COUNT) {
      handleSubmit(handleVerify)();
    }
  }, [value]);

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>
            We sent a verification code to {phoneNumber}. Please enter it below
            to verify your phone number.
          </Text>

          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={(val) => setValue("code", val)}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoFocus
            renderCell={({ index, symbol, isFocused }) => (
              <View
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
              >
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />

          <TouchableOpacity
            style={[
              styles.verifyButton,
              (value.length !== CELL_COUNT || loading) && styles.disabledButton,
            ]}
            onPress={handleSubmit(handleVerify)}
            disabled={value.length !== CELL_COUNT || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VerificationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  codeFieldRoot: {
    width: "100%",
    marginBottom: 25,
  },
  cell: {
    width: 40,
    height: 40,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#000",
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
  },
  focusCell: {
    borderColor: "#4353FD",
    borderWidth: 2,
  },
  cellText: {
    fontSize: 20,
    color: "#000",
  },
  verifyButton: {
    backgroundColor: "#4353FD",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  verifyButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
  },
  closeButtonText: {
    color: "#ff4444",
    fontWeight: "500",
  },
});
