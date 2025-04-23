import { CalendarItemEmpty } from "src/components/CalendarItemEmpty";
import { CalendarItemWeekName } from "src/components/CalendarItemWeekName";
import { CalendarList } from "src/components/CalendarList";
import { CalendarRowMonth } from "src/components/CalendarRowMonth";
import { CalendarRowWeek } from "src/components/CalendarRowWeek";
import { HStack } from "src/components/HStack";
import { VStack } from "src/components/VStack";
import {
  CalendarItemDay,
  CalendarItemDayContainer,
  CalendarItemDayWithContainer,
} from "src/components/CalendarItemDay";
import { Calendar as CalendarDefault } from "src/components/Calendar";

/**
 * This file houses the public API for the flash-calendar package.
 */

type CalendarItemDayNamespace = {
  Container: typeof CalendarItemDayContainer;
  WithContainer: typeof CalendarItemDayWithContainer;
} & typeof CalendarItemDay;

const CalendarItemDayWithNamespace =
  CalendarItemDay as CalendarItemDayNamespace;

CalendarItemDayWithNamespace.Container = CalendarItemDayContainer;
CalendarItemDayWithNamespace.WithContainer = CalendarItemDayWithContainer;
export type {
  CalendarItemDayContainerProps,
  CalendarItemDayProps,
  CalendarItemDayWithContainerProps,
} from "src/components/CalendarItemDay";

interface CalendarItemNamespace {
  /**
   * Renders the day item of the calendar (e.g. `1`, `2`, `3`, etc.)
   */
  Day: typeof CalendarItemDayWithNamespace;
  /**
   * Renders the week day name item of the calendar (e.g. `Sun`, `Mon`, `Tue`, etc.)
   */
  WeekName: typeof CalendarItemWeekName;
  /**
   * Renders an empty item to fill the calendar's grid in the start or end of
   * the month.
   */
  Empty: typeof CalendarItemEmpty;
}

const CalendarItemWithNamespace = {} as CalendarItemNamespace;
CalendarItemWithNamespace.Day = CalendarItemDayWithNamespace;

CalendarItemWithNamespace.WeekName = CalendarItemWeekName;
export type { CalendarItemWeekNameProps } from "src/components/CalendarItemWeekName";

CalendarItemWithNamespace.Empty = CalendarItemEmpty;
export type { CalendarItemEmptyProps } from "src/components/CalendarItemEmpty";

interface CalendarRowNamespace {
  /**
   * Renders the month row of the calendar (e.g. `January`, `February`, `March`, etc.)
   */
  Month: typeof CalendarRowMonth;
  /**
   * Renders each week row of the calendar, including the week day names.
   */
  Week: typeof CalendarRowWeek;
}

const CalendarRowWithNamespace = {} as CalendarRowNamespace;
CalendarRowWithNamespace.Month = CalendarRowMonth;
export type { CalendarRowMonthProps } from "src/components/CalendarRowMonth";

CalendarRowWithNamespace.Week = CalendarRowWeek;
export type { CalendarRowWeekProps } from "src/components/CalendarRowWeek";

type CalendarNamespace = {
  Item: typeof CalendarItemWithNamespace;
  Row: typeof CalendarRowWithNamespace;
  List: typeof CalendarList;
  HStack: typeof HStack;
  VStack: typeof VStack;
} & typeof CalendarDefault;
export type {
  CalendarOnDayPress,
  CalendarProps,
  CalendarTheme,
} from "src/components/Calendar";

const CalendarWithNamespace = CalendarDefault as CalendarNamespace;
CalendarWithNamespace.Item = CalendarItemWithNamespace;
CalendarWithNamespace.Row = CalendarRowWithNamespace;

CalendarWithNamespace.List = CalendarList;
export type {
  CalendarListProps,
  CalendarListRef,
  CalendarMonthEnhanced,
} from "src/components/CalendarList";

// Useful for customizing the layout of the calendar, re-exported for convenience
CalendarWithNamespace.HStack = HStack;
CalendarWithNamespace.VStack = VStack;
export type { HStackProps } from "src/components/HStack";
export type { VStackProps } from "src/components/VStack";

export const Calendar = CalendarWithNamespace;
