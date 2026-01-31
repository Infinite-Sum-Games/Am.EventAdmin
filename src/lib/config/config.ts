import { z } from "zod";

// Define Zod schema for environment variable validation
const adminPanelConfigSchema = z.object({
  // Event name validation
  name: z.string()
    .min(2, "Event name must be at least 2 characters")
    .max(100, "Event name must be less than 100 characters"),
  
  // Event year validation
  year: z.string()
    .regex(/^\d{4}$/, "Year must be a 4-digit number")
    .transform((val) => parseInt(val, 10))
    .refine((year) => year >= new Date().getFullYear(), {
      message: `Year must be greater than or equal to ${new Date().getFullYear()}`
    }),
  
  // Event dates validation (JSON array)
  dates: z.string()
    .transform((val) => {
      try {
        const parsed = JSON.parse(val);
        if (!Array.isArray(parsed)) {
          throw new Error("Must be a JSON array");
        }
        return parsed;
      } catch {
        throw new Error("Must be valid JSON array");
      }
    })
    .pipe(
      z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Each date must be YYYY-MM-DD format"))
        .min(1, "At least one event date is required")
    )
    .transform((dates) => {
      // Validate date format and chronological order
      const dateObjects = dates.map(dateStr => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          throw new Error(`Invalid date: ${dateStr}`);
        }
        return { date, original: dateStr };
      });
      
      // Sort chronologically
      dateObjects.sort((a, b) => a.date.getTime() - b.date.getTime());
      
      return dateObjects.map(obj => obj.original);
    }),
  
  // Website URL validation
  mainWebsite: z.string()
    .url("Must be a valid URL including http:// or https://")
    .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
      message: "URL must include protocol (http:// or https://)"
    }),
});

// Type inference from schema
export type EventConfig = z.infer<typeof adminPanelConfigSchema>;

// Parse and validate environment variables
const parseEventConfig = (): EventConfig => {
  const result = adminPanelConfigSchema.safeParse({
    name: import.meta.env.VITE_EVENT_NAME,
    year: import.meta.env.VITE_EVENT_YEAR,
    dates: import.meta.env.VITE_EVENT_DATES,
    mainWebsite: import.meta.env.VITE_EVENT_MAIN_WEBSITE,
  });

  if (!result.success) {
    console.error("Admin Panel Configuration Error:", result.error);
    console.warn("Using fallback configuration");
    return {
      name: "Anokha",
      year: 2026,
      dates: ["2026-01-07", "2026-01-08", "2026-01-09"],
      mainWebsite: "https://anokha.amrita.edu"
    };
  }

  return result.data;
};

// Export validated configuration
export const EVENT_CONFIG: EventConfig = parseEventConfig();

// Helper function to generate EVENT_DAYS object from dates array
export function generateEventDays(dates: string[]): Record<string, { label: string; shortDate: string }> {
  return dates.reduce((acc, date, index) => {
    const dateObj = new Date(date);
    const shortDate = dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    acc[date] = {
      label: (index + 1).toString(),
      shortDate: shortDate
    };
    
    return acc;
  }, {} as Record<string, { label: string; shortDate: string }>);
}

// Computed properties for convenience
export const EVENT_FULL_NAME = `${EVENT_CONFIG.name} ${EVENT_CONFIG.year}`;
export const EVENT_DAYS = generateEventDays(EVENT_CONFIG.dates);