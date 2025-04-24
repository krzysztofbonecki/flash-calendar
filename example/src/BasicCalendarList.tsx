import React from "react";

import { Calendar } from "../../src";

export const BasicCalendarList = () => {
  return (
    <Calendar.List
      calendarActiveDateRanges={[
        { startId: "2025-04-24", endId: "2025-04-25", color: "red" },
      ]}
      onCalendarDayPress={() => {}}
      dimmedDays={["2025-04-24", "2025-04-27", "2025-04-26"]}
      disabledDaysIndexes={[0, 6]}
      restrictions={[{ endId: undefined, startId: "2025-04-22" }]}
      theme={{
        itemDayContainer: {
          activeDayFiller: {
            backgroundColor: "orange",
          },
        },
        itemDay: {
          base: (params) => {
            if (params.state === "active") {
              return {
                container: { backgroundColor: params.color ?? "orange" },
              };
            }
            return {};
          },
        },
      }}
    />
  );
};
