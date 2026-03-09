import { SignOutButton } from "@/components/sign-out-button";
import { ThemedText } from "@/components/themed-text";
import { SignedIn, useSession, useUser } from "@clerk/clerk-expo";
import { ScrollView, StyleSheet, Text } from "react-native";

const Profile = () => {
  const { user } = useUser();

  const { session } = useSession();
  console.log(session?.currentTask);
  return (
    <ScrollView style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Profile</Text>
      <SignedIn>
        <ThemedText>Hello {user?.emailAddresses[0].emailAddress}</ThemedText>
        <SignOutButton />
      </SignedIn>
      {Array.from({ length: 1000 }, (_, i) => (
        <Text key={i}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
      ))}
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
});
