export type RevenuePerEvent = {
    revenue: number;
    event_id: string;
    event_name: string;
};

export type RevenuePerDate = {
    revenue: number;
    revenue_date: string;
};

export type RevenuePerOrganizer = {
    revenue: number;
    organizer_id: string;
    organizer_name: string;
};

export type RevenueSummary = {
    id: number;
    total_revenue: number;
    revenue_per_event: RevenuePerEvent[];
    revenue_per_date: RevenuePerDate[];
    revenue_per_organizer: RevenuePerOrganizer[];
};

export type GetRevenueSummaryResponse = {
    message: string;
    revenue_summary: RevenueSummary;
};

// registrations

export type EventRegistrationStat = {
    event_id: string;
    event_name: string;
    total_seats: number;
    registered_count: number;
};

export type ParticipantSplit = {
    participants: number;
    non_participants: number;
};

export type RegistrationSummary = {
    id: number;
    total_event_registrations: number;
    participant_split: ParticipantSplit;
    event_registration_stats: EventRegistrationStat[];
};

export type GetRegistrationSummaryResponse = {
    message: string;
    registration_summary: RegistrationSummary;
};