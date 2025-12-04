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
import { ChevronsUpDown } from "lucide-react";
import secureLocalStorage from "react-secure-storage";

/* ---------------- TYPES ---------------- */

type Organizer = { id: string; organizer_name: string };
type Tag = { id: string; name: string };
type Person = { id: string; name: string };

type CreateEventFormState = {
  name: string;
  blurb: string;
  description: string;
  cover_image_url: string;
  rules: string;
  price: number;
  is_per_head: boolean;
  is_group: boolean;
  min_teamsize: number | null;
  max_teamsize: number | null;
  total_seats: number;
  event_status: "ACTIVE" | "INACTIVE";
  event_mode: "ONLINE" | "OFFLINE";
  attendance_mode: "SOLO" | "TEAM";
  organizer_ids: string[];
  tag_ids: string[];
  people_ids: string[];
};

/* ---------------- DEFAULT FORM ---------------- */

const EMPTY_CREATE_FORM: CreateEventFormState = {
  name: "",
  blurb: "",
  description: "",
  cover_image_url: "",
  rules: "",
  price: 0,
  is_per_head: false,
  is_group: false,
  min_teamsize: null,
  max_teamsize: null,
  total_seats: 0,
  event_status: "ACTIVE",
  event_mode: "OFFLINE",
  attendance_mode: "SOLO",
  organizer_ids: [],
  tag_ids: [],
  people_ids: [],
};

/* ---------------- ROUTE ---------------- */

export const Route = createFileRoute("/dashboard/events/new")({
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

  /* ---------------- CREATE MUTATION ---------------- */

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

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6 bg-background p-4 md:p-6 rounded-xl border mx-auto w-full">
      <div className="grid gap-2">
        <Label>Event Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label>Blurb</Label>
        <Textarea
          value={form.blurb}
          onChange={(e) => setForm({ ...form, blurb: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label>Cover Image URL</Label>
        <Input
          value={form.cover_image_url}
          onChange={(e) =>
            setForm({ ...form, cover_image_url: e.target.value })
          }
        />
      </div>

      <div className="grid gap-2">
        <Label>Rules</Label>
        <Textarea
          value={form.rules}
          onChange={(e) => setForm({ ...form, rules: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label>Price</Label>
        <Input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
      </div>

      {/* TEAM SIZE */}
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
        </div>
      </div>

      {/* EVENT MODE */}
      <Select
        value={form.event_mode}
        onValueChange={(v) => setForm({ ...form, event_mode: v as any })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Event Mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ONLINE">Online</SelectItem>
          <SelectItem value="OFFLINE">Offline</SelectItem>
        </SelectContent>
      </Select>

      {/* EVENT STATUS */}
      <Select
        value={form.event_status}
        onValueChange={(v) => setForm({ ...form, event_status: v as any })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Event Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="INACTIVE">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {/* ATTENDANCE MODE */}
      <Select
        value={form.attendance_mode}
        onValueChange={(v) => setForm({ ...form, attendance_mode: v as any })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Attendance Mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SOLO">Solo</SelectItem>
          <SelectItem value="TEAM">Team</SelectItem>
        </SelectContent>
      </Select>

      {/* ---------------- ORGANIZERS ---------------- */}
      <MultiSelectBlock
        label="Organizers"
        items={organizers}
        selected={form.organizer_ids}
        onChange={(ids) => setForm({ ...form, organizer_ids: ids })}
        getLabel={(o) => o.organizer_name}
      />

      {/* ---------------- TAGS ---------------- */}
      <MultiSelectBlock
        label="Tags"
        items={tags}
        selected={form.tag_ids}
        onChange={(ids) => setForm({ ...form, tag_ids: ids })}
        getLabel={(t) => t.name}
      />

      {/* ---------------- PEOPLE ---------------- */}
      <MultiSelectBlock
        label="People"
        items={people}
        selected={form.people_ids}
        onChange={(ids) => setForm({ ...form, people_ids: ids })}
        getLabel={(p) => p.name}
      />

      <Button onClick={() => createMutation.mutate()} className="w-fit text-lg">
        Create Event
      </Button>
    </div>
  );
}

/* ---------------- REUSABLE MULTISELECT ---------------- */

function MultiSelectBlock<T extends { id: string }>({
  label,
  items,
  selected,
  onChange,
  getLabel,
}: {
  label: string;
  items: T[];
  selected: string[];
  onChange: (ids: string[]) => void;
  getLabel: (item: T) => string;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between bg-transparent"
          >
            <span className="truncate">
              {selected.length
                ? items
                    .filter((i) => selected.includes(i.id))
                    .map(getLabel)
                    .join(", ")
                : `Select ${label.toLowerCase()}...`}
            </span>
            <ChevronsUpDown className="ml-2 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No item found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() =>
                      onChange(
                        selected.includes(item.id)
                          ? selected.filter((id) => id !== item.id)
                          : [...selected, item.id]
                      )
                    }
                  >
                    <span>{getLabel(item)}</span>
                    {selected.includes(item.id) && (
                      <span className="ml-auto">✔️</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
