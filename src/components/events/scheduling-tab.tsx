import { useEffect, useState } from "react";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Trash2,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type EventData, type schedules } from "@/stores/useEventEditorStore";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { axiosClient } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { eventScheduleSchema, type EventSchedules } from "@/schemas/event";
import { ErrorMessage } from "./error-message";
import { buildTimestamp, formatTime, formatTimeWithAMPM } from "@/utils/temporal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "../ui/alert-dialog";


// Map specific dates to Day Labels for easy lookup
const EVENT_DAYS: Record<string, { label: string; shortDate: string }> = {
  "2026-01-07": { label: "1", shortDate: "Jan 7" },
  "2026-01-08": { label: "2", shortDate: "Jan 8" },
  "2026-01-09": { label: "3", shortDate: "Jan 9" },
};

function SchedulingTab({ data }: { data: EventData }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [inputEventDate, setInputEventDate] = useState("");
  const [inputStartTime, setInputStartTime] = useState("");
  const [inputEndTime, setInputEndTime] = useState("");
  const [inputVenue, setInputVenue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const schedules = data.schedules || [];
  useEffect(() => {
    if (!isDialogOpen) {
      setEditingId(null);
      setInputEventDate("");
      setInputStartTime("");
      setInputEndTime("");
      setInputVenue("");
      setErrorMsg("");
    }
  }, [schedules, isDialogOpen]);

  const queryClient = useQueryClient();

  const handleOpenAdd = () => {
    setEditingId(null);
    setInputEventDate("");
    setInputStartTime("");
    setInputEndTime("");
    setInputVenue("");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (schedule: schedules) => {
    setEditingId(schedule.id || null);
    setInputEventDate(schedule.event_date || "");
    setInputStartTime(formatTime(schedule.start_time) === "--" ? "" : formatTime(schedule.start_time));
    setInputEndTime(formatTime(schedule.end_time) === "--" ? "" : formatTime(schedule.end_time));
    setInputVenue(schedule.venue || "");
    setIsDialogOpen(true);
  };

  // mutation to add schedule
  const { mutate: addSchedule, isPending: addSchedulePending, error: addScheduleError } = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: EventSchedules }) => {
      // zod validation
      const validatedData = eventScheduleSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map(err => err.message).join("\n");
        throw new Error(errorMessages);
      }
      const response = await axiosClient.post(api.ADD_EVENT_SCHEDULE(id), validatedData.data);
      return response.data;
    },
    onSuccess: (newSchedule) => {
      queryClient.setQueryData(['event', data.id], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          schedules: [...(oldData.schedules || []), newSchedule]
        };
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Schedule added successfully.");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to add schedule.");
    }
  })

  // mutation to edit schedule
  const { mutate: editSchedule } = useMutation({
    mutationFn: async (payload: EventSchedules) => {
      const validatedData = eventScheduleSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map(err => err.message).join("\n");
        throw new Error(errorMessages);
      }
      const response = await axiosClient.put(api.UPDATE_EVENT_SCHEDULE(payload.id!), validatedData.data);
      return response.data;
    },
    onSuccess: (updatedSchedule) => {
      queryClient.setQueryData(['event', data.id], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          schedules: oldData.schedules.map((schedule: schedules) =>
            schedule.id === updatedSchedule.id ? updatedSchedule : schedule
          )
        };
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Schedule updated successfully.");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to update schedule.");
    }
  })

  // mutation to delete schedule
  const { mutate: deleteSchedule } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(api.DELETE_EVENT_SCHEDULE(id));
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(['event', data.id], (oldData: any) => {
        return {
          ...oldData,
          schedules: oldData.schedules.filter((schedule: schedules) => schedule.id !== id)
        };
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Schedule deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete schedule.");
    },
  })

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleExecuteDelete = () => {
    if (deleteId) {
      deleteSchedule(deleteId);
    }
    setIsConfirmDeleteOpen(false);
    setDeleteId(null);
  };

  const handleSave = () => {
    if (!inputEventDate) {
      setErrorMsg("Please select an event day.");
      return;
    }
    if (!inputStartTime) {
      setErrorMsg("Please enter a start time.");
      return;
    }
    if (!inputEndTime) {
      setErrorMsg("Please enter an end time.");
      return;
    }
    if (!inputVenue) {
      setErrorMsg("Please enter a venue.");
      return;
    }
    
    // REMOVED THE EXTRA 'return;' AND '}' HERE

    const eventDateISO = buildTimestamp(inputEventDate, "00:00");
    const startTimeISO = buildTimestamp(inputEventDate, inputStartTime);
    const endTimeISO = buildTimestamp(inputEventDate, inputEndTime);

    const payload: EventSchedules = {
      event_date: eventDateISO,
      start_time: startTimeISO,
      end_time: endTimeISO,
      venue: inputVenue,
    };

    if (editingId) {
      payload.id = editingId;
      editSchedule(payload);
      setEditingId(null);
      return;
    } else {
      addSchedule({ id: data.id, payload });
    }
  };

  return (
    <div className="h-full mx-auto space-y-6">

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" /> Event Schedule
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage dates, times, and venues for your event sessions.
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Schedule
        </Button>
      </div>

      {/* Schedules List */}
      <div className="grid gap-4">
        {schedules.length === 0 ? (
          <Card className="border-none">
            <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
              <CalendarIcon className="h-10 w-10 opacity-20" />
              <p className="font-medium">No schedules added yet.</p>
              <p className="text-sm">Click the button above to set a date and venue.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {schedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onEdit={() => handleOpenEdit(schedule)}
                onDelete={() => handleDelete(schedule.id!)}
              />
            ))}

            <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this schedule? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleExecuteDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-popover">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Schedule" : "Add Schedule"}</DialogTitle>
            <DialogDescription>
              Set the timing and location details for this session.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Custom Day Selector */}
            <div className="space-y-2">
              <Label>Event Day</Label>
              <ToggleGroup
                type="single"
                variant="outline"
                className="w-full"
                value={inputEventDate}
                onValueChange={(value) => {
                  if (value) setInputEventDate(value);
                }}
              >
                {Object.entries(EVENT_DAYS).map(([dateValue, info]) => (
                  <ToggleGroupItem
                    key={dateValue}
                    value={dateValue}
                    className="flex-1 flex-col h-fit py-2 "
                  >
                    <span className="font-semibold">Day {info.label}</span>
                    <span className="text-[10px] text-muted-foreground">{info.shortDate}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Time Row */}
            <div className="grid grid-cols-2 gap-4 my-2">
              <div className="grid gap-2">
                <Label htmlFor="start" className="text-sm">Start Time</Label>
                <Input
                  id="start"
                  type="time"
                  value={inputStartTime}
                  onChange={(e) => setInputStartTime(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end" className="text-sm">End Time</Label>
                <Input
                  id="end"
                  type="time"
                  value={inputEndTime}
                  onChange={(e) => setInputEndTime(e.target.value)}
                />
              </div>
            </div>

            {/* Venue */}
            <div className="grid gap-2">
              <Label htmlFor="venue">Venue / Location</Label>
              <div className="relative">
                <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="venue"
                  placeholder="e.g. Main Auditorium"
                  className="pl-8"
                  value={inputVenue}
                  onChange={(e) => setInputVenue(e.target.value)}
                />
              </div>
            </div>
            <ErrorMessage
              title="Invalid Input"
              message={addScheduleError?.message}
            />
            <ErrorMessage
              title="Missing Fields"
              message={errorMsg}
            />

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={addSchedulePending}>{editingId ? "Save Changes" : "Add Schedule"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


function ScheduleCard({
  schedule,
  onEdit,
  onDelete
}: {
  schedule: schedules;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const rawDate = schedule.event_date ?? "";
  const normalizedDate = rawDate.split('T')[0];

  const dayInfo = EVENT_DAYS[normalizedDate] || { label: "?", shortDate: normalizedDate };

  return (
    <Card className="hover:bg-muted/30 transition-colors">
      <CardContent className="flex items-center ">

        {/* Day Block */}
        <div className="flex flex-col items-center justify-center border rounded-lg w-16 h-16 bg-muted/30 mr-4 shrink-0 shadow-sm">
          <span className="text-[10px] font-medium text-muted-foreground uppercase">
            Day
          </span>
          <span className="text-2xl font-bold text-primary">
            {dayInfo.label}
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 grid gap-1">
          <div className="flex items-center text-sm font-medium">
            <Clock className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            {formatTimeWithAMPM(schedule.start_time)} - {formatTimeWithAMPM(schedule.end_time)}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-3.5 w-3.5" />
            {schedule.venue}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center space-x-2">
          <Button variant="default" onClick={onEdit}>
            <Edit3 className="h-4 w-4" />
            <span className="">Edit</span>
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="">Delete</span>
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}

export { SchedulingTab };