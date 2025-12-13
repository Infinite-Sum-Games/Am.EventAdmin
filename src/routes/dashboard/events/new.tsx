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
import { Check, Info, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import '@mdxeditor/editor/style.css'

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
          <div>Seats Content</div>
        </TabsContent>

        <TabsContent value="modes">
          <div>Modes/Orgs/Tags Content</div>
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
    setInputName(data.event_name);
    setInputBlurb(data.blurb || "");
    setInputUrl(data.poster_url || "");
  }, [data.poster_url, data.event_name, data.blurb]);

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
    <div className="flex flex-row">
      <div className="flex flex-row flex-1 mr-10 border rounded-md">
        <div className="flex flex-col flex-1 p-6 gap-6">
          
          {/* Event Name */}
          <div>
            <Label className="block text-sm font-medium mb-2" htmlFor="event-name">
              Event Name
            </Label>
            <Input
              type="text"
              id="event-name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
          </div>

          {/* Event Blurb */}
          <div>
            <Label className="block text-sm font-medium mb-2" htmlFor="event-blurb">
              Event Blurb
            </Label>
            <Textarea
              id="event-blurb"
              rows={3}
              value={inputBlurb}
              onChange={(e) => setInputBlurb(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleUpdateNameandBlurb} 
            variant="default"
            disabled={!hasNameAndBlurbChanged}
            >
            <Check className="h-4 w-4" /> Update details
          </Button>

          {/* Poster URL Section */}
          <div>
            <Label className="block text-sm font-medium mb-2" htmlFor="event-poster">
              Event Poster URL
            </Label>

            <div className="flex gap-2">
              <Input
                type="text"
                id="event-poster"
                placeholder="https://example.com/image.png"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1"
              />
            
              <Button 
                onClick={handleApplyUrl} 
                variant="default"
                disabled={!hasImageURLChanged}
                >
                <Check className="h-4 w-4" /> Apply 
                </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="h-full w-96 shrink-0">
        <div className="relative aspect-4/6 w-full border rounded-md overflow-hidden bg-muted/30 flex items-center justify-center">
            
            {/* Badge Logic */}
            <div className="absolute top-2 left-2 z-10">
                {hasImageURLChanged ? (
                    <Badge variant="secondary" className="text-xs">
                        <Info className="mr-1 h-3 w-3" /> Preview
                    </Badge>
                ) : null}
            </div>

            {/* Image vs Placeholder Logic */}
            {inputUrl ? (
              <img 
                src={inputUrl} 
                alt="Event Poster" 
                className="object-cover w-full h-full" 
              />
            ) : (
              <div className="flex flex-col items-center juy-6stify-center h-full w-full p-4 text-center">
                <span className="text-muted-foreground text-sm">No Poster Applied</span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

const MDXEditorLazy = lazy(() => import("@/components/events/mdx-editor"));

function EditorSkeleton() {
  return (
    <div className="w-full h-100 border rounded-md bg-muted/20 flex items-center justify-center text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      Loading Editor...
    </div>
  )
}

// description
function DescriptionTab({ data }: { data: EventData }) {
  const [inputDescription, setInputDescription] = useState(data.description || "");

  useEffect(() => {
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
    <div className="flex flex-col flex-1 border rounded-md p-6 h-full">
      <Label className="block text-sm font-medium mb-2" htmlFor="event-description">
        Event Description
      </Label>
      
      <div className="flex flex-col flex-1 min-h-100 border rounded-md overflow-hidden">
        <Suspense fallback={<EditorSkeleton />}>
           <MDXEditorLazy 
             markdown={inputDescription} 
             onChange={(newMarkdown) => setInputDescription(newMarkdown)}
             className="h-full bg-background"
           />
        </Suspense>
      </div>


        <Button 
          className="mt-4"
          onClick={handleUpdateDescription}
          disabled={!hasDescriptionChanged}
        >
          Update Description
        </Button>
      </div>
  );
}

// rules
function RulesTab({data}: { data: EventData }) {
  const [inputRules, setInputRules] = useState(data.rules || "");

  useEffect(() => {
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
    <div className="flex flex-col flex-1 border rounded-md p-6 h-full">
      <Label className="block text-sm font-medium mb-2" htmlFor="event-rules">
        Event Rules
      </Label>
      
      <div className="flex flex-col flex-1 min-h-100 border rounded-md overflow-hidden">
        <Suspense fallback={<EditorSkeleton />}>
           <MDXEditorLazy 
             markdown={inputRules} 
             onChange={(newMarkdown) => setInputRules(newMarkdown)}
             className="h-full bg-background"
           />
        </Suspense>
      </div>


        <Button 
          className="mt-4"
          onClick={handleUpdateRules}
          disabled={!hasRulesChanged}
        >
          Update Rules
        </Button>
      </div>
  )
}