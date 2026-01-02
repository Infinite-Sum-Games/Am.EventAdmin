import { createFileRoute } from '@tanstack/react-router'
import { RestrictedAccess } from '@/components/restricted-access'

export const Route = createFileRoute('/dashboard/events/$eventId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user: sessionUser } = Route.useRouteContext();

  const restrictedEmails = ["finance@amrita.edu", "pnr@amrita.edu"];

  if (restrictedEmails.includes(sessionUser.email)) {
      return <RestrictedAccess />;
  }

  return EventEditorPage();
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type EventData } from "@/stores/useEventEditorStore";
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Armchair, Activity, ArrowRight, ArrowRightLeft, Calendar, Check, EyeOff, FileText, Globe, ImageIcon, IndianRupee, Info, Lock, Loader2, LogIn, MapPin, MouseOff, Presentation, Save, ScrollText, Unlock, User, Users, Wifi, XCircle, CheckCircle2, InfoIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import '@mdxeditor/editor/style.css'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrganizersCard } from '@/components/events/organiser-card';
import { TagsCard } from '@/components/events/tag-card';
import { SchedulingTab } from '@/components/events/scheduling-tab';
import { PeopleCard } from '@/components/events/people-card';
import { eventDetailsSchema, eventSizeSchema, eventToggleSchema, posterSchema, type EventDetails, type EventModes, type EventSize } from '@/schemas/event';
import { axiosClient } from '@/lib/axios';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage } from '@/components/events/error-message';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

function unescapeMarkdown(markdown: string) {
  if (!markdown) return "";
  return markdown
    .replace(/\\_/g, "_")
    .replace(/\\\*/g, "*");
}

