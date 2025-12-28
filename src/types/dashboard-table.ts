export interface Leaderboard {
    event_id: string;
    event_name: string;
    revenue: number;
    revenue_without_gst: number;
    seats_filled: number;
    total_seats: number;
    is_group: boolean;
    actual_participant_count: number;
    event_type: "WORKSHOP" | "EVENT";
}

export interface GetLeaderboardResponse {
    message: string;
    leaderboard: Leaderboard[];
}