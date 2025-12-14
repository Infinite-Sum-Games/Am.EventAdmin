import { create } from 'zustand';

export interface EventData {
  attendance_mode: "SOLO" | "DUO",
  blurb: string,
  description: string,
  id: string,
  name: string,
  event_type: "EVENT" | "WORKSHOP",
  event_status: "ACTIVE" | "CLOSED" | "COMPLETED",
  is_group: boolean,
  is_offline: boolean,
  is_published: boolean,
  is_technical: boolean,
  is_completed: boolean,
  max_teamsize: number,
  // message from response
  message?: string,
  min_teamsize: number,
  organizers: organizers[],
  people: people[],
  poster_url: string,
  price: number,
  is_per_head: boolean,
  rules: string,
  schedules: schedules[],
  total_seats: number,
  seats_filled?: number,
  tags: tags[]
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