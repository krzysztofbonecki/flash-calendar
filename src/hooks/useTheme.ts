import { useColorScheme } from "react-native";

import { useCalendarTheme } from "../components/CalendarThemeProvider";
import type { BaseTheme } from "../helpers/tokens";
import { darkTheme, lightTheme } from "../helpers/tokens";

export const useTheme = (): BaseTheme => {
  const appearance = useColorScheme();
  const { colorScheme } = useCalendarTheme();

  const theme = colorScheme ?? appearance;

  return theme === "dark" ? darkTheme : lightTheme;
};
