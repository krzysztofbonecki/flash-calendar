import { useColorScheme } from "react-native";

import { useCalendarTheme } from "src/components/CalendarThemeProvider";
import type { BaseTheme } from "src/helpers/tokens";
import { darkTheme, lightTheme } from "src/helpers/tokens";

export const useTheme = (): BaseTheme => {
  const appearance = useColorScheme();
  const { colorScheme } = useCalendarTheme();

  const theme = colorScheme ?? appearance;

  return theme === "dark" ? darkTheme : lightTheme;
};
