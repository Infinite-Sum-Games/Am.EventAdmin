import { create } from 'zustand';

export type EventType = "EVENT" | "WORKSHOP";
export type EventStatus = "ACTIVE" | "CLOSED" | "COMPLETED";
export interface EventData {
  attendance_mode?: "SOLO" | "DUO",
  blurb: string,
  description?: string,
  id: string,
  name: string,
  event_type: EventType,
  event_status: EventStatus
  is_group: boolean,
  is_offline?: boolean,
  is_published?: boolean,
  is_technical: boolean,
  is_completed?: boolean,
  min_teamsize?: number | 1,
  max_teamsize?: number | 1,
  organizers?: organizers[],
  people?: people[],
  poster_url: string,
  price: number,
  is_per_head: boolean,
  rules?: string,
  schedules?: schedules[],
  total_seats: number,
  seats_filled: number,
  tags?: tags[],
  updated_at?: string,
}

export interface organizers {
  id?: string;
  name: string;
}

export interface people {
  id?: string;
  name: string;
}

export interface tags {
  id?: string;
  name: string;
}

export interface schedules {
  id?: string;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  updated_at?: string;
}

interface EventEditorState {
  eventData: EventData | null;
  setEventData: (data: Partial<EventData>) => void;
  initializeEvent: (data: EventData) => void;
}

export const useEventEditorStore = create<EventEditorState>((set) => ({
  eventData: null,
  initializeEvent: (data) => set({ eventData: data }),
  setEventData: (updates) =>
    set((state) => ({
      eventData: state.eventData ? { ...state.eventData, ...updates } : null,
    })),
}));