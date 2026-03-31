import AsyncStorage from "@react-native-async-storage/async-storage";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { Appearance } from "react-native";

const systemTheme = Appearance.getColorScheme() || "light";

const storage = createJSONStorage(() => AsyncStorage);

export const themeAtom = atomWithStorage("user-theme", systemTheme, storage);