export function EventEditorPage() {
  const { eventId } = Route.useParams();
  const queryClient = useQueryClient();
  const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);

  const { data: eventData, isLoading } = useQuery<EventData>({
    queryKey: ['event', eventId],
    queryFn: () => axiosClient.get(api.FETCH_EVENT_BY_ID(eventId)).then(r => r.data),
  })

  // mutations for publish/unpublish
  const { mutate: publishEvent } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.post(api.PUBLISH_EVENT(id));
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(['event', id], (oldData: EventData | undefined) => {
        if (oldData) {
          return {
            ...oldData,
            is_published: true,
            is_completed: false
          };
        }
      });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Event published successfully.");
    },
    onError: () => {
      toast.error("Failed to publish event.");
    }
  })

  // mutation for unpublish
  const { mutate: unpublishEvent } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(api.UNPUBLISH_EVENT(id));
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(['event', id], (oldData: EventData | undefined) => {
        if (oldData) {
          return {
            ...oldData,
            is_published: false
          };
        }
      });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Event unpublished successfully.");
    },
    onError: () => {
      toast.error("Failed to unpublish event.");
    }
  })

  // one mutation to handle both mark as completed/incomplete
  const { mutate: toggleCompletedStatus, isPending: isTogglingCompleted } = useMutation({
    mutationFn: async ({ id, markAsCompleted }: { id: string, markAsCompleted: boolean }) => {
      const response = markAsCompleted ? await axiosClient.post(api.MARK_AS_COMPLETED(id)) : await axiosClient.delete(api.MARK_AS_INCOMPLETE(id));
      return response.data;
    },
    onSuccess: (_, { id, markAsCompleted }) => {
      queryClient.setQueryData(['event', id], (oldData: EventData | undefined) => {
        if (oldData) {
          return { ...oldData, is_completed: markAsCompleted };
        }
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success(`Event marked as ${markAsCompleted ? "completed" : "active"}.`);
    },
    onError: () => {
      toast.error("Failed to update event status.");
    }
  });


  const handlePublishToggle = () => {
    if (!eventData) return;
    
    if (eventData.is_published) {
      unpublishEvent(eventId);
    } else {
      if (eventData.schedules?.length === 0) {
        toast.error("Cannot publish event without a schedule. Please add at least one schedule before publishing.");
        setIsPublishConfirmOpen(false);
        return;
      }
      publishEvent(eventId);
    }
    setIsPublishConfirmOpen(false);
  };

  if (isLoading || !eventData) return <div>Loading Event...</div>

  return (
    <div className="container mx-auto py-10">
      <div className='flex flex-row justify-between'>
        <div className="flex flex-col justify-between">
          <h1 className="text-3xl font-bold">{eventData.name}</h1>
          <span className="text-sm text-muted-foreground">ID: {eventData.id}</span>
        </div>
        <div className="flex gap-2">
          {eventData.is_published ? (
            <>
              {/* Completion Toggle */}
              {eventData.is_completed ? (
                <Button
                  variant="secondary"
                  disabled={isTogglingCompleted}
                  onClick={() => toggleCompletedStatus({ id: eventId, markAsCompleted: false })}
                  className="bg-green-700 hover:bg-green-600 text-white shadow-sm"
                >
                  {isTogglingCompleted ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Activity className="h-4 w-4" />
                  )}
                  Re-enable Booking
                </Button>
              ) : (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isTogglingCompleted}
                  onClick={() => toggleCompletedStatus({ id: eventId, markAsCompleted: true })}
                >
                  {isTogglingCompleted ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MouseOff className="h-4 w-4" />
                  )}
                  Disable Booking
                </Button>
              )}

              {/* Unpublish Action */}
              {/* variant="outline" reduces visual noise next to the solid completion button */}
              <Button
                variant="destructive"

                onClick={() => setIsPublishConfirmOpen(true)}
              >
                <EyeOff className="h-4 w-4" />
                Unpublish
              </Button>
            </>
          ) : (
            /* Publish Action */
            <Button
              className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
              onClick={() => setIsPublishConfirmOpen(true)}
            >
              <Globe className="h-4 w-4" />
              Publish Event
            </Button>
          )}
        </div>
      </div>
      <Separator className='my-4' />

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

      <AlertDialog open={isPublishConfirmOpen} onOpenChange={setIsPublishConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{eventData.is_published ? "Unpublish Event?" : "Ready to Publish?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {eventData.is_published ? "This will remove the event from public listings. Participants will no longer be able to view it." : "This will make the event visible to all participants. Are you sure you are ready to go live?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handlePublishToggle}
              className={eventData.is_published ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
            >
              {eventData.is_published ? "Unpublish" : "Publish Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </div>
  );
}

// name, blurb, price, is_per_head, poster 
function GeneralTab({ data }: { data: EventData }) {
  const queryClient = useQueryClient();
  const [inputName, setInputName] = useState(data.name);
  const [inputBlurb, setInputBlurb] = useState(data.blurb || "");
  const [inputUrl, setInputUrl] = useState(data.poster_url || "");
  const [inputPrice, setInputPrice] = useState(data.price || 0);
  const [inputIsPerHead, setInputIsPerHead] = useState(data.is_per_head || false);
  const [isImageError, setIsImageError] = useState(false);
  // Sync state on load
  useEffect(() => {
    setInputUrl(data.poster_url || "");
    setInputName(data.name);
    setInputBlurb(data.blurb || "");
    setInputPrice(data.price || 0);
    setInputIsPerHead(data.is_per_head || false);
    setIsImageError(false);
  }, [data]);

  const hasDetailsChanged = inputName !== data.name || inputBlurb !== (data.blurb || "") || inputPrice !== data.price || inputIsPerHead !== data.is_per_head;
  const hasImageURLChanged = inputUrl !== (data.poster_url || "");

  // update basic event details mutation
  const { mutate: updateDetails, isPending: isUpdatingDetails, error: updateDetailsError } = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: EventDetails }) => {
      // Zod validation
      const validatedData = eventDetailsSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map(err => err.message).join("\n");
        throw new Error(errorMessages);
      }

      const response = await axiosClient.post(api.UPDATE_BASIC_EVENT_DETAILS(id), validatedData.data);
      return response.data;
    },
    onSuccess: (_, { id, payload }) => {
      queryClient.setQueryData(['event', id], (oldData: EventData | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...payload };
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });

      toast.success("Event details updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update event details.");
    }
  });

  // update event poster url mutation
  const { mutate: updatePosterUrl, isPending: isUpdatingPosterUrl, error: updatePosterError } = useMutation({
    mutationFn: async ({ id, poster_url }: { id: string; poster_url: string }) => {
      const validatedData = posterSchema.safeParse({ poster_url });
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map(err => err.message).join("\n");
        throw new Error(errorMessages);
      }

      const response = await axiosClient.post(api.UPDATE_EVENT_POSTER_URL(id), validatedData.data)
      return response.data
    },
    onSuccess: (_, { id, poster_url }) => {
      queryClient.setQueryData(['event', id], (oldData: EventData | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, poster_url };
      });

      toast.success("Poster URL updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update Poster URL")
    }
  })

  // delete event poster url mutation
  const { mutate: deletePosterUrl, isPending: isDeletingPosterUrl, error: deletePosterError } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await axiosClient.delete(api.DELETE_EVENT_POSTER_URL(id));
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.setQueryData(['event', id], (oldData: EventData | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, poster_url: "" };
      });

      toast.success("Poster URL deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete Poster URL");
    }
  });

  const handleApplyUrl = async () => {
    if (inputUrl === "") {
      deletePosterUrl({ id: data.id });
    } else {
      updatePosterUrl({ id: data.id, poster_url: inputUrl });
    }
  };

  const handleUpdateDetails = () => {
    updateDetails({
      id: data.id,
      payload: {
        name: inputName,
        blurb: inputBlurb,
        price: inputPrice,
        is_per_head: inputIsPerHead,
        description: data.description as string,
        rules: data.rules as string,
      }
    });
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
              disabled={!hasDetailsChanged || isUpdatingDetails}
            >
              <Save className="h-4 w-4" />
              {isUpdatingDetails ? "Saving..." : "Save Changes"}
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
                  maxLength={100}
                  onChange={(e) => setInputName(e.target.value)}
                  className="font-medium"
                />
                <p className="text-[0.8rem] text-muted-foreground text-right">
                  {inputName.length}/100
                </p>
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
                  <Label htmlFor="event-price">Ticket Price<span className="text-xs text-muted-foreground">(Excluding GST)</span></Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="event-price"
                      type="number"
                      placeholder="1"
                      min={0}
                      value={inputPrice}
                      onChange={(e) => setInputPrice(parseInt(e.target.value, 10))}
                      className="pl-8 font-mono"
                    />
                  </div>
                </div>

                {/* Fee Structure Toggle Group */}
                <div className="space-y-3">
                  <Label>Fee Structure {data.is_group ? <Unlock className="h-4 w-4 text-muted-foreground" /> : <Lock className="h-4 w-4 text-muted-foreground" />}</Label>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    className="justify-start"
                    disabled={!data.is_group}
                    value={inputIsPerHead ? "PER_HEAD" : "PER_TEAM"}
                    onValueChange={(value) => {
                      if (!value) return; // Prevent unselecting
                      setInputIsPerHead(value === "PER_HEAD");
                    }}
                  >
                    <ToggleGroupItem value="PER_HEAD" className="flex-1">
                      <User className="h-4 w-4" /> Per Person
                    </ToggleGroupItem>
                    <ToggleGroupItem value="PER_TEAM" className="flex-1">
                      <Users className="h-4 w-4" />Per Team
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <p className="text-[0.8rem] text-muted-foreground">
                    {!data.is_group ? (
                      <span className="text-xs">
                        Disabled for individual events
                      </span>
                    ) : (
                      inputIsPerHead
                        ? "Ticket price is calculated per person."
                        : "Ticket price is fixed per team/group."
                    )}
                  </p>
                </div>
              </div>
            </div>
            <ErrorMessage
              title="Failed to update event details"
              message={updateDetailsError?.message}
            />
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
                  disabled={!hasImageURLChanged || isUpdatingPosterUrl || isDeletingPosterUrl}
                >
                  {isUpdatingPosterUrl ? "Applying..." : "Apply"} <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <ErrorMessage
              title="Failed to update Poster URL"
              message={isUpdatingPosterUrl ? "Updating..." : updatePosterError?.message}
            />
            <ErrorMessage
              title="Failed to delete Poster URL"
              message={isDeletingPosterUrl ? "Deleting..." : deletePosterError?.message}
            />
          </CardContent>
        </Card>
      </div>

      {/* Live Preview */}
      <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-2 flex flex-col justify-center">

        <div className="relative aspect-2/3 w-full rounded-lg border-2 border-dashed bg-muted/10 overflow-hidden shadow-sm flex flex-col items-center justify-center transition-all border-muted-foreground/50">

          {/* Preview Badge */}
          <div className="absolute top-3 left-3 z-10">
            {hasImageURLChanged && (
              <Badge variant="secondary" className="shadow-sm backdrop-blur-md bg-background/80">
                <Info className="mr-1 h-3 w-3 text-blue-500" /> Previewing (Unsaved)
              </Badge>
            )}
          </div>

          {/* Image Handling */}
          {inputUrl && !isImageError ? (
            <img
              src={inputUrl}
              alt="Event Poster Preview"
              className="object-cover w-full h-full animate-in fade-in duration-500"
              onError={() => setIsImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground gap-2">
              <div className="rounded-full bg-muted p-4 mb-2">
                <ImageIcon className="h-8 w-8 opacity-50" />
              </div>
              <p className="text-sm font-medium">{isImageError ? "Invalid Image URL" : "No Poster Uploaded"}</p>
              <p className="text-xs max-w-45">
                {isImageError ? "Please check the URL and try again." : "Enter a valid URL to see a preview of your event poster."}
              </p>
            </div>
          )}
        </div>
        <Label className="text-muted-foreground pl-1 self-center">Live Preview</Label>
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
  const queryClient = useQueryClient();

  useEffect(() => {
    // Sync external changes only if input is empty (first load)
    if (!inputDescription && data.description) {
      setInputDescription(data.description);
    }
  }, [data.description]);

  const hasDescriptionChanged = inputDescription !== (data.description || "");

  // update description mutation
  const { mutate: updateDescription, isPending: isUpdatingDescription, error: updateDescriptionError } = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: EventDetails }) => {
      // Zod validation
      const validatedData = eventDetailsSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map(err => err.message).join("\n");
        throw new Error(errorMessages);
      }

      const response = await axiosClient.post(api.UPDATE_BASIC_EVENT_DETAILS(id), validatedData.data);
      return response.data;
    },
    onSuccess: (_, { id, payload }) => {
      queryClient.setQueryData(['event', id], (oldData: EventData | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...payload };
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });

      toast.success("Updated event description successfully!");
    },
    onError: () => {
      toast.error("Failed to update event description.");
    }
  });

  const handleUpdateDescription = () => {
    updateDescription({
      id: data.id,
      payload: {
        name: data.name,
        blurb: data.blurb,
        price: data.price,
        is_per_head: data.is_per_head,
        description: inputDescription,
        rules: data.rules as string,
      }
    });
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
              disabled={!hasDescriptionChanged || isUpdatingDescription}
              className="flex"
            >
              <Save className="h-4 w-4" />
              {isUpdatingDescription ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-0 md:px-6 pb-6">
          {/* Editor Container */}
          <div className="min-h-125">
            <Suspense fallback={<EditorSkeleton />}>
              <MDXEditorLazy
                markdown={unescapeMarkdown(inputDescription)}
                onChange={(newMarkdown) => setInputDescription((newMarkdown || "").slice(0, 10000))}
              />
            </Suspense>
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-right">
            Use headings (#), lists (-), and bold text (**text**) to format your content.
          </p>
          <p className="text-[0.8rem] text-muted-foreground text-right mt-2">
            {inputDescription.length}/10000
          </p>
          <ErrorMessage
            title="Failed to update description"
            message={updateDescriptionError?.message}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// rules
function RulesTab({ data }: { data: EventData }) {
  const [inputRules, setInputRules] = useState(data.rules || "");
  const queryClient = useQueryClient();

  useEffect(() => {
    // Sync external changes only if input is empty (first load)
    if (!inputRules && data.rules) {
      setInputRules(data.rules);
    }
  }, [data.rules]);

  const hasRulesChanged = inputRules !== (data.rules || "");

  const { mutate: updateRules, isPending: isUpdatingRules, error: updateRulesError } = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: EventDetails }) => {
      // Zod validation
      const validatedData = eventDetailsSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map(err => err.message).join("\n");
        throw new Error(errorMessages);
      }

      const response = await axiosClient.post(api.UPDATE_BASIC_EVENT_DETAILS(id), validatedData.data);
      return response.data;
    },
    onSuccess: (_, { id, payload }) => {
      queryClient.setQueryData(['event', id], (oldData: EventData | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...payload };
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });

      toast.success("Updated event rules successfully!");
    },
    onError: () => {
      toast.error("Failed to update event rules.");
    }
  });

  const handleUpdateRules = () => {
    updateRules({
      id: data.id,
      payload: {
        name: data.name,
        blurb: data.blurb,
        price: data.price,
        is_per_head: data.is_per_head,
        description: data.description as string,
        rules: inputRules,
      }
    });
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
              disabled={!hasRulesChanged || isUpdatingRules}
              className="flex"
            >
              <Save className="h-4 w-4" />
              {isUpdatingRules ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-0 md:px-6 pb-6">
          <div className="min-h-125">
            <Suspense fallback={<EditorSkeleton />}>
              <MDXEditorLazy
                markdown={unescapeMarkdown(inputRules)}
                onChange={(newMarkdown) => setInputRules(newMarkdown || "")}
              />
            </Suspense>
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-right">
            Tip: Use bullet points (-) to make rules easy to scan.
          </p>
          <ErrorMessage
            title='Failed to update rules'
            message={updateRulesError?.message}
          />
        </CardContent>
      </Card>
    </div>
  )
}

