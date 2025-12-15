import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, ChevronsUpDown, PlusCircle, AlertCircle } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { axiosClient } from '@/lib/axios';
import { Checkbox } from '../ui/checkbox';
import { z } from 'zod'; 
import { PeopleSchema } from '@/schemas/people';


// Query to fetch all events for the dropdown
const eventQueryOptions = queryOptions({
    queryKey: ['events'],
    queryFn: async () => {
        const response = await axiosClient.get(api.FETCH_ALL_EVENTS);
        return (response.data.events || []).map((event: any) => ({
            label: event.event_name,
            value: event.event_id,
        }));
    }
})

interface NewPersonFormProps {
    onSuccess: () => void;
}

export function NewPersonForm({ onSuccess }: NewPersonFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        profession: "",
        eventId: "",
        eventDay: [] as number[]
    });
    
    const [open, setOpen] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const { data: events } = useSuspenseQuery(eventQueryOptions);
    const days = [1, 2, 3];

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: typeof formData) => {
            const payload = {
                name: data.name,
                email: data.email,
                phone_number: data.phoneNumber,
                profession: data.profession,
                event_id: data.eventId,
                event_day: data.eventDay,
            };

            // Validate before sending
            const validated = PeopleSchema.safeParse(payload);
            if (!validated.success) {
                const messages = validated.error.issues
                    .map(issue => issue.message)
                    .join("; ");
                console.log("Validation failed:", messages);
                throw new Error(messages);
            }
            const response = await axiosClient.post(api.CREATE_PEOPLE, validated.data);
            return response.data;
        },
        onSuccess: () => {
            onSuccess();
        },
        onError: (err: any) => {
            setFormError(err.message || "Failed to create person. Please try again.");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        mutate(formData);
    };

    const updateField = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form className="grid gap-4 pt-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => updateField('name', e.target.value)} 
                    placeholder="e.g., Dr. Arjun Rao" 
                    required 
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => updateField('email', e.target.value)} 
                    placeholder="e.g., arjun@univ.edu" 
                    required 
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input 
                    id="phoneNumber" 
                    type="tel" 
                    value={formData.phoneNumber} 
                    onChange={(e) => updateField('phoneNumber', e.target.value)} 
                    placeholder="e.g., 9000011111" 
                    required 
                />
            </div>
            
            {/* ... Profession Input (similar to above) ... */}
            <div className="grid gap-2">
                <Label htmlFor="profession">Profession / Title</Label>
                <Input 
                    id="profession" 
                    value={formData.profession} 
                    onChange={(e) => updateField('profession', e.target.value)} 
                    placeholder="e.g., Professor" 
                />
            </div>

            {/* Event Selection */}
            <div className="grid gap-2">
                <Label>Associated Event</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="justify-between">
                            {formData.eventId
                                ? events.find((event) => event.value === formData.eventId)?.label
                                : "Select event..."}
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                        <Command>
                            <CommandInput placeholder="Search event..." />
                            <CommandList>
                                <CommandEmpty>No event found.</CommandEmpty>
                                <CommandGroup>
                                    {events.map((event) => (
                                        <CommandItem
                                            key={event.value}
                                            value={event.label} // Command usually filters by label
                                            onSelect={() => {
                                                updateField('eventId', event.value === formData.eventId ? "" : event.value);
                                                setOpen(false);
                                            }}
                                        >
                                            {event.label}
                                            <Check className={cn("ml-auto", event.value === formData.eventId ? "opacity-100" : "opacity-0")} />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Event Day Checkboxes */}
            <div className="grid gap-2">
                <Label>Event Day</Label>
                <div className="flex flex-row gap-4">
                    {days.map(day => (
                        <label key={day} className="flex items-center space-x-2">
                            <Checkbox
                                checked={formData.eventDay.includes(day)}
                                onCheckedChange={() => {
                                    const prev = formData.eventDay;
                                    const newState = prev.includes(day) 
                                        ? prev.filter(d => d !== day) 
                                        : [...prev, day];
                                    updateField('eventDay', newState);
                                }}
                            />
                            <span>Day {day}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Error Message UI */}
            {formError && (
                <div className="text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {formError}
                </div>
            )}

            <Button type="submit" className="w-full mt-2" disabled={isPending}>
                {isPending ? "Creating..." : "Create Person"}
                {!isPending && <PlusCircle className="ml-2 h-4 w-4" />}
            </Button>
        </form>
    );
}