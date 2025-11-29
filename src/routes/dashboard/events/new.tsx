import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/ui/multi-select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { PlusCircle } from 'lucide-react'
import secureLocalStorage from 'react-secure-storage'

// --- Data Fetching ---
const orgsQueryOptions = queryOptions({
    queryKey: ['orgs'],
    queryFn: async () => {
        const res = await fetch(api.ORGS_URL);
        if (!res.ok) throw new Error('Failed to fetch orgs');
        const data = await res.json();
        return data.DATA.map((item: { organizerID: string; organizerName: string }) => ({
            value: item.organizerID,
            label: item.organizerName,
        }));
    }
});

const tagsQueryOptions = queryOptions({
    queryKey: ['tags'],
    queryFn: async () => {
        const res = await fetch(api.TAGS_URL);
        if (!res.ok) throw new Error('Failed to fetch tags');
        const data = await res.json();
        return data.DATA.map((item: { tagID: string; tagName: string }) => ({
            value: item.tagID,
            label: item.tagName,
        }));
    }
});

export const Route = createFileRoute('/dashboard/events/new')({
    loader: ({ context: { queryClient } }) => {
        queryClient.ensureQueryData(orgsQueryOptions);
        queryClient.ensureQueryData(tagsQueryOptions);
    },
    component: NewEventPage,
})

