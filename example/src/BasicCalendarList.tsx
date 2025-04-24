import React from "react";

import { Calendar } from "../../src";

export const BasicCalendarList = () => {
  return (
    <Calendar.List
      calendarActiveDateRanges={[
        { startId: "2025-04-24", endId: "2025-04-25", color: "red" },
      ]}
      onCalendarDayPress={() => {}}
    />
  );
};
