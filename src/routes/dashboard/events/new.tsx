"use client";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import secureLocalStorage from "react-secure-storage";
import type { CreateEventFormState } from "@/types/events";
import { MultiSelectBlock } from "@/components/events/multiselect";

type Organizer = { id: string; organizer_name: string };
type Tag = { id: string; name: string };
type Person = { id: string; name: string };

const EMPTY_CREATE_FORM: CreateEventFormState = {
  name: "",
  blurb: "",
  description: "",
  cover_image_url: "",
  price: 0,
  is_per_head: false,
  rules: "",
  event_type: "EVENT",
  is_group: false,
  min_teamsize: null,
  max_teamsize: null,
  total_seats: 0,
  seats_filled: 0,

  event_status: "ACTIVE",
  event_mode: "OFFLINE",
  attendance_mode: "SOLO",

  organizer_ids: [],
  tag_ids: [],
  people_ids: [],

  schedule: {
    event_date: "",
    start_time: "",
    end_time: "",
    venue: "",
  },
};
export const Route = createFileRoute("/dashboard/events/new")({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData({ queryKey: ["organizers"] });
    queryClient.ensureQueryData({ queryKey: ["tags"] });
    queryClient.ensureQueryData({ queryKey: ["people"] });
  },
  component: NewEventPage,
});

/* ---------------- COMPONENT ---------------- */

function NewEventPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState<CreateEventFormState>(EMPTY_CREATE_FORM);

  /* ---------------- FETCH DROPDOWNS ---------------- */

  const { data: organizers = [] } = useQuery<Organizer[]>({
    queryKey: ["organizers"],
    queryFn: async () =>
      (await axios.get(api.FETCH_ALL_ORGANIZERS)).data.organizers,
  });

  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => (await axios.get(api.FETCH_ALL_TAGS)).data.tags,
  });

  const { data: people = [] } = useQuery<Person[]>({
    queryKey: ["people"],
    queryFn: async () => (await axios.get(api.FETCH_ALL_PEOPLE)).data.people,
  });
  const createMutation = useMutation({
    mutationFn: async () =>
      axios.post(api.FETCH_ALL_EVENTS, form, {
        headers: {
          Authorization: `Bearer ${secureLocalStorage.getItem("t")}`,
        },
      }),
    onSuccess: () => {
      alert("✅ Event Created Successfully!");
      qc.invalidateQueries({ queryKey: ["events"] });
      router.navigate({ to: "/dashboard/events" });
    },
  });
  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Create New Event
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in the details below to create a new event for your
            organization.
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-3">
              Basic Information
            </h2>

            <div className="grid gap-2">
              <Label htmlFor="event-name" className="font-medium">
                Event Name *
              </Label>
              <Input
                id="event-name"
                placeholder="Enter event name (e.g., Tech Conference 2025)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="blurb" className="font-medium">
                Blurb *
              </Label>
              <Textarea
                id="blurb"
                placeholder="Brief description (e.g., A one-day conference exploring the latest in AI and technology)"
                value={form.blurb}
                onChange={(e) => setForm({ ...form, blurb: e.target.value })}
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the event..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="resize-none"
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cover-image" className="font-medium">
                Cover Image URL
              </Label>
              <Input
                id="cover-image"
                placeholder="https://example.com/image.jpg"
                type="url"
                value={form.cover_image_url}
                onChange={(e) =>
                  setForm({ ...form, cover_image_url: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rules" className="font-medium">
                Rules & Guidelines
              </Label>
              <Textarea
                id="rules"
                placeholder="Specify any rules, dress code, or guidelines for attendees..."
                value={form.rules}
                onChange={(e) => setForm({ ...form, rules: e.target.value })}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* EVENT CONFIGURATION SECTION */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-3">
              Event Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="event-type" className="font-medium">
                  Event Type *
                </Label>
                <Select
                  value={form.event_type}
                  onValueChange={(v) =>
                    setForm({ ...form, event_type: v as any })
                  }
                >
                  <SelectTrigger id="event-type">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EVENT">Event</SelectItem>
                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    <SelectItem value="SEMINAR">Seminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="event-mode" className="font-medium">
                  Event Mode *
                </Label>
                <Select
                  value={form.event_mode}
                  onValueChange={(v) =>
                    setForm({ ...form, event_mode: v as any })
                  }
                >
                  <SelectTrigger id="event-mode">
                    <SelectValue placeholder="Select event mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="event-status" className="font-medium">
                  Event Status *
                </Label>
                <Select
                  value={form.event_status}
                  onValueChange={(v) =>
                    setForm({ ...form, event_status: v as any })
                  }
                >
                  <SelectTrigger id="event-status">
                    <SelectValue placeholder="Select event status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="attendance-mode" className="font-medium">
                  Attendance Mode *
                </Label>
                <Select
                  value={form.attendance_mode}
                  onValueChange={(v) =>
                    setForm({ ...form, attendance_mode: v as any })
                  }
                >
                  <SelectTrigger id="attendance-mode">
                    <SelectValue placeholder="Select attendance mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOLO">Solo</SelectItem>
                    <SelectItem value="TEAM">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-3">
              Pricing & Capacity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price" className="font-medium">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                />
              </div>

              <div className="flex items-end gap-4 pb-2">
                <div className="flex-1 flex items-center gap-3 bg-muted/50 px-4 py-3 rounded-md border border-border">
                  <input
                    id="per-head"
                    type="checkbox"
                    checked={form.is_per_head}
                    onChange={(e) =>
                      setForm({ ...form, is_per_head: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-border cursor-pointer"
                  />
                  <Label
                    htmlFor="per-head"
                    className="font-medium cursor-pointer mb-0"
                  >
                    Price per head?
                  </Label>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="total-seats" className="font-medium">
                  Total Seats *
                </Label>
                <Input
                  id="total-seats"
                  type="number"
                  placeholder="100"
                  min="0"
                  value={form.total_seats}
                  onChange={(e) =>
                    setForm({ ...form, total_seats: Number(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="seats-filled" className="font-medium">
                  Seats Filled
                </Label>
                <Input
                  id="seats-filled"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={form.seats_filled}
                  onChange={(e) =>
                    setForm({ ...form, seats_filled: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-3 bg-muted/50 px-4 py-3 rounded-md border border-border">
              <input
                id="group-event"
                type="checkbox"
                checked={form.is_group}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_group: e.target.checked,
                    attendance_mode: e.target.checked ? "TEAM" : "SOLO",
                  })
                }
                className="w-4 h-4 rounded border-border cursor-pointer"
              />
              <Label
                htmlFor="group-event"
                className="font-medium cursor-pointer mb-0"
              >
                This is a group event
              </Label>
            </div>

            {form.is_group && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="grid gap-2">
                  <Label htmlFor="min-team" className="font-medium">
                    Minimum Team Size
                  </Label>
                  <Input
                    id="min-team"
                    type="number"
                    placeholder="1"
                    min="0"
                    value={form.min_teamsize ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, min_teamsize: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max-team" className="font-medium">
                    Maximum Team Size
                  </Label>
                  <Input
                    id="max-team"
                    type="number"
                    placeholder="10"
                    min="0"
                    value={form.max_teamsize ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, max_teamsize: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* SELECTIONS SECTION */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-3">
              Organizers & Tags
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MultiSelectBlock
                label="Organizers"
                items={organizers}
                selected={form.organizer_ids}
                onChange={(ids) => setForm({ ...form, organizer_ids: ids })}
                getLabel={(o) => o.organizer_name}
              />

              <MultiSelectBlock
                label="Tags"
                items={tags}
                selected={form.tag_ids}
                onChange={(ids) => setForm({ ...form, tag_ids: ids })}
                getLabel={(t) => t.name}
              />
            </div>

            <MultiSelectBlock
              label="People"
              items={people}
              selected={form.people_ids}
              onChange={(ids) => setForm({ ...form, people_ids: ids })}
              getLabel={(p) => p.name}
            />
          </div>

          {/* SCHEDULE SECTION */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-3">
              Schedule & Venue
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="event-date" className="font-medium">
                  Event Date *
                </Label>
                <Input
                  id="event-date"
                  type="date"
                  value={form.schedule.event_date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      schedule: {
                        ...form.schedule,
                        event_date: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="start-time" className="font-medium">
                  Start Time *
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={form.schedule.start_time}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      schedule: {
                        ...form.schedule,
                        start_time: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="end-time" className="font-medium">
                  End Time *
                </Label>
                <Input
                  id="end-time"
                  type="time"
                  value={form.schedule.end_time}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      schedule: {
                        ...form.schedule,
                        end_time: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="venue" className="font-medium">
                  Venue
                </Label>
                <Input
                  id="venue"
                  placeholder="Main Auditorium"
                  value={form.schedule.venue}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      schedule: {
                        ...form.schedule,
                        venue: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-border">
            <Button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
              className="flex-1 sm:flex-none"
              size="lg"
            >
              {createMutation.isPending ? "Creating..." : "Create Event"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.navigate({ to: "/dashboard/events" })}
              className="flex-1 sm:flex-none"
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
