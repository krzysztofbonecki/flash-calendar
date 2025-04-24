import React from "react";

import { Calendar } from "../../src";

export const BasicCalendarList = () => {
  return (
    <Calendar.List
      calendarActiveDateRanges={[
        { startId: "2025-04-24", endId: "2025-04-25" },
      ]}
      onCalendarDayPress={() => {}}
      restrictions={[{ endId: undefined, startId: "2025-04-26" }]}
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
