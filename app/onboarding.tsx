import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const DATA = [
  {
    id: "1",
    title: "Welcome to Social Auth",
    description:
      "Join our community and connect with friends around the world. Sign up or log in to get started!",
    backgroundColor: "#6C63FF",
  },
  {
    id: "2",
    title: "Discover",
    description:
      "Explore new communities and connect with people who share your interests.",
    backgroundColor: "#3F3D56",
  },
  {
    id: "3",
    title: "Get Started",
    description:
      "Create your account and start exploring the world of Social Auth.",
    backgroundColor: "#2F2E41",
  },
];

const Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems && viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleFinish = () => {
    if (isSignedIn) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/login");
    }
  };

  return (
    <View style={styles.container}>
      {currentIndex < DATA.length - 1 && (
        <TouchableOpacity
          style={{ position: "absolute", top: 40, right: 20, zIndex: 1 }}
          onPress={handleFinish}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Skip</Text>
        </TouchableOpacity>
      )}
      <View style={{ flex: 3 }}>
        <FlatList
          data={DATA}
          renderItem={({ item }) => (
            <View
              style={[
                styles.page,
                { width, backgroundColor: item.backgroundColor },
              ]}
            >
              <View style={styles.imagePlaceholder} />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            },
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      {/* Alt Kısım: Noktalar ve Buton */}
      <View style={styles.footer}>
        <View style={styles.paginator}>
          {DATA.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 20, 10],
              extrapolate: "clamp",
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                style={[styles.dot, { width: dotWidth, opacity }]}
                key={i.toString()}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={
            currentIndex === DATA.length - 1
              ? handleFinish
              : () =>
                  slidesRef?.current?.scrollToIndex({ index: currentIndex + 1 })
          }
        >
          <Text style={styles.buttonText}>
            {currentIndex === DATA.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: "300",
    color: "#fff",
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 40,
    height: 150,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  paginator: { flexDirection: "row", height: 64 },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#6C63FF",
    marginHorizontal: 8,
    marginTop: 25,
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
