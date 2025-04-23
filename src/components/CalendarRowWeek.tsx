import type { ReactNode } from "react";
import React, { useMemo } from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet } from "react-native";

import { HStack } from "src/components/HStack";
import type { BaseTheme } from "src/helpers/tokens";

export interface CalendarRowWeekProps {
  children: ReactNode;
  spacing?: keyof BaseTheme["spacing"];
  theme?: CalendarRowWeekTheme;
}

interface CalendarRowWeekTheme {
  container?: ViewStyle;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

export const CalendarRowWeek = ({
  children,
  spacing = 0,
  theme,
}: CalendarRowWeekProps) => {
  const { containerStyles } = useMemo(() => {
    return {
      containerStyles: { ...styles.container, ...(theme?.container ?? {}) },
    };
  }, [theme?.container]);
  return (
    <HStack
      alignItems="center"
      grow
      justifyContent="space-between"
      spacing={spacing}
      style={containerStyles}
    >
      {children}
    </HStack>
  );
};
