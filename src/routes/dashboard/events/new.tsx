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
import { Armchair, ArrowRight, ArrowRightLeft, Calendar, Check, CheckCircle2, FileText, ImageIcon, IndianRupee, Info, Loader2, LogIn, MapPin, Presentation, Save, ScrollText, Tag, User, Users, Wifi, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import '@mdxeditor/editor/style.css'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { OrganizersCard } from '@/components/events/organiser-card';
import { TagsCard } from '@/components/events/tag-card';
import { SchedulingTab } from '@/components/events/scheduling-tab';
import { PeopleCard } from '@/components/events/people-card';
import { Switch } from '@/components/ui/switch';

export function EventEditorPage() {
  const mockData: EventData = {
    attendance_mode: "SOLO",
    id: "fd0c3fd9-464b-4187-b6cc-5633968d51e7",
    name: "Sample Event",
    blurb: "This is a sample event for demonstration purposes.",
    description: "#Event Description\n\nThis event is designed to showcase the event editor functionality.",
    rules: "1. Be respectful.\n2. Follow the guidelines.",
    poster_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2070&auto=format&fit=crop",
    is_published: true,
    event_type: "EVENT",
    event_status: "ACTIVE",
    is_group: true,
    is_offline: true,
    is_technical: false,
    price: 0,
    is_per_head: false,
    seat_count: 40,
    min_teamsize: 2,
    max_teamsize: 4,
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
          <h1 className="text-3xl font-bold">{eventData.name}</h1>
          <span className="text-sm text-muted-foreground">ID: {eventData.id}</span>
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
        <TabsList className="w-full mb-4 grid grid-cols-6 rounded-sm bg-popover h-10">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="seats">Seats</TabsTrigger>
          <TabsTrigger value="modes">Metadata</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
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

        <TabsContent value="scheduling">
          <SchedulingTab data={eventData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// name, blurb, poster
function GeneralTab({ data }: { data: EventData }) {
  const [inputName, setInputName] = useState(data.name);
  const [inputBlurb, setInputBlurb] = useState(data.blurb || "");
  const [inputUrl, setInputUrl] = useState(data.poster_url || "");
  const [inputPrice, setInputPrice] = useState(data.price || 0);
  const [inputIsPerHead, setInputIsPerHead] = useState(data.is_per_head || false);
  
  // Sync state on load
  useEffect(() => {
    setInputUrl(data.poster_url || "");
    setInputName(data.name);
    setInputBlurb(data.blurb || "");
    setInputPrice(data.price || 0);
    setInputIsPerHead(data.is_per_head || false);
  }, [data]);

  const hasDetailsChanged = inputName !== data.name || inputBlurb !== (data.blurb || "") || inputPrice !== data.price || inputIsPerHead !== data.is_per_head;
  const hasImageURLChanged = inputUrl !== (data.poster_url || "");

  const handleApplyUrl = async () => {
    useEventEditorStore.getState().setEventData({ poster_url: inputUrl });
    console.log("API CALL: Uploading/Verifying URL:", inputUrl);
    toast.success("Poster URL updated successfully!");
  };

  const handleUpdateDetails = () => {
    useEventEditorStore.getState().setEventData({ 
      name: inputName,
      blurb: inputBlurb,
      price: inputPrice,
      is_per_head: inputIsPerHead,
    });
    console.log("API CALL: Updating Details", { name: inputName, blurb: inputBlurb, price: inputPrice, is_per_head: inputIsPerHead });
    toast.success("Updated details successfully!");
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full items-start">

      {/* General Details */}
      <div className="flex-1 flex flex-col gap-6 w-full">
        <Card className="border-none shadow-sm">
          <div className="flex flex-row items-center justify-between px-6">
            <CardHeader className='p-0 m-0 flex-1 flex-col'>
              <CardTitle className="text-base">Basic Details</CardTitle>
              <CardDescription>The core information shown on the event card.</CardDescription>
            </CardHeader>
          <Button 
              onClick={handleUpdateDetails} 
              size="sm"
              disabled={!hasDetailsChanged}
            >
              <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
          </div>
          <CardContent className="space-y-4">
            
            {/* Name & Blurb Section */}
            <div className="space-y-4">
                <div className="space-y-3">
                <Label htmlFor="event-name">Event Name</Label>
                <Input
                    id="event-name"
                    placeholder="e.g. Annual Tech Symposium 2024"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="font-medium"
                />
                </div>

                <div className="space-y-3">
                <Label htmlFor="event-blurb">Short Blurb <span className="text-muted-foreground font-normal">(Max 120 chars)</span></Label>
                <Textarea
                    id="event-blurb"
                    placeholder="A catchy one-liner describing the event..."
                    rows={3}
                    maxLength={120}
                    value={inputBlurb}
                    onChange={(e) => setInputBlurb(e.target.value)}
                    className="resize-none"
                />
                <p className="text-[0.8rem] text-muted-foreground text-right">
                    {inputBlurb.length}/120
                </p>
                </div>
            </div>

            <Separator />

            {/* Pricing Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">Pricing Configuration</h3>
                </div>
                
                <div className="flex flex-row gap-6">
                    {/* Price Input */}
                    <div className="flex-1 space-y-3">
                        <Label htmlFor="event-price">Ticket Price</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="event-price"
                                type="number"
                                placeholder="0"
                                min={0}
                                value={inputPrice}
                                onChange={(e) => setInputPrice(parseInt(e.target.value, 10))}
                                className="pl-8 font-mono"
                            />
                        </div>
                        <p className="text-[0.8rem] text-muted-foreground">
                            Set to 0 for free events.
                        </p>
                    </div>

                    {/* Fee Structure Toggle Group */}
                    <div className="space-y-3">
                         <Label>Fee Structure</Label>
                         <ToggleGroup 
                            type="single" 
                            variant="outline"
                            className="justify-start"
                            value={inputIsPerHead ? "PER_HEAD" : "PER_TEAM"}
                            onValueChange={(value) => {
                                if (!value) return; // Prevent unselecting
                                if (value === "PER_HEAD" && data.is_group){
                                  toast.error("Per Person pricing is not allowed for Group Events.");
                                  return;
                                }
                                if (value === "FIXED" && !data.is_group) {
                                    toast.error("Fixed pricing is not allowed for Individual Events.");
                                    return;
                                }
                                setInputIsPerHead(value === "PER_HEAD");
                            }}
                         >
                             <ToggleGroupItem value="PER_HEAD" className="flex-1">
                                <User className="mr-2 h-4 w-4" /> Per Person
                             </ToggleGroupItem>
                              <ToggleGroupItem value="PER_TEAM" className="flex-1">
                                <Users className="mr-2 h-4 w-4" />Per Team
                             </ToggleGroupItem>
                         </ToggleGroup>
                         <p className="text-[0.8rem] text-muted-foreground">
                            {inputIsPerHead 
                                ? "Ticket price is calculated per person." 
                                : "Ticket price is fixed per team/group."}
                        </p>
                    </div>
                </div>
            </div>

          </CardContent>
        </Card>

        {/* Poster URL */}
        <Card className="border-none">
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
                  variant="secondary"
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

// is group, team sizes, seats
function SeatsTab({ data }: { data: EventData }) { 
  const [inputIsGroup, setInputIsGroup] = useState(data.is_group);
  const [inputMinTeamSize, setInputMinTeamSize] = useState(data.min_teamsize);
  const [inputMaxTeamSize, setInputMaxTeamSize] = useState(data.max_teamsize);
  const [inputMaxNoOfTeams, setInputMaxNoOfTeams] = useState(0);
  const [inputTotalSeats, setInputTotalSeats] = useState(data.seat_count);
  
  useEffect(() => {
    setInputIsGroup(data.is_group);
    setInputMinTeamSize(data.min_teamsize);
    setInputMaxTeamSize(data.max_teamsize);
    setInputMaxNoOfTeams(data.is_group ? data.seat_count : 0);
    setInputTotalSeats(data.seat_count);
  }, [data.is_group, data.min_teamsize, data.max_teamsize, data.seat_count]);

  const hadSeatsChanged = inputIsGroup !== data.is_group || 
    (inputIsGroup && (inputMinTeamSize !== data.min_teamsize || inputMaxTeamSize !== data.max_teamsize || inputMaxNoOfTeams !== data.seat_count)) ||
    (!inputIsGroup && inputTotalSeats !== data.seat_count);

  const handleUpdateSeats = () => {
    if (inputIsGroup) {
      useEventEditorStore.getState().setEventData({
        is_group: true,
        min_teamsize: inputMinTeamSize,
        max_teamsize: inputMaxTeamSize,
        seat_count: inputMaxNoOfTeams,
      });
    } else {
      useEventEditorStore.getState().setEventData({
        is_group: false,
        seat_count: inputTotalSeats,
      });
    }

    console.log("API CALL:", "Updating Seats for", inputIsGroup ? "Group Event" : "Individual Event");
    toast.success("Updated seating successfully!");
  }

  return (
    <div className="h-full mx-auto">
      <Card className="h-full flex flex-col border-none shadow-none md:border md:shadow-sm">
        
        {/* Header */}
        <CardHeader className="px-0 md:px-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Armchair className="h-5 w-5" /> Seat & Participation
              </CardTitle>
              <CardDescription>
                Configure seating and registration options for your event.
              </CardDescription>
            </div>
            {/* Action Button */}
            <Button 
                disabled={!hadSeatsChanged} 
                onClick={handleUpdateSeats}
                className="flex"
            >
              <Save className="mr-2 h-4 w-4" /> Update Seats
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-0 md:px-6 pb-6 space-y-6">
          
          {/* 1. Participation Mode Toggle */}
          <div className="bg-muted/30 p-4 rounded-lg border">
            <SettingRow
              label="Participation Mode"
              description="How do users register for this event?"
            >
              <ToggleGroup 
                type="single" 
                variant="outline"
                className="justify-start sm:justify-end"
                value={inputIsGroup ? "YES" : "NO"}
                onValueChange={(value) => {
                  if (!value) return;
                  setInputIsGroup(value === "YES");
                  if(value === "YES") {
                      setInputMinTeamSize(1);
                      setInputMaxTeamSize(1);
                      setInputMaxNoOfTeams(1);
                  } else {
                      setInputTotalSeats(0);
                  }
                }}
              >
                <ToggleGroupItem value="NO" className="flex-1 sm:flex-none">
                  <User className="mr-2 h-4 w-4" /> Individual
                </ToggleGroupItem>
                <ToggleGroupItem value="YES" className="flex-1 sm:flex-none">
                  <Users className="mr-2 h-4 w-4" /> Team / Group
                </ToggleGroupItem>
              </ToggleGroup>
            </SettingRow>
          </div>

          <Separator />

          {/* 2. Logic Section */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            {inputIsGroup ? (
              <div className="space-y-6">
                
                {/* Team Size + Registration Limit */}
                <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Left Side: Team Size Logic */}
                    <div className="flex-1 space-y-2">
                        <Label className="text-base font-medium">Team Size Constraints</Label>
                        <div className="flex items-end gap-3">
                            <div className="space-y-1.5 flex-1">
                                <Label htmlFor="min-size" className="text-xs text-muted-foreground">Minimum</Label>
                                <Input
                                    id="min-size"
                                    type="number"
                                    value={inputMinTeamSize}
                                    max={inputMaxTeamSize}
                                    min="1"
                                    className="text-center"
                                    onChange={(e) => setInputMinTeamSize(parseInt(e.target.value, 10) || 1)}
                                />
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground mb-3" />
                            <div className="space-y-1.5 flex-1">
                                <Label htmlFor="max-size" className="text-xs text-muted-foreground">Maximum</Label>
                                <Input
                                    id="max-size"
                                    type="number"
                                    value={inputMaxTeamSize}
                                    max="10"
                                    min="1"
                                    className="text-center"
                                    onChange={(e) => setInputMaxTeamSize(parseInt(e.target.value, 10) || 1)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-px bg-border self-stretch mx-2" />

                    {/* Registration Limit */}
                    <div className="flex-1 space-y-2">
                         <Label className="text-base font-medium">Registration Limit</Label>
                         <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="max-teams" className="text-xs text-muted-foreground">Max Teams Allowed</Label>
                            <Input
                                id="max-teams"
                                type="number"
                                value={inputMaxNoOfTeams}
                                min="1"
                                onChange={(e) => setInputMaxNoOfTeams(parseInt(e.target.value, 10) || 1)}
                            />
                         </div>
                    </div>
                </div>

                <Separator className="my-2" />

                {/* Estimated Capacity */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-medium">
                                <Info className="h-4 w-4" /> Estimated Total Capacity
                            </div>
                            <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                                This is the theoretical maximum number of people attending if every team is full.
                            </p>
                        </div>
                        <div className="text-right bg-background/50 px-4 py-2 rounded-md border border-blue-200 dark:border-blue-800">
                             <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total People</span>
                             <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                                {inputMaxNoOfTeams * inputMaxTeamSize}
                             </p>
                        </div>
                    </div>
                </div>

              </div>
            ) : (
              // Individual Mode
              <SettingRow 
                label="Total Seat Capacity"
                description="The total number of individual tickets/registrations available."
              >
                <div className="relative max-w-[200px]">
                    <Input
                        type="number"
                        value={inputTotalSeats}
                        className="pl-9"
                        onChange={(e) => setInputTotalSeats(parseInt(e.target.value, 10))}
                    />
                    <Armchair className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </SettingRow>
            )}
          </div>

        </CardContent>
      </Card>
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
  const [inputEventType, setInputEventType] = useState(data.event_type || "EVENT");
  const [inputIsOffline, setInputIsOffline] = useState(data.is_offline ? "OFFLINE" : "ONLINE");
  const [inputAttendanceMode, setInputAttendanceMode] = useState(data.attendance_mode || "SOLO");
  const [inputIsTechnical, setInputIsTechnical] = useState(data.is_technical ? "YES" : "NO");
  
  useEffect(() => {
    setInputEventType(data.event_type);
    setInputIsOffline(data.is_offline ? "OFFLINE" : "ONLINE");
    setInputAttendanceMode(data.attendance_mode);
    setInputIsTechnical(data.is_technical ? "YES" : "NO");
  }, [data.event_type, data.is_offline, data.attendance_mode, data.is_technical]);


  const hasModesChanged =  inputEventType !== data.event_type ||
    inputIsOffline !== (data.is_offline ? "OFFLINE" : "ONLINE") ||
    inputAttendanceMode !== data.attendance_mode ||
    (inputIsTechnical === "YES") !== data.is_technical;


  // Update Event Modes
  const handleUpdateEventModes = () => {
    useEventEditorStore.getState().setEventData({
      event_type: inputEventType,
      is_offline: inputIsOffline === "OFFLINE",
      attendance_mode: inputAttendanceMode,
      is_technical: inputIsTechnical === "YES",
    });
    console.log("API CALL:", "Updating Modes");
    toast.success("Updated modes successfully!");
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Configuration Card */}
        <Card className="border-none">
          <CardHeader className='flex flex-row justify-between'>
            <div className="space-y-1">
              <CardTitle className='mb-2'>Event Configuration</CardTitle>
              <CardDescription>
                Set the fundamental modes and settings for your event.
              </CardDescription>
            </div>
            <Button 
                  onClick={handleUpdateEventModes}
                  disabled={!hasModesChanged}
                  className="flex"
              >
                <Save className="mr-2 h-4 w-4" /> Save Modes
              </Button>
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
                value={inputEventType} 
                onValueChange={(value) => {
                  if (!value) return;
                  setInputEventType(value as "EVENT" | "WORKSHOP");
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
                value={inputIsOffline}
                onValueChange={(value) => {
                  if (!value) return;
                  setInputIsOffline(value);
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
                value={inputAttendanceMode}
                onValueChange={(value) => {
                  if (!value) return;
                  setInputAttendanceMode(value as "SOLO" | "DUO");
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

            {/* IsTechnical */}
            <SettingRow 
              label="Technical Event"
              description="Is this event technical in nature?"
            >
              <ToggleGroup
                type="single"
                variant="outline"
                value={inputIsTechnical}
                onValueChange={(value) => {
                  if (!value) return;
                  setInputIsTechnical(value);
                }}
              >
                <ToggleGroupItem value="NO">
                  <XCircle className="mr-2 h-4 w-4" /> No
                </ToggleGroupItem>
                <ToggleGroupItem value="YES" className="">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Yes
                </ToggleGroupItem>
              </ToggleGroup>
            </SettingRow>

          </CardContent>
        </Card>
        <PeopleCard data={data} />
      </div>

      {/* 2. Organizers & Tags */}
      <div className="grid grid-cols-2 gap-6">
        {/* Organizers Card */}
        <OrganizersCard data={data} />

        {/* Tags Card */}
        <TagsCard data={data} />
      </div>

    </div>
  );
}