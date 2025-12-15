// import { Temporal } from "temporal-polyfill";

// export const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// // "09:30" + "2026-01-07" → RFC3339 timestamp
// export function buildTimestamp(date: string, time: string) {
//   const [hour, minute] = time.split(":").map(Number);

//   const plainDate = Temporal.PlainDate.from(date);
//   const plainDateTime = plainDate.toPlainDateTime({
//     hour,
//     minute,
//   });

//   return plainDateTime
//     .toZonedDateTime(timeZone)
//     .toInstant()
//     .toString(); // RFC3339
// }

// // RFC3339 → "HH:mm"
// export function formatTime(rfc3339?: string | null) {
//   if (!rfc3339) return "--";
//   try {
//     return Temporal.Instant.from(rfc3339)
//       .toZonedDateTimeISO(Intl.DateTimeFormat().resolvedOptions().timeZone)
//       .toPlainTime()
//       .toString({ smallestUnit: "minute" });
//   } catch {
//     return "--";
//   }
// }

import { Temporal } from "temporal-polyfill";

/**
 * Combines a date string (YYYY-MM-DD) and a time string (HH:mm)
 * into a UTC ISO Timestamp without shifting the timezone.
 * * Example: Input "2026-01-07", "05:41" -> Output "2026-01-07T05:41:00Z"
 */
export const buildTimestamp = (dateStr: string, timeStr: string): string => {
  if (!dateStr) return "";
  
  // 1. Create a "Plain" date and time (no timezone info yet)
  const plainDate = Temporal.PlainDate.from(dateStr);
  const plainTime = timeStr ? Temporal.PlainTime.from(timeStr) : Temporal.PlainTime.from("00:00");

  // 2. Combine them into a PlainDateTime
  const plainDateTime = plainDate.toPlainDateTime(plainTime);

  // 3. Force this exact time into UTC.
  // We treat the inputs as "UTC" numbers directly to preserve the digits.
  const zonedDateTime = plainDateTime.toZonedDateTime("UTC");

  // 4. Return as ISO String for the backend (e.g. "2026-01-07T05:41:00Z")
  return zonedDateTime.toInstant().toString();
};

/**
 * Extracts the HH:mm time from an ISO string, ignoring timezone shifts.
 * * Example: Input "2026-01-07T05:41:00Z" -> Output "05:41"
 */
export const formatTime = (isoString: string | undefined | null): string => {
  if (!isoString) return "--";

  try {
    const plainDateTime = Temporal.PlainDateTime.from(isoString);
    return plainDateTime.toPlainTime().toString({ smallestUnit: "minute" });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "--";
  }
};

export const formatTimeWithAMPM = (isoString: string | undefined | null): string => {
  if (!isoString) return "--";
  try {
    const plainDateTime = Temporal.PlainDateTime.from(isoString);
    
    // Use toLocaleString to get "10:00 AM" format
    return plainDateTime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return "--";
  }
};
