import { describe, expect, it, setSystemTime } from "bun:test";
import { format } from "date-fns/fp/format";

import { buildCalendar } from "src/hooks/useCalendar";

describe("buildCalendar", () => {
  it("builds the month row", () => {
    const january = buildCalendar({
      calendarMonthId: "2024-01-15",
      calendarFirstDayOfWeek: "sunday",
    });
    expect(january.calendarRowMonth).toBe("January 2024");
  });

  it("build the month row with custom formatting", () => {
    const january = buildCalendar({
      calendarMonthId: "2024-01-01",
      calendarFirstDayOfWeek: "sunday",
      getCalendarMonthFormat: format("MMM yy"),
    });
    expect(january.calendarRowMonth).toBe("Jan 24");
  });

  it("builds the week days row starting on sunday", () => {
    const january = buildCalendar({
      calendarMonthId: "2024-01-01",
      calendarFirstDayOfWeek: "sunday",
    });

    expect(january.weekDaysList).toEqual(["S", "M", "T", "W", "T", "F", "S"]);
  });

  it("builds the week days row starting on monday", () => {
    const january = buildCalendar({
      calendarMonthId: "2024-01-01",
      calendarFirstDayOfWeek: "monday",
    });
    expect(january.weekDaysList).toEqual(["M", "T", "W", "T", "F", "S", "S"]);
  });

  it("builds the weeks row", () => {
    const { weeksList } = buildCalendar({
      calendarMonthId: "2024-02-01",
      calendarFirstDayOfWeek: "sunday",
    });

    // February 2024 has 5 weeks
    expect(weeksList).toHaveLength(5);

    // #region First week
    // Every week has 7 days
    expect(weeksList.every((week) => week.length === 7)).toBe(true);

    // @ts-ignore
    let [sunday, monday, tuesday, wednesday, thursday, friday, saturday] =
      weeksList[0];
    expect(sunday.isStartOfWeek).toBe(true);
    expect(saturday.isEndOfWeek).toBe(true);

    // Filler days are built correctly
    expect(
      [sunday, monday, tuesday, wednesday].every((day) => day.isDifferentMonth)
    ).toBe(true);
    expect(
      [thursday, friday, saturday].every((day) => day.isDifferentMonth)
    ).toBe(false);

    // Labels are correct
    expect(sunday.displayLabel).toBe("28");
    expect(monday.displayLabel).toBe("29");
    expect(tuesday.displayLabel).toBe("30");
    expect(wednesday.displayLabel).toBe("31");
    expect(thursday.displayLabel).toBe("1");
    expect(friday.displayLabel).toBe("2");
    expect(saturday.displayLabel).toBe("3");

    // IDs are correct
    expect(sunday.id).toBe("2024-01-28");
    expect(monday.id).toBe("2024-01-29");
    expect(tuesday.id).toBe("2024-01-30");
    expect(wednesday.id).toBe("2024-01-31");

    expect(thursday.id).toBe("2024-02-01");
    expect(thursday.isStartOfMonth).toBe(true);

    expect(friday.id).toBe("2024-02-02");
    expect(saturday.id).toBe("2024-02-03");
    // #endregion

    // #region Last weeek
    [sunday, monday, tuesday, wednesday, thursday, friday, saturday] =
      weeksList[4];

    //   Fillers are built correctly
    expect(sunday.isStartOfWeek).toBe(true);
    expect(saturday.isEndOfWeek).toBe(true);
    expect(
      [sunday, monday, tuesday, wednesday, thursday].every(
        (day) => day.isDifferentMonth
      )
    ).toBe(false);
    expect([friday, saturday].every((day) => day.isDifferentMonth)).toBe(true);

    // Labels are correct
    expect(sunday.displayLabel).toBe("25");
    expect(monday.displayLabel).toBe("26");
    expect(tuesday.displayLabel).toBe("27");
    expect(wednesday.displayLabel).toBe("28");
    expect(thursday.displayLabel).toBe("29");
    expect(friday.displayLabel).toBe("1");
    expect(saturday.displayLabel).toBe("2");

    // IDs are correct
    expect(sunday.id).toBe("2024-02-25");
    expect(monday.id).toBe("2024-02-26");
    expect(tuesday.id).toBe("2024-02-27");
    expect(wednesday.id).toBe("2024-02-28");

    expect(thursday.id).toBe("2024-02-29");
    expect(thursday.isEndOfMonth).toBe(true);

    expect(friday.id).toBe("2024-03-01");
    expect(saturday.id).toBe("2024-03-02");
    // #endregion
  });

  it("build the weeks row with custom formatting", () => {
    const { weeksList } = buildCalendar({
      calendarMonthId: "2024-03-01",
      calendarFirstDayOfWeek: "sunday",
      getCalendarDayFormat: format("dd"),
    });
    expect(weeksList[0]?.at(6)?.id).toBe("2024-03-02");
    expect(weeksList[0]?.at(6)?.displayLabel).toBe("02");
  });

  it("handles the expected range", () => {
    const { weeksList } = buildCalendar({
      calendarMonthId: "2024-02-01",
      calendarFirstDayOfWeek: "sunday",
      calendarActiveDateRanges: [
        { startId: "2024-02-03", endId: "2024-02-05" },
      ],
    });

    expect(weeksList[0]?.at(6)?.id).toBe("2024-02-03");
    expect(weeksList[0]?.at(6)?.isStartOfRange).toBe(true);
    expect(weeksList[0]?.at(6)?.state).toBe("active");
    expect(weeksList[0]?.at(6)?.isEndOfRange).toBe(false);

    expect(weeksList[1]?.at(1)?.id).toBe("2024-02-05");
    expect(weeksList[1]?.at(1)?.isEndOfRange).toBe(true);
    expect(weeksList[1]?.at(1)?.state).toBe("active");
    expect(weeksList[1]?.at(1)?.isStartOfRange).toBe(false);
  });

  it("calendarMinDate", () => {
    const calendarMinDateId = "2024-01-10";
    const february = buildCalendar({
      calendarMonthId: "2024-01-01",
      calendarMinDateId,
      calendarFirstDayOfWeek: "sunday",
    });

    const days = february.weeksList.flatMap((week) => week.map((day) => day));
    const beforeMinDate = days.filter((day) => day.id < calendarMinDateId);
    const minDateOrAfter = days.filter((day) => day.id >= calendarMinDateId);

    expect(beforeMinDate.every((day) => day.state === "disabled")).toBe(true);
    expect(minDateOrAfter.every((day) => day.state === "idle")).toBe(true);
  });

  it("calendarMaxDate", () => {
    const calendarMaxDateId = "2024-02-10";
    const february = buildCalendar({
      calendarMonthId: "2024-02-01",
      calendarMaxDateId,
      calendarFirstDayOfWeek: "sunday",
    });

    const days = february.weeksList.flatMap((week) => week.map((day) => day));
    const maxDateOrBefore = days.filter((day) => day.id <= calendarMaxDateId);
    const afterMaxDate = days.filter((day) => day.id > calendarMaxDateId);

    expect(afterMaxDate.every((day) => day.state === "disabled")).toBe(true);
    expect(maxDateOrBefore.every((day) => day.state === "idle")).toBe(true);
  });

  describe("isLastDayOfWeek", () => {
    it('isLastDayOfWeek respects "sunday" as last day of week', () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        calendarFirstDayOfWeek: "sunday",
      });
      const firstWeek = january.weeksList[0];
      const lastDay = firstWeek?.at(-1);
      expect(lastDay?.id).toBe("2024-01-06");
      expect(lastDay?.isEndOfWeek).toBe(true);
    });

    it('isLastDayOfWeek respects "monday" as last day of week', () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        calendarFirstDayOfWeek: "monday",
      });
      const firstWeek = january.weeksList[0];
      const lastDay = firstWeek?.at(-1);
      expect(lastDay?.id).toBe("2024-01-07");
      expect(lastDay?.isEndOfWeek).toBe(true);
    });
  });

  describe("isWeekend", () => {
    it("starting on sunday", () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        calendarFirstDayOfWeek: "sunday",
      });
      const firstWeek = january.weeksList[0];
      const sunday = firstWeek?.at(0);
      const saturday = firstWeek?.at(-1);
      const friday = firstWeek?.at(-2);

      expect(friday?.isWeekend).toBeFalse();
      expect(sunday?.isWeekend).toBeTrue();
      expect(saturday?.isWeekend).toBeTrue();
    });
    it("starting on monday", () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        calendarFirstDayOfWeek: "monday",
      });
      const firstWeek = january.weeksList[0];
      const sunday = firstWeek?.at(-1);
      const saturday = firstWeek?.at(-2);
      const friday = firstWeek?.at(-3);

      expect(friday?.isWeekend).toBeFalse();
      expect(sunday?.isWeekend).toBeTrue();
      expect(saturday?.isWeekend).toBeTrue();
    });
  });

  describe("state", () => {
    it("active: supersedes today", () => {
      // Mock clock
      setSystemTime(new Date(2024, 0 /*January*/, 10));

      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        calendarActiveDateRanges: [
          { startId: "2024-01-10", endId: "2024-01-10" },
        ],
      });

      expect(january.weeksList[1]?.at(3)?.id).toBe("2024-01-10");
      expect(january.weeksList[1]?.at(3)?.isToday).toBeTrue();

      // Even though it's today, the active state supersedes it
      expect(january.weeksList[1]?.at(3)?.state).toBe("active");
      expect(january.weeksList[1]?.at(3)?.isStartOfRange).toBeTrue();
      expect(january.weeksList[1]?.at(3)?.isEndOfRange).toBeTrue();

      // Reset clock
      setSystemTime();
    });

    it("active: supersedes disabled (with calendarDisabledDateIds)", () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        calendarActiveDateRanges: [
          { startId: "2024-01-10", endId: "2024-01-10" },
        ],
        calendarDisabledDateIds: ["2024-01-10"],
      });

      expect(january.weeksList[1]?.at(3)?.id).toBe("2024-01-10");
      expect(january.weeksList[1]?.at(3)?.isDisabled).toBeTrue();

      // Even though it's disabled, the active state supersedes it
      expect(january.weeksList[1]?.at(3)?.state).toBe("active");
      expect(january.weeksList[1]?.at(3)?.isStartOfRange).toBeTrue();
      expect(january.weeksList[1]?.at(3)?.isEndOfRange).toBeTrue();
    });

    it("active: supersedes disabled (with min)", () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        calendarActiveDateRanges: [
          { startId: "2024-01-10", endId: "2024-01-10" },
        ],
        calendarMinDateId: "2024-01-15",
      });

      expect(january.weeksList[1]?.at(3)?.id).toBe("2024-01-10");
      expect(january.weeksList[1]?.at(3)?.isDisabled).toBeTrue();

      // Even though it's disabled, the active state supersedes it
      expect(january.weeksList[1]?.at(3)?.state).toBe("active");
      expect(january.weeksList[1]?.at(3)?.isStartOfRange).toBeTrue();
      expect(january.weeksList[1]?.at(3)?.isEndOfRange).toBeTrue();
    });

    it("active: supersedes disabled (with max)", () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        calendarActiveDateRanges: [
          { startId: "2024-01-10", endId: "2024-01-10" },
        ],
        calendarMaxDateId: "2024-01-09",
      });

      expect(january.weeksList[1]?.at(3)?.id).toBe("2024-01-10");
      expect(january.weeksList[1]?.at(3)?.isDisabled).toBeTrue();

      // Even though it's disabled, the active state supersedes it
      expect(january.weeksList[1]?.at(3)?.state).toBe("active");
      expect(january.weeksList[1]?.at(3)?.isStartOfRange).toBeTrue();
      expect(january.weeksList[1]?.at(3)?.isEndOfRange).toBeTrue();
    });

    it("active: supersedes idle", () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        calendarActiveDateRanges: [
          { startId: "2024-01-10", endId: "2024-01-10" },
        ],
      });

      expect(january.weeksList[1]?.at(3)?.id).toBe("2024-01-10");

      // Even though it's disabled, the active state supersedes it
      expect(january.weeksList[1]?.at(3)?.state).toBe("active");
      expect(january.weeksList[1]?.at(3)?.isStartOfRange).toBeTrue();
      expect(january.weeksList[1]?.at(3)?.isEndOfRange).toBeTrue();

      // Just to make sure the idle state is correct
      expect(january.weeksList[1]?.at(4)?.state).toBe("idle");
    });

    it("disabled: supersedes idle", () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        calendarDisabledDateIds: ["2024-01-10"],
      });

      expect(january.weeksList[1]?.at(3)?.id).toBe("2024-01-10");
      expect(january.weeksList[1]?.at(3)?.isDisabled).toBeTrue();

      expect(january.weeksList[1]?.at(3)?.state).toBe("disabled");
      // Just to make sure the idle state is correct
      expect(january.weeksList[1]?.at(4)?.state).toBe("idle");
    });

    it("today: supersedes idle", () => {
      setSystemTime(new Date(2024, 0 /*January*/, 10));
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
      });

      expect(january.weeksList[1]?.at(3)?.id).toBe("2024-01-10");
      expect(january.weeksList[1]?.at(3)?.isToday).toBeTrue();
      expect(january.weeksList[1]?.at(3)?.state).toBe("today");

      // Just to make sure the idle state is correct
      expect(january.weeksList[1]?.at(2)?.state).toBe("idle");
      expect(january.weeksList[1]?.at(4)?.state).toBe("idle");
      setSystemTime();
    });

    it("idle: serves as the base state", () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
      });
      expect(
        january.weeksList
          .flatMap((week) => week.map((day) => day.state))
          .every((state) => state === "idle")
      ).toBeTrue();
    });

    it("disabledDaysIndexes: dims specific days of the week without disabling selection", () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        disabledDaysIndexes: [0, 6], // Sunday and Saturday
      });

      // Check first week
      const firstWeek = january.weeksList[0];
      if (!firstWeek) throw new Error("First week is undefined");

      // Days should be dimmed but not disabled
      expect(firstWeek[0]?.isDimmed).toBeTrue(); // Sunday
      expect(firstWeek[6]?.isDimmed).toBeTrue(); // Saturday
      expect(firstWeek[1]?.isDimmed).toBeFalse(); // Monday

      // State should be idle (selectable)
      expect(firstWeek[0]?.state).toBe("idle");
      expect(firstWeek[6]?.state).toBe("idle");
      expect(firstWeek[1]?.state).toBe("idle");
    });

    it("disabled: disables selection without changing style", () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        disabled: true,
      });

      // All days should be disabled but not dimmed
      expect(
        january.weeksList
          .flatMap((week) => week.map((day) => day.state))
          .every((state) => state === "disabled")
      ).toBeTrue();

      expect(
        january.weeksList
          .flatMap((week) => week.map((day) => day.isDimmed))
          .every((isDimmed) => isDimmed === false)
      ).toBeTrue();
    });

    it("restrictions: restricts selection to specified ranges", () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        restrictions: [
          { startId: "2024-01-10", endId: "2024-01-15" },
          { startId: "2024-01-20", endId: "2024-01-25" },
        ],
      });

      // Days outside restrictions should be disabled
      expect(january.weeksList[1]?.at(2)?.id).toBe("2024-01-09");
      expect(january.weeksList[1]?.at(2)?.state).toBe("disabled");

      // Days within restrictions should be idle (selectable)
      expect(january.weeksList[1]?.at(3)?.id).toBe("2024-01-10");
      expect(january.weeksList[1]?.at(3)?.state).toBe("idle");
      expect(january.weeksList[2]?.at(1)?.id).toBe("2024-01-15");
      expect(january.weeksList[2]?.at(1)?.state).toBe("idle");

      // Days between restrictions should be disabled
      expect(january.weeksList[2]?.at(5)?.id).toBe("2024-01-19");
      expect(january.weeksList[2]?.at(5)?.state).toBe("disabled");

      // Days within second restriction should be idle (selectable)
      expect(january.weeksList[3]?.at(0)?.id).toBe("2024-01-21");
      expect(january.weeksList[3]?.at(0)?.state).toBe("idle");
    });

    it("dimmedDays: dims specified days without affecting selection", () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        dimmedDays: ["2024-01-10", "2024-01-15"],
      });

      // Check if specified days are dimmed
      expect(january.weeksList[1]?.at(3)?.id).toBe("2024-01-10");
      expect(january.weeksList[1]?.at(3)?.isDimmed).toBeTrue();
      expect(january.weeksList[2]?.at(1)?.id).toBe("2024-01-15");
      expect(january.weeksList[2]?.at(1)?.isDimmed).toBeTrue();

      // Check if other days are not dimmed
      expect(january.weeksList[1]?.at(2)?.id).toBe("2024-01-09");
      expect(january.weeksList[1]?.at(2)?.isDimmed).toBeFalse();

      // All days should be idle (selectable)
      expect(january.weeksList[1]?.at(3)?.state).toBe("idle");
      expect(january.weeksList[2]?.at(1)?.state).toBe("idle");
      expect(january.weeksList[1]?.at(2)?.state).toBe("idle");
    });

    it("combines dimmedDays with disabledDaysIndexes: both affect style but not selection", () => {
      const january = buildCalendar({
        calendarMonthId: "2024-01-01",
        dimmedDays: ["2024-01-10"],
        disabledDaysIndexes: [0], // Sunday
      });

      // Check if Sunday is dimmed but not disabled
      expect(january.weeksList[0]?.at(0)?.id).toBe("2023-12-31");
      expect(january.weeksList[0]?.at(0)?.isDimmed).toBeTrue();
      expect(january.weeksList[0]?.at(0)?.state).toBe("idle");

      // Check if specified day is dimmed but not disabled
      expect(january.weeksList[1]?.at(3)?.id).toBe("2024-01-10");
      expect(january.weeksList[1]?.at(3)?.isDimmed).toBeTrue();
      expect(january.weeksList[1]?.at(3)?.state).toBe("idle");
    });
  });
});
