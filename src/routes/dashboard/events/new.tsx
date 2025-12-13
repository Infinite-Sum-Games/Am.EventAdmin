import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/dashboard/events/new')({
  component: RouteComponent,
})
function RouteComponent() {
  return EventEditorPage();
}
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEventEditorStore, type EventData } from "@/stores/useEventEditorStore";
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowRightLeft, Calendar, Check, CheckCircle2, FileText, ImageIcon, Info, Loader2, LogIn, MapPin, Presentation, Save, ScrollText, Tags, Users, Wifi, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import '@mdxeditor/editor/style.css'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function EventEditorPage() {

  const mockData: EventData = {
    attendance_mode: "SOLO",
    event_id: "fd0c3fd9-464b-4187-b6cc-5633968d51e7",
    event_name: "Sample Event",
    blurb: "This is a sample event for demonstration purposes.",
    description: "#Event Description\n\nThis event is designed to showcase the event editor functionality.",
    rules: "1. Be respectful.\n2. Follow the guidelines.",
    poster_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2070&auto=format&fit=crop",
    is_published: true,
    event_type: "EVENT",
    event_status: "ACTIVE",
    is_group: false,
    is_offline: true,
    is_technical: false,
    price: 0,
    pricing_per_head: false,
    seat_count: 100,
    min_teamsize: 1,
    max_teamsize: 1,
    organizers: [
      { id: "org1", name: "Organizer One" },
      { id: "org2", name: "Organizer Two" },
    ],
    people: [
      { id: "person1", name: "Speaker One" },
      { id: "person2", name: "Speaker Two" },
    ],
    tags: [
      { id: "tag1", name: "Technology" },
      { id: "tag2", name: "Workshop" },
    ],
    schedules: [
      {
        id: "schedule1",
        event_date: "2024-10-15",
        start_time: "10:00",
        end_time: "12:00",
        venue: "Main Hall",
      },
      {
        id: "schedule2",
        event_date: "2024-10-16",
        start_time: "14:00",
        end_time: "16:00",
        venue: "Conference Room A",
      },
    ],
    // message from response
    message: "Event draft created successfully.",
  }
  
  const { eventData } = useEventEditorStore();

  if (!eventData) {
    useEventEditorStore.getState().initializeEvent(mockData);
  }

  if (!eventData) return <div className='text-center'>Loading Editor...</div>;

  return (
    <div className="container mx-auto py-10">
      <div className='flex flex-row justify-between'>
        <div className="flex flex-col justify-between">
          <h1 className="text-3xl font-bold">{eventData.event_name}</h1>
          <span className="text-sm text-muted-foreground">ID: {eventData.event_id}</span>
        </div>
        <div>
          <Button variant="outline" className="mr-4">Preview</Button>
          {eventData.is_published ? (
            <Button variant="destructive">Unpublish</Button>
          ) : (
            <Button>Publish</Button>
          )}
        </div>
      </div>
      <Separator className='my-4'/>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full mb-4 grid grid-cols-9 rounded-sm bg-popover h-10">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="seats">Seats</TabsTrigger>
          <TabsTrigger value="modes">Modes/Orgs/Tags</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab data={eventData} />
        </TabsContent>

        <TabsContent value="description">
          <DescriptionTab data={eventData} />
        </TabsContent>

        <TabsContent value="rules">
          <RulesTab data={eventData} />
        </TabsContent>

        <TabsContent value="seats">
          <SeatsTab data={eventData} />
        </TabsContent>

        <TabsContent value="modes">
          <ModesTagsOrgsTab data={eventData} />
        </TabsContent>

        <TabsContent value="pricing">
          <div>Pricing Content</div>
        </TabsContent>

        <TabsContent value="dependencies">
          <div>Dependencies Content</div>
        </TabsContent>

        <TabsContent value="scheduling">
          <div>Scheduling Content</div>
        </TabsContent>

        <TabsContent value="people">
          <div>People Content</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// name, blurb, poster
function GeneralTab({ data }: { data: EventData }) {
  const [inputName, setInputName] = useState(data.event_name);
  const [inputBlurb, setInputBlurb] = useState(data.blurb || "");
  const [inputUrl, setInputUrl] = useState(data.poster_url || "");

  
  // initialize inputUrl on load
  useEffect(() => {
    setInputUrl(data.poster_url || "");
  }, [data.poster_url]);

  // initialize name and blurb on load
  useEffect(() => {
    setInputName(data.event_name);
    setInputBlurb(data.blurb || "");
  }, [data.event_name, data.blurb]);

  const hasNameAndBlurbChanged = inputName !== data.event_name || inputBlurb !== (data.blurb || "");
  const hasImageURLChanged = inputUrl !== (data.poster_url || "");

  const handleApplyUrl = async () => {
    useEventEditorStore.getState().setEventData({ poster_url: inputUrl });
    
    // TODO: Call API to upload/verify URL
    console.log("API CALL: Uploading/Verifying URL:", inputUrl);

    toast.success("Poster URL updated successfully!");
  };

  const handleUpdateNameandBlurb = () => {
    useEventEditorStore.getState().setEventData({ 
      event_name: inputName,
      blurb: inputBlurb,
    });

    // TODO: Call API to update name and blurb
    console.log("API CALL: Updating Name and Blurb:", { event_name: inputName, blurb: inputBlurb });

    toast.success("Updated details successfully!");
  }

  return (
<div className="flex flex-col lg:flex-row gap-6 h-full items-start">

      {/* General Details */}
      <div className="flex-1 flex flex-col gap-6 w-full">
        
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
            <CardDescription>The core information shown on the event card.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">Event Name</Label>
              <Input
                id="event-name"
                placeholder="e.g. Annual Tech Symposium 2024"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-blurb">Short Blurb (Max 120 chars)</Label>
              <Textarea
                id="event-blurb"
                placeholder="A catchy one-liner describing the event..."
                rows={3}
                value={inputBlurb}
                onChange={(e) => setInputBlurb(e.target.value)}
                className="resize-none"
              />
              <p className="text-[0.8rem] text-muted-foreground text-right">
                {inputBlurb.length} chars
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t flex justify-end">
            <Button 
              onClick={handleUpdateNameandBlurb} 
              size="sm"
              disabled={!hasNameAndBlurbChanged}
            >
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Poster URL */}
        <Card>
          <CardHeader>
            <CardTitle>Event Media</CardTitle>
            <CardDescription>Add a poster to make your event stand out.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="event-poster">Poster URL</Label>
              <div className="flex gap-2">
                <Input
                  id="event-poster"
                  type="url"
                  placeholder="https://..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
                <Button 
                  onClick={handleApplyUrl} 
                  variant="default"
                  disabled={!hasImageURLChanged}
                >
                  Apply <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview */}
      <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-2">
        <Label className="text-muted-foreground pl-1">Live Preview</Label>
        
        <div className="relative aspect-2/3 w-full rounded-lg border-2 border-dashed border-muted bg-muted/10 overflow-hidden shadow-sm flex flex-col items-center justify-center transition-all hover:border-muted-foreground/50">
            
            {/* Preview Badge */}
            <div className="absolute top-3 left-3 z-10">
                {hasImageURLChanged && (
                    <Badge variant="secondary" className="shadow-sm backdrop-blur-md bg-background/80">
                        <Info className="mr-1 h-3 w-3 text-blue-500" /> Previewing (Unsaved)
                    </Badge>
                )}
            </div>

            {/* Image Handling */}
            {inputUrl ? (
              <img 
                src={inputUrl} 
                alt="Event Poster Preview" 
                className="object-cover w-full h-full animate-in fade-in duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = ""; 
                  (e.target as HTMLImageElement).alt = "Invalid Image URL";
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground gap-2">
                <div className="rounded-full bg-muted p-4 mb-2">
                   <ImageIcon className="h-8 w-8 opacity-50" />
                </div>
                <p className="text-sm font-medium">No Poster Uploaded</p>
                <p className="text-xs max-w-45">
                  Enter a valid URL to see a preview of your event poster.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

// Lazy Load
const MDXEditorLazy = lazy(() => import("@/components/events/mdx-editor"));

function EditorSkeleton() {
  return (
    <div className="w-full h-125 border rounded-md bg-muted/10 flex flex-col items-center justify-center text-muted-foreground gap-3 animate-pulse">
      <div className="bg-muted h-10 w-full absolute top-0 rounded-t-md opacity-50" />
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="text-sm font-medium">Loading Editor...</span>
    </div>
  )
}

function DescriptionTab({ data }: { data: EventData }) {
  const [inputDescription, setInputDescription] = useState(data.description || "");

  useEffect(() => {
    // Sync external changes only if input is empty (first load)
    if (!inputDescription && data.description) {
      setInputDescription(data.description);
    }
  }, [data.description]);

  const hasDescriptionChanged = inputDescription !== (data.description || "");

  const handleUpdateDescription = () => {
    useEventEditorStore.getState().setEventData({ description: inputDescription });
    console.log("API CALL:", "Updating Description:", inputDescription);
    toast.success("Updated description successfully!");
  }

  return (
    <div className="h-full mx-auto">
      <Card className="h-full flex flex-col border-none shadow-none md:border md:shadow-sm">
        
        <CardHeader className="px-0 md:px-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5" /> Event Description
              </CardTitle>
              <CardDescription>
                Provide a detailed overview of your event. Markdown formatting is supported.
              </CardDescription>
            </div>
            
            {/* Action Button*/}
            <Button 
                onClick={handleUpdateDescription}
                disabled={!hasDescriptionChanged}
                className="flex"
            >
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-0 md:px-6 pb-6">
            {/* Editor Container */}
            <div className="min-h-125">
                <Suspense fallback={<EditorSkeleton />}>
                    <MDXEditorLazy 
                        markdown={inputDescription} 
                        onChange={(newMarkdown) => setInputDescription(newMarkdown || "")}
                    />
                </Suspense>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3 text-right">
                Use headings (#), lists (-), and bold text (**text**) to format your content.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}

// rules
function RulesTab({ data }: { data: EventData }) {
  const [inputRules, setInputRules] = useState(data.rules || "");

  useEffect(() => {
    // Sync external changes only if input is empty (first load)
    if (!inputRules && data.rules) {
      setInputRules(data.rules);
    }
  }, [data.rules]);

  const hasRulesChanged = inputRules !== (data.rules || "");

  const handleUpdateRules = () => {
    useEventEditorStore.getState().setEventData({ rules: inputRules });
    
    console.log("API CALL:", "Updating Rules:", inputRules);
    toast.success("Updated rules successfully!");
  }

  return (
    <div className="h-full mx-auto">
      <Card className="h-full flex flex-col border-none shadow-none md:border md:shadow-sm">
        
        <CardHeader className="px-0 md:px-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 mb-2">
                <ScrollText className="h-5 w-5" /> Event Rules & Guidelines
              </CardTitle>
              <CardDescription>
                Define the rules, judging criteria, and regulations for participants.
              </CardDescription>
            </div>
            
            {/* Action Button */}
            <Button 
                onClick={handleUpdateRules}
                disabled={!hasRulesChanged}
                className="flex"
            >
              <Save className="mr-2 h-4 w-4" /> Save Rules
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-0 md:px-6 pb-6">
            <div className="min-h-125">
                <Suspense fallback={<EditorSkeleton />}>
                    <MDXEditorLazy 
                        markdown={inputRules} 
                        onChange={(newMarkdown) => setInputRules(newMarkdown || "")}
                    />
                </Suspense>
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-right">
                Tip: Use bullet points (-) to make rules easy to scan.
            </p>
        </CardContent>
      </Card>
    </div>
  )
}


function SeatsTab({ data }: { data: EventData }) {
  
  // 1. Handle Toggle Change
  const handleGroupToggle = (value: string) => {
    if (!value) return; 
    
    const isGroup = value === "YES";
    
    useEventEditorStore.getState().setEventData({
      is_group: isGroup,
      // Reset defaults when switching modes
      min_teamsize: isGroup ? 2 : 1,
      max_teamsize: isGroup ? 4 : 1,
    });
  };

  // 2. Auto-Calculate Total Seats for Group Events
  useEffect(() => {
    if (data.is_group) {
      const calculatedSeats = (data.seat_count || 0) * (data.max_teamsize || 1);
      // Only update if different to avoid infinite loops
      if (calculatedSeats !== data.seat_count) {
        useEventEditorStore.getState().setEventData({ seat_count: calculatedSeats });
      }
    }
  }, [data.is_group, data.seat_count, data.max_teamsize, data.seat_count]);

  return (
    <div className="flex flex-col flex-1 border rounded-md p-6 h-full gap-6">
      <div>
        <Label className="block text-sm font-medium mb-2">
          Is this a group event?
        </Label>
        <ToggleGroup 
          type="single" 
          value={data.is_group ? "YES" : "NO"} 
          onValueChange={handleGroupToggle}
        >
          <ToggleGroupItem value="YES">Yes</ToggleGroupItem>
          <ToggleGroupItem value="NO">No</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {data.is_group && (
        <div className="flex flex-row gap-6">
          <div className="flex-1">
            <Label className="block text-sm font-medium mb-2" htmlFor="min-teamsize">
              Minimum Team Size
            </Label>
            <Input
              type="number"
              id="min-teamsize"
              value={data.min_teamsize || 2}
              min={2}
              onChange={(e) => 
                useEventEditorStore.getState().setEventData({ min_teamsize: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="flex-1">
            <Label className="block text-sm font-medium mb-2" htmlFor="max-teamsize">
              Maximum Team Size
            </Label>
            <Input
              type="number"
              id="max-teamsize"
              value={data.max_teamsize || 4}
              min={2}
              onChange={(e) => 
                useEventEditorStore.getState().setEventData({ max_teamsize: parseInt(e.target.value) })
              }
            />
          </div>
        </div>
      )}

      <div>
        <Label className="block text-sm font-medium mb-2" htmlFor="seat-count">
          Total Seats Available
        </Label>
        <Input
          type="number"
          id="seat-count"
          value={data.seat_count || 0}
          min={0}
          onChange={(e) => 
            useEventEditorStore.getState().setEventData({ seat_count: parseInt(e.target.value) })
          }
        />
      </div>
    </div>
  )
}


function SettingRow({ 
  label, 
  description, 
  children 
}: { 
  label: string; 
  description?: string; 
  children: React.ReactNode 
}) {
  return (
    <div className="flex flex-row items-center justify-between py-4">
      <div className="space-y-0.5">
        <Label className="text-base font-medium">{label}</Label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function ModesTagsOrgsTab({ data }: { data: EventData }) { 
  return (
    <div className="flex flex-col gap-6">
      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>Event Configuration</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          
          {/* Event Type */}
          <SettingRow 
            label="Event Type" 
            description="Is this a workshop or a general event?"
          >
            <ToggleGroup 
              type="single" 
              variant="outline"
              value={data.event_type} 
              onValueChange={(value) => {
                if (!value) return;
                useEventEditorStore.getState().setEventData({ event_type: value as "EVENT" | "WORKSHOP" });
              }}
            >
              <ToggleGroupItem value="EVENT" aria-label="Event">
                <Calendar className="mr-2 h-4 w-4" /> Event
              </ToggleGroupItem>
              <ToggleGroupItem value="WORKSHOP" aria-label="Workshop">
                <Presentation className="mr-2 h-4 w-4" /> Workshop
              </ToggleGroupItem>
            </ToggleGroup>
          </SettingRow>

          <Separator />

          {/* Event Mode */}
          <SettingRow 
            label="Location Mode" 
            description="Is this event held online or offline?"
          >
            <ToggleGroup 
              type="single" 
              variant="outline"
              value={data.is_offline ? "OFFLINE" : "ONLINE"}
              onValueChange={(value) => {
                if (!value) return;
                useEventEditorStore.getState().setEventData({ is_offline: value === "OFFLINE" });
              }}
            >
              <ToggleGroupItem value="OFFLINE">
                <MapPin className="mr-2 h-4 w-4" /> Offline
              </ToggleGroupItem>
              <ToggleGroupItem value="ONLINE">
                <Wifi className="mr-2 h-4 w-4" /> Online
              </ToggleGroupItem>
            </ToggleGroup>
          </SettingRow>

          <Separator />

          {/* Attendance Mode */}
          <SettingRow 
            label="Attendance Tracking" 
            description="How should participants mark their presence?"
          >
            <ToggleGroup 
              type="single" 
              variant="outline"
              value={data.attendance_mode}
              onValueChange={(value) => {
                if (!value) return;
                useEventEditorStore.getState().setEventData({ attendance_mode: value as "SOLO" | "DUO" });
              }}
            >
              <ToggleGroupItem value="SOLO" title="Scan once to attend">
                <LogIn className="mr-2 h-4 w-4" /> Check-in Only
              </ToggleGroupItem>
              <ToggleGroupItem value="DUO" title="Scan start and end">
                <ArrowRightLeft className="mr-2 h-4 w-4" /> In & Out
              </ToggleGroupItem>
            </ToggleGroup>
          </SettingRow>

          <Separator />

          {/* Completion Status */}
          <SettingRow 
            label="Mark as Completed" 
            description="Has this event finished?"
          >
            <ToggleGroup 
              type="single" 
              variant="outline"
              value={data.event_status === "COMPLETED" ? "YES" : "NO"}
              onValueChange={(value) => {
                useEventEditorStore.getState().setEventData({ 
                    event_status: value === "YES" ? "COMPLETED" : "ACTIVE" 
                });
              }}
              disabled={data.event_status === "CLOSED"}
            >
              <ToggleGroupItem value="NO">
                <XCircle className="mr-2 h-4 w-4" /> No
              </ToggleGroupItem>
              <ToggleGroupItem value="YES" className="data-[state=on]:bg-green-100 data-[state=on]:text-green-900 dark:data-[state=on]:bg-green-900/30 dark:data-[state=on]:text-green-300">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Completed
              </ToggleGroupItem>
            </ToggleGroup>
          </SettingRow>

        </CardContent>
      </Card>

      {/* 2. Organizers & Tags */}
      <div className="grid grid-cols-2 gap-6">
        {/* Organizers Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Organizers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground border-2 border-dashed rounded-lg p-8 flex items-center justify-center">
                Add Organizer Content
            </div>
          </CardContent>
        </Card>

        {/* Tags Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Tags className="h-5 w-5" /> Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground border-2 border-dashed rounded-lg p-8 flex items-center justify-center">
                Add Tags Content
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}