import mitt from "mitt";
import { useEffect, useState } from "react";

import {
  getStateFields,
  type CalendarActiveDateRange,
  type CalendarDayMetadata,
} from "./useCalendar";

interface OnSetActiveDateRangesPayload {
  instanceId?: string;
  ranges: CalendarActiveDateRange[];
}

/**
 * An event emitter for the active date ranges. This notifies the calendar items
 * when their state changes, allowing just the affected items to re-render.
 *
 * While this is an implementation detail focused on improving performance, it's
 * exported in case you need to build your own calendar. Check the source code
 * for a reference implementation.
 */
export const activeDateRangesEmitter = mitt<{
  onSetActiveDateRanges: OnSetActiveDateRangesPayload;
  onSetPreActiveDateRanges: OnSetActiveDateRangesPayload;
}>();

/**
 * The default calendar instance ID. This is used when no instance ID is provided.
 */
const DEFAULT_CALENDAR_INSTANCE_ID = "flash-calendar-default-instance";

/**
 * Returns an optimized metadata for a particular day. This hook listens to the
 * `activeDateRanges` emitter, enabling only the affected calendar items to
 * re-render.
 *
 * While this is an implementation detail focused on improving performance, it's
 * exported in case you need to build your own calendar. Check the source code
 * for a reference implementation.
 */
export const useOptimizedDayMetadata = (
  baseMetadata: CalendarDayMetadata,
  calendarInstanceId?: string
) => {
  const [metadata, setMetadata] = useState(baseMetadata);

  // This is used to store the matadata with the pre-active date ranges.
  const [preMetadata, setPreMetadata] = useState(baseMetadata);

  const safeCalendarInstanceId =
    calendarInstanceId ?? DEFAULT_CALENDAR_INSTANCE_ID;

  // Ensure the metadata is updated when the base changes.
  useEffect(() => {
    setMetadata(baseMetadata);
    setPreMetadata(baseMetadata);
  }, [baseMetadata]);

  useEffect(() => {
    const handler = (payload: OnSetActiveDateRangesPayload) => {
      const { ranges, instanceId = DEFAULT_CALENDAR_INSTANCE_ID } = payload;
      if (instanceId !== safeCalendarInstanceId) {
        // This event is not for this instance, ignore it.
        return;
      }

      // We're only interested in the active date ranges, no need to worry about
      // disabled states. These are already covered by the base metadata.
      const {
        isStartOfRange,
        isEndOfRange,
        isRangeValid,
        state,
        color,
        textColor,
      } = getStateFields({
        id: metadata.id,
        date: metadata.date,
        calendarActiveDateRanges: ranges,
      });

      if (state === "active") {
        const newMetadata = {
          ...metadata,
          isStartOfRange,
          isEndOfRange,
          isRangeValid,
          color,
          state,
          textColor,
        };
        setMetadata(newMetadata);
        setPreMetadata(newMetadata);
      } else if (metadata.state === "active") {
        setPreMetadata({
          ...metadata,
          isStartOfRange,
          isEndOfRange,
          isRangeValid,
          color,
          state,
          textColor,
        });
      } else {
        // Resets the state when it's no longer active.
        setMetadata(baseMetadata);
        setPreMetadata(baseMetadata);
      }
    };

    activeDateRangesEmitter.on("onSetPreActiveDateRanges", handler);

    return () => {
      activeDateRangesEmitter.off("onSetPreActiveDateRanges", handler);
    };
  }, [safeCalendarInstanceId, baseMetadata, metadata]);

  useEffect(() => {
    const handler = (payload: OnSetActiveDateRangesPayload) => {
      const { ranges, instanceId = DEFAULT_CALENDAR_INSTANCE_ID } = payload;
      if (instanceId !== safeCalendarInstanceId) {
        // This event is not for this instance, ignore it.
        return;
      }

      // We're only interested in the active date ranges, no need to worry about
      // disabled states. These are already covered by the base metadata.
      const {
        isStartOfRange,
        isEndOfRange,
        isRangeValid,
        state,
        color,
        textColor,
      } = getStateFields({
        id: baseMetadata.id,
        date: baseMetadata.date,
        calendarActiveDateRanges: ranges,
      });

      if (state === "active") {
        setMetadata((prev) => ({
          ...prev,
          isStartOfRange,
          isEndOfRange,
          isRangeValid,
          color,
          state,
          textColor,
        }));
      } else if (preMetadata.state === "active") {
        setMetadata(preMetadata);
      } else {
        // Resets the state when it's no longer active.
        setMetadata(baseMetadata);
      }
    };

    activeDateRangesEmitter.on("onSetActiveDateRanges", handler);

    return () => {
      activeDateRangesEmitter.off("onSetActiveDateRanges", handler);
    };
  }, [safeCalendarInstanceId, preMetadata, baseMetadata]);

  return metadata;
};