function NewEventPage() {
    const router = useRouter();
    const { data: orgData } = useSuspenseQuery(orgsQueryOptions);
    const { data: tagData } = useSuspenseQuery(tagsQueryOptions);

    // --- Component State ---
    const [eventName, setEventName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [eventFee, setEventFee] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [venue, setVenue] = useState("");
    const [time, setTime] = useState("");
    const [isGroup, setIsGroup] = useState(false);
    const [maxTeamSize, setMaxTeamSize] = useState("1");
    const [minTeamSize, setMinTeamSize] = useState("1");
    const [eventDate, setEventDate] = useState("");
    const [maxRegistrationsPerDept, setMaxRegistrationsPerDept] = useState("50");
    const [isPerHeadFee, setIsPerHeadFee] = useState(false);
    const [firstPrizeMoney, setFirstPrizeMoney] = useState("");
    const [secondPrizeMoney, setSecondPrizeMoney] = useState("");
    const [thirdPrizeMoney, setThirdPrizeMoney] = useState("");
    const [fourthPrizeMoney, setFourthPrizeMoney] = useState("");
    const [fifthPrizeMoney, setFifthPrizeMoney] = useState("");
    const [rules, setRules] = useState("");
    const [organizerIDs, setOrganizerIDs] = useState<string[]>([]);
    const [tagIDs, setTagIDs] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addNewEvent = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(api.EVENTS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${secureLocalStorage.getItem("t")}`,
                },
                body: JSON.stringify({
                    eventName, imageUrl, videoUrl: null,
                    eventFee: parseInt(eventFee), eventDescription, venue, time, isGroup,
                    maxTeamSize: parseInt(maxTeamSize), minTeamSize: parseInt(minTeamSize),
                    eventDate, maxRegistrationsPerDept: parseInt(maxRegistrationsPerDept),
                    isPerHeadFee, organizerIDs: organizerIDs.map(id => parseInt(id)),
                    tagIDs: tagIDs.map(id => parseInt(id)),
                    firstPrice: firstPrizeMoney || null, secondPrice: secondPrizeMoney || null,
                    thirdPrice: thirdPrizeMoney || null, fourthPrice: fourthPrizeMoney || null,
                    fifthPrice: fifthPrizeMoney || null, rules,
                }),
            });

            if (response.ok) {
                router.navigate({ to: '/dashboard', replace: true });
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.MESSAGE || 'Something went wrong.'}`);
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-semibold mx-4">Create New Event</h1>
            <div className="bg-muted/50 m-4 p-4 rounded-xl flex flex-col gap-4">
                <form className="grid gap-6" onSubmit={e => { e.preventDefault(); addNewEvent(); }}>
                    {/* Event Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="eventName" className="text-lg font-semibold">Event Name</Label>
                        <Input id="eventName" value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Solo Singing" required />
                    </div>

                    {/* isGroup Checkbox */}
                    <div className="flex flex-row items-center gap-2 border rounded-md p-4">
                        <Checkbox id="isGroup" checked={isGroup} onCheckedChange={checked => setIsGroup(!!checked)} />
                        <div className="grid gap-1.5 leading-none">
                            <label htmlFor="isGroup" className="text-lg font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Is this a group event?
                                <p className="text-sm text-muted-foreground font-light">Check this box if this event is a group (team) event.</p>
                            </label>
                        </div>
                    </div>

                    {/* Team Size Inputs (Conditional) */}
                    {isGroup && (
                        <div className="flex flex-row gap-4">
                            <div className="grid gap-2 w-full">
                                <Label htmlFor="minTeamSize" className="text-lg font-semibold">Min Team Size</Label>
                                <Input id="minTeamSize" type="number" value={minTeamSize} onChange={e => setMinTeamSize(e.target.value)} required />
                            </div>
                            <div className="grid gap-2 w-full">
                                <Label htmlFor="maxTeamSize" className="text-lg font-semibold">Max Team Size</Label>
                                <Input id="maxTeamSize" type="number" value={maxTeamSize} onChange={e => setMaxTeamSize(e.target.value)} required />
                            </div>
                        </div>
                    )}

                    {/* Event Date */}
                    <div className="grid gap-2">
                        <Label htmlFor="eventDate" className="text-lg font-semibold">Event Date</Label>
                        <Input id="eventDate" type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
                    </div>

                    {/* Other fields... */}
                    <div className="grid gap-2">
                        <Label htmlFor="time" className="text-lg font-semibold">Timings</Label>
                        <Textarea id="time" value={time} onChange={e => setTime(e.target.value)} placeholder={"Round 1: 10.30 AM - 3.30 PM\nRound 2: 4.30 PM - 8.30 PM"} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="eventDescription" className="text-lg font-semibold">About the event</Label>
                        <Textarea id="eventDescription" value={eventDescription} onChange={e => setEventDescription(e.target.value)} placeholder="Enter about the event" required className="min-h-[120px]" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="rules" className="text-lg font-semibold">Event Rules</Label>
                        <Textarea id="rules" value={rules} onChange={e => setRules(e.target.value)} placeholder="Enter the rules of the event, one per line." className="min-h-[120px]" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="venue" className="text-lg font-semibold">Venue</Label>
                        <Input id="venue" value={venue} onChange={e => setVenue(e.target.value)} placeholder="ASB C101" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="eventFee" className="text-lg font-semibold">Event Fee</Label>
                        <Input id="eventFee" type="number" value={eventFee} onChange={e => setEventFee(e.target.value)} placeholder="100" required />
                    </div>
                    <div className="flex flex-row items-center gap-2 border rounded-md p-4">
                        <Checkbox id="isPerHeadFee" checked={isPerHeadFee} onCheckedChange={checked => setIsPerHeadFee(!!checked)} />
                        <div className="grid gap-1.5 leading-none">
                            <label htmlFor="isPerHeadFee" className="text-lg font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Is the fee per head?
                                <p className="text-sm text-muted-foreground font-light">If not checked, the fee will be charged per team.</p>
                            </label>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="imageUrl" className="text-lg font-semibold">Event Poster URL</Label>
                        <Input id="imageUrl" type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" required />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-lg font-semibold">Event Organizers</Label>
                        <MultiSelect data={orgData} name="organizers" selected={organizerIDs} setSelected={setOrganizerIDs} />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-lg font-semibold">Tags for events</Label>
                        <MultiSelect data={tagData} name="tags" selected={tagIDs} setSelected={setTagIDs} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Event"}
                        {!isSubmitting && <PlusCircle className="ml-2 w-6 h-6" />}
                    </Button>
                </form>
            </div>
        </>
    )
}