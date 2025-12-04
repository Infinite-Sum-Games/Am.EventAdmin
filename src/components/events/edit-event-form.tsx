"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/lib/api";
import type { EventFormState } from "@/types/events";
import { ChevronsUpDown } from "lucide-react";
import { EMPTY_FORM } from "@/types/constants";
import { createEventSchema } from "@/schemas/event";

type Organizer = { id: string; organizer_name: string };
type Tag = { id: string; name: string };
type Person = { id: string; name: string };

export function EditEventForm({ eventId }: { eventId: string }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<EventFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadEvent() {
      const { data } = await axios.get(api.FETCH_EVENT_BY_ID(eventId));
      const e = data.event;

      setForm({
        name: e.event_name,
        blurb: e.blurb,
        description: e.event_description,
        cover_image_url: e.cover_image_url ?? "",
        price: e.price,
        is_per_head: e.is_per_head,
        rules: e.rules,
        event_type: e.event_type,
        is_group: e.is_group,
        max_teamsize: e.max_teamsize,
        min_teamsize: e.min_teamsize,
        total_seats: e.total_seats,
        seats_filled: e.seats_filled,
        event_status: e.event_status,
        event_mode: e.event_mode,
        attendance_mode: "SOLO",
        organizer_ids: [],
        tag_ids: [],
        people_ids: [],
        schedules: e.schedules,
      });

      setLoading(false);
    }

    loadEvent();
  }, [eventId]);

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

  const updateMutation = useMutation({
    mutationFn: async () => {
      const result = createEventSchema.safeParse(form);

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};

        result.error.issues.forEach((err) => {
          const key = err.path[0] as string;
          fieldErrors[key] = err.message;
        });

        setErrors(fieldErrors);
        throw new Error("Validation failed");
      }

      setErrors({});
      return axios.put(api.UPDATE_EVENT(eventId), form);
    },
    onSuccess: () => {
      alert("✅ Event Updated Successfully!");
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });

  if (loading) return <p className="text-center py-8">Loading event...</p>;
  return (
    <div className="space-y-6 bg-background p-4 md:p-6 rounded-xl border  mx-auto w-full">
      <div className="grid gap-2">
        <Label>Event Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      <div className="grid gap-2">
        <Label>Blurb</Label>
        <Textarea
          value={form.blurb}
          onChange={(e) => setForm({ ...form, blurb: e.target.value })}
        />
        {errors.blurb && <p className="text-sm text-red-500">{errors.blurb}</p>}
      </div>
      <div className="grid gap-2">
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label>Cover Image URL</Label>
        <Input
          value={form.cover_image_url}
          onChange={(e) =>
            setForm({ ...form, cover_image_url: e.target.value })
          }
        />
        {errors.cover_image_url && (
          <p className="text-sm text-red-500">{errors.cover_image_url}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label>Rules</Label>
        <Textarea
          value={form.rules}
          onChange={(e) => setForm({ ...form, rules: e.target.value })}
        />
        {errors.rules && <p className="text-sm text-red-500">{errors.rules}</p>}
      </div>
      <div className="grid gap-2">
        <Label>Price</Label>
        <Input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Min Team Size</Label>
          <Input
            type="number"
            value={form.min_teamsize ?? ""}
            onChange={(e) =>
              setForm({ ...form, min_teamsize: Number(e.target.value) })
            }
          />
          {errors.min_teamsize && (
            <p className="text-sm text-red-500">{errors.min_teamsize}</p>
          )}
        </div>
        <div>
          <Label>Max Team Size</Label>
          <Input
            type="number"
            value={form.max_teamsize ?? ""}
            onChange={(e) =>
              setForm({ ...form, max_teamsize: Number(e.target.value) })
            }
          />
          {errors.max_teamsize && (
            <p className="text-sm text-red-500">{errors.max_teamsize}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Total Seats</Label>
          <Input
            type="number"
            value={form.total_seats}
            onChange={(e) =>
              setForm({ ...form, total_seats: Number(e.target.value) })
            }
          />
          {errors.total_seats && (
            <p className="text-sm text-red-500">{errors.total_seats}</p>
          )}
        </div>
        <div>
          <Label>Seats Filled</Label>
          <Input
            type="number"
            value={form.seats_filled}
            onChange={(e) =>
              setForm({ ...form, seats_filled: Number(e.target.value) })
            }
          />
          {errors.seats_filled && (
            <p className="text-sm text-red-500">{errors.seats_filled}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          value={form.event_mode}
          onValueChange={(v) => setForm({ ...form, event_mode: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Event Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ONLINE">Online</SelectItem>
            <SelectItem value="OFFLINE">Offline</SelectItem>
          </SelectContent>
        </Select>
        {errors.event_mode && (
          <p className="text-sm text-red-500">{errors.event_mode}</p>
        )}

        <Select
          value={form.event_status}
          onValueChange={(v) => setForm({ ...form, event_status: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Event Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
        {errors.event_status && (
          <p className="text-sm text-red-500">{errors.event_status}</p>
        )}
      </div>
      <Select
        value={form.attendance_mode}
        onValueChange={(v) => setForm({ ...form, attendance_mode: v })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Attendance Mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SOLO">Solo</SelectItem>
          <SelectItem value="DUO">Team</SelectItem>
        </SelectContent>
      </Select>
      {errors.attendance_mode && (
        <p className="text-sm text-red-500">{errors.attendance_mode}</p>
      )}
      <div className="grid gap-2">
        <Label>Organizers</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between bg-transparent"
            >
              <span className="truncate">
                {form.organizer_ids.length
                  ? organizers
                      .filter((o) => form.organizer_ids.includes(o.id))
                      .map((o) => o.organizer_name)
                      .join(", ")
                  : "Select organizers..."}
              </span>
              <ChevronsUpDown className="ml-2 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search organizers..." />
              <CommandList>
                <CommandEmpty>No organizer found.</CommandEmpty>
                <CommandGroup>
                  {organizers.map((o) => (
                    <CommandItem
                      key={o.id}
                      onSelect={() =>
                        setForm({
                          ...form,
                          organizer_ids: form.organizer_ids.includes(o.id)
                            ? form.organizer_ids.filter((id) => id !== o.id)
                            : [...form.organizer_ids, o.id],
                        })
                      }
                    >
                      <span>{o.organizer_name}</span>
                      {form.organizer_ids.includes(o.id) && (
                        <span className="ml-auto">✔️</span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.organizer_ids && (
          <p className="text-sm text-red-500">{errors.organizer_ids}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label>Tags</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between bg-transparent"
            >
              <span className="truncate">
                {form.tag_ids.length
                  ? tags
                      .filter((t) => form.tag_ids.includes(t.id))
                      .map((t) => t.name)
                      .join(", ")
                  : "Select tags..."}
              </span>
              <ChevronsUpDown className="ml-2 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandList>
                <CommandEmpty>No tag found.</CommandEmpty>
                <CommandGroup>
                  {tags.map((t) => (
                    <CommandItem
                      key={t.id}
                      onSelect={() =>
                        setForm({
                          ...form,
                          tag_ids: form.tag_ids.includes(t.id)
                            ? form.tag_ids.filter((id) => id !== t.id)
                            : [...form.tag_ids, t.id],
                        })
                      }
                    >
                      <span>{t.name}</span>
                      {form.tag_ids.includes(t.id) && (
                        <span className="ml-auto">✔️</span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.tag_ids && (
          <p className="text-sm text-red-500">{errors.tag_ids}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label>People</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between bg-transparent"
            >
              <span className="truncate">
                {form.people_ids.length
                  ? people
                      .filter((p) => form.people_ids.includes(p.id))
                      .map((p) => p.name)
                      .join(", ")
                  : "Select people..."}
              </span>
              <ChevronsUpDown className="ml-2 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search people..." />
              <CommandList>
                <CommandEmpty>No person found.</CommandEmpty>
                <CommandGroup>
                  {people.map((p) => (
                    <CommandItem
                      key={p.id}
                      onSelect={() =>
                        setForm({
                          ...form,
                          people_ids: form.people_ids.includes(p.id)
                            ? form.people_ids.filter((id) => id !== p.id)
                            : [...form.people_ids, p.id],
                        })
                      }
                    >
                      <span>{p.name}</span>
                      {form.people_ids.includes(p.id) && (
                        <span className="ml-auto">✔️</span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.people_ids && (
          <p className="text-sm text-red-500">{errors.people_ids}</p>
        )}
      </div>
      <Button
        onClick={() => updateMutation.mutate()}
        disabled={updateMutation.isPending}
        className="w-fit text-lg"
      >
        {updateMutation.isPending ? "Updating..." : "Update Event"}
      </Button>
    </div>
  );
}
