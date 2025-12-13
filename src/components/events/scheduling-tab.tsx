import { useState } from "react";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Pencil, 
  Trash2, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
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
import { useEventEditorStore, type EventData, type schedules } from "@/stores/useEventEditorStore"; 
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


// Map specific dates to Day Labels for easy lookup
const EVENT_DAYS: Record<string, { label: string; shortDate: string }> = {
  "2026-01-07": { label: "1", shortDate: "Jan 7" },
  "2026-01-08": { label: "2", shortDate: "Jan 8" },
  "2026-01-09": { label: "3", shortDate: "Jan 9" },
};

function SchedulingTab({ data }: { data: EventData }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  

  const [formData, setFormData] = useState<schedules>({
    event_date: "",
    start_time: "",
    end_time: "",
    venue: ""
  });

  const schedules = (data.schedules || []) as schedules[];

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ event_date: "", start_time: "", end_time: "", venue: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (schedule: schedules) => {
    setEditingId(schedule.id || null);
    setFormData({ ...schedule });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedSchedules = schedules.filter(s => s.id !== id);
    useEventEditorStore.getState().setEventData({ schedules: updatedSchedules });
    toast.success("Schedule removed");
  };

  const handleSave = () => {
    // Basic Validation
    // TODO: add zod schema validation
    if (!formData.event_date || !formData.start_time || !formData.end_time || !formData.venue) {
      toast.error("Please fill in all fields");
      return;
    }

    let updatedSchedules = [...schedules];

    if (editingId) {
      // Update existing
      updatedSchedules = updatedSchedules.map(s => 
        s.id === editingId ? { ...formData, id: editingId } : s
      );
      toast.success("Schedule updated");
    } else {
      // Create new (Generate temporary ID for UI)
      const newSchedule = { ...formData}; 
      updatedSchedules.push(newSchedule);
      toast.success("Schedule added");
    }

    // Sort chronologically
    updatedSchedules.sort((a, b) => {
      const dateA = new Date(`${a.event_date}T${a.start_time}`);
      const dateB = new Date(`${b.event_date}T${b.start_time}`);
      return dateA.getTime() - dateB.getTime();
    });

    useEventEditorStore.getState().setEventData({ schedules: updatedSchedules });
    setIsDialogOpen(false);
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
           // Empty State
           <Card className="border-dashed">
             <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
               <CalendarIcon className="h-10 w-10 opacity-20" />
               <p className="font-medium">No schedules added yet.</p>
               <p className="text-sm">Click the button above to set a date and venue.</p>
             </CardContent>
           </Card>
        ) : (
            schedules.map((schedule) => (
                <ScheduleCard 
                    key={schedule.id} 
                    schedule={schedule} 
                    onEdit={() => handleOpenEdit(schedule)}
                    onDelete={() => handleDelete(schedule.id!)}
                />
            ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
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
                value={formData.event_date}
                onValueChange={(value) => {
                  if(value) setFormData({...formData, event_date: value})
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
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="start">Start Time</Label>
                    <Input 
                        id="start" 
                        type="time" 
                        value={formData.start_time}
                        onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="end">End Time</Label>
                    <Input 
                        id="end" 
                        type="time" 
                        value={formData.end_time}
                        onChange={(e) => setFormData({...formData, end_time: e.target.value})}
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
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                />
              </div>
            </div>

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? "Save Changes" : "Add Schedule"}</Button>
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
    // Lookup the "Day X" label based on the date string
    const dayInfo = EVENT_DAYS[schedule.event_date] || { label: "Day ?", shortDate: schedule.event_date };

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
                        {schedule.start_time} - {schedule.end_time}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-3.5 w-3.5" />
                        {schedule.venue}
                    </div>
                </div>

                {/* Actions Menu */} 
                <div className="flex items-center space-x-2">
                    <Button variant="secondary" size="icon" onClick={onEdit}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={onDelete}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>

            </CardContent>
        </Card>
    )
}

export { SchedulingTab };