// is group, team sizes, seats
function SeatsTab({ data }: { data: EventData }) {
  const [inputIsGroup, setInputIsGroup] = useState(data.is_group);
  const [inputMinTeamSize, setInputMinTeamSize] = useState(data.min_teamsize ?? 1);
  const [inputMaxTeamSize, setInputMaxTeamSize] = useState(data.max_teamsize ?? 1);
  const [inputMaxNoOfTeams, setInputMaxNoOfTeams] = useState(0);
  const [inputTotalSeats, setInputTotalSeats] = useState(data.total_seats);
  const queryClient = useQueryClient();

  useEffect(() => {
    setInputIsGroup(data.is_group);
    setInputMinTeamSize(data.min_teamsize ?? 1);
    setInputMaxTeamSize(data.max_teamsize ?? 1);
    setInputMaxNoOfTeams(data.is_group ? data.total_seats : 0);
    setInputTotalSeats(data.total_seats);
  }, [data.is_group, data.min_teamsize, data.max_teamsize, data.total_seats]);

  const hadSeatsChanged = inputIsGroup !== data.is_group ||
    (inputIsGroup && (inputMinTeamSize !== data.min_teamsize || inputMaxTeamSize !== data.max_teamsize || inputMaxNoOfTeams !== data.total_seats)) ||
    (!inputIsGroup && inputTotalSeats !== data.total_seats);

  const { mutate: updateSeats, isPending: isUpdatingSeats, error: updateSeatsError } = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: EventSize }) => {
      // zod validation
      const validatedData = eventSizeSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map(err => err.message).join("\n");
        throw new Error(errorMessages);
      }

      const response = await axiosClient.post(api.UPDATE_EVENT_SIZE(id), validatedData.data);
      return response.data;
    },
    onSuccess: (_, { id, payload }) => {
      queryClient.setQueryData(['event', id], (oldData: EventData | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...payload };
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });

      toast.success("Updated event seating successfully!");
    },
    onError: () => {
      toast.error("Failed to update event seating.");
    }
  });

  const handleUpdateSeats = () => {
    updateSeats({
      id: data.id,
      payload: {
        is_group: inputIsGroup,
        min_teamsize: inputIsGroup ? inputMinTeamSize : 1,
        max_teamsize: inputIsGroup ? inputMaxTeamSize : 1,
        total_seats: inputIsGroup ? inputMaxNoOfTeams : inputTotalSeats,
        is_per_head: data.is_per_head
      }
    });
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
              onClick={handleUpdateSeats || isUpdatingSeats}
              className="flex"
            >
              <Save className="h-4 w-4" />
              {isUpdatingSeats ? "Updating Seats..." : "Update Seats"}
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
                  if (value === "YES") {
                    setInputMinTeamSize(1);
                    setInputMaxTeamSize(1);
                    setInputMaxNoOfTeams(0);
                  } else {
                    setInputTotalSeats(0);
                  }
                }}
              >
                <ToggleGroupItem value="NO" className="flex-1 sm:flex-none">
                  <User className="h-4 w-4" /> Individual
                </ToggleGroupItem>
                <ToggleGroupItem value="YES" className="flex-1 sm:flex-none">
                  <Users className="h-4 w-4" /> Team / Group
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
                          onChange={(e) => setInputMinTeamSize(parseInt(e.target.value, 10))}
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
                          onChange={(e) => setInputMaxTeamSize(parseInt(e.target.value, 10))}
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
                        onChange={(e) => setInputMaxNoOfTeams(parseInt(e.target.value, 10))}
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
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Participants</span>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                        {inputMaxNoOfTeams * (inputMaxTeamSize || 1)}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              // Individual Mode
              (<SettingRow
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
              </SettingRow>)
            )}
          </div>

          <ErrorMessage
            title="Failed to update seating configuration"
            message={updateSeatsError?.message}
          />

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
  const queryClient = useQueryClient();

  useEffect(() => {
    setInputEventType(data.event_type);
    setInputIsOffline(data.is_offline ? "OFFLINE" : "ONLINE");
    setInputAttendanceMode(data.attendance_mode || "SOLO");
    setInputIsTechnical(data.is_technical ? "YES" : "NO");
  }, [data.event_type, data.is_offline, data.attendance_mode, data.is_technical]);


  const hasModesChanged = inputEventType !== data.event_type ||
    inputIsOffline !== (data.is_offline ? "OFFLINE" : "ONLINE") ||
    inputAttendanceMode !== data.attendance_mode ||
    (inputIsTechnical === "YES") !== data.is_technical;

  const { mutate: updateModes, isPending: isUpdatingModes, error: updateModesError } = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: EventModes }) => {
      // zod validation
      const validatedData = eventToggleSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map(err => err.message).join("\n");
        throw new Error(errorMessages);
      }

      const response = await axiosClient.post(api.UPDATE_EVENT_MODES(id), validatedData.data);
      return response.data;
    },
    onSuccess: (_, { id, payload }) => {
      queryClient.setQueryData(['event', id], (oldData: EventData | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...payload };
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });

      toast.success("Updated event modes successfully!");
    },
    onError: () => {
      toast.error("Failed to update event modes.");
    }
  });

  // Update Event Modes
  const handleUpdateEventModes = () => {
    updateModes({
      id: data.id,
      payload: {
        event_type: inputEventType,
        is_offline: inputIsOffline === "OFFLINE",
        attendance_mode: inputAttendanceMode,
        is_technical: inputIsTechnical === "YES",
      }
    });
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Configuration Card */}
        <Card className="border-none">
          <CardHeader className='flex flex-row justify-between'>
            <div className="space-y-1">
              <CardTitle className='mb-2'>Event Configuration {hasModesChanged && <div className='flex items-center align-middle mt-2'><InfoIcon className='h-4 w-4 text-destructive mr-1' /><p className="text-sm text-destructive">You have unsaved changes</p></div>}</CardTitle>
              <CardDescription>
                Set the fundamental modes and settings for your event.
              </CardDescription>
            </div>
            <Button
              onClick={handleUpdateEventModes}
              disabled={!hasModesChanged || isUpdatingModes}
              className="flex"
            >
              <Save className="h-4 w-4" />
              {isUpdatingModes ? "Saving..." : "Save Changes"}
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
                  <Calendar className="h-4 w-4" /> Event
                </ToggleGroupItem>
                <ToggleGroupItem value="WORKSHOP" aria-label="Workshop">
                  <Presentation className="h-4 w-4" /> Workshop
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
                  <MapPin className="h-4 w-4" /> Offline
                </ToggleGroupItem>
                <ToggleGroupItem value="ONLINE">
                  <Wifi className="h-4 w-4" /> Online
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
                  <LogIn className="h-4 w-4" /> Entry only
                </ToggleGroupItem>
                <ToggleGroupItem value="DUO" title="Scan start and end">
                  <ArrowRightLeft className="h-4 w-4" /> Entry & Exit
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
                  <XCircle className="h-4 w-4" /> No
                </ToggleGroupItem>
                <ToggleGroupItem value="YES" className="">
                  <CheckCircle2 className="h-4 w-4" /> Yes
                </ToggleGroupItem>
              </ToggleGroup>
            </SettingRow>

            <ErrorMessage
              title="Failed to update event configuration"
              message={updateModesError?.message}
            />

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
