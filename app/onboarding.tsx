import { themeAtom } from "@/utils/atom";
import { Colors } from "@/utils/constant";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
    title: "onboarding.page1.title",
    description: "onboarding.page1.description",
    backgroundColor: "#6C63FF",
  },
  {
    id: "2",
    title: "onboarding.page2.title",
    description: "onboarding.page2.description",
    backgroundColor: "#3F3D56",
  },
  {
    id: "3",
    title: "onboarding.page3.title",
    description: "onboarding.page3.description",
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
  const [theme] = useAtom(themeAtom);
  const activeColors = theme === "dark" ? Colors.dark : Colors.light;

  const { t } = useTranslation();

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
          style={{
            position: "absolute",
            top: 40,
            right: 20,
            zIndex: 1,
            backgroundColor: activeColors.button,
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 20,
          }}
          onPress={handleFinish}
        >
          <Text style={{ color: activeColors.text, fontSize: 16 }}>
            {t("onboarding.skip")}
          </Text>
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
              <Text style={[styles.title, { color: activeColors.text }]}>
                {t(item.title)}
              </Text>
              <Text style={[styles.description, { color: activeColors.text }]}>
                {t(item.description)}
              </Text>
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
          style={[styles.button, { backgroundColor: activeColors.button }]}
          onPress={
            currentIndex === DATA.length - 1
              ? handleFinish
              : () =>
                  slidesRef?.current?.scrollToIndex({ index: currentIndex + 1 })
          }
        >
          <Text style={[styles.buttonText, { color: activeColors.text }]}>
            {currentIndex === DATA.length - 1
              ? t("onboarding.getStarted")
              : t("onboarding.next")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: "300",
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
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: { fontSize: 16, fontWeight: "bold" },
});
