"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Tag,
  Phone,
  User,
  CalendarIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EventData {
  id: string;
  event_name: string;
  blurb: string;
  event_description: string;
  cover_image_url: string | null;
  price: number;
  is_per_head: boolean;
  rules: string;
  event_type: string;
  is_group: boolean;
  max_teamsize: number | null;
  min_teamsize: number | null;
  total_seats: number;
  seats_filled: number;
  event_status: string;
  event_mode: string;
  organizers: Array<{
    org_abbreviation: string;
    org_type: string;
    organizer_name: string;
  }>;
  schedules: Array<{
    event_date: string;
    start_time: string;
    end_time: string;
    venue: string;
  }>;
  tags: Array<{
    tag_abbreviation: string;
    tag_name: string;
  }>;
  people: Array<{
    person_name: string;
    email: string | null;
    phone_number: string;
    profession: string | null;
  }>;
}

export function EventDetails({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(api.FETCH_EVENT_BY_ID(eventId));
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        const data = await response.json();
        setEvent(data.event);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return <EventDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Event not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const availableSeats = event.total_seats - event.seats_filled;
  const occupancyPercentage = (event.seats_filled / event.total_seats) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {event.cover_image_url && (
            <div className="mb-6 h-64 w-full overflow-hidden rounded-lg bg-muted sm:h-80 md:h-96">
              <img
                src={event.cover_image_url || "/placeholder.svg"}
                alt={event.event_name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-pretty sm:text-4xl md:text-5xl">
                {event.event_name}
              </h1>
              <p className="mt-2 text-base text-muted-foreground sm:text-lg">
                {event.blurb}
              </p>
            </div>
            <Badge
              variant={
                event.event_status === "ACTIVE" ? "default" : "secondary"
              }
              className="w-fit"
            >
              {event.event_status}
            </Badge>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4" />
                Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ${event.price}
                {event.is_per_head && (
                  <span className="text-sm text-muted-foreground">/person</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {availableSeats}/{event.total_seats}
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${occupancyPercentage}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                Event Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{event.event_type}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4" />
                Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{event.event_mode}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {event.event_description}
                </p>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Rules & Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {event.rules}
                </p>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.schedules && event.schedules.length > 0 ? (
                    event.schedules.map((schedule, idx) => (
                      <div
                        key={idx}
                        className="overflow-hidden rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="space-y-3">
                          {/* Date */}
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 shrink-0 text-primary" />
                              <span className="font-semibold text-sm sm:text-base">
                                {new Date(
                                  schedule.event_date
                                ).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Time */}
                          <div className="flex items-center gap-2 pl-6">
                            <Clock className="h-4 w-4 shrink-0 text-primary" />
                            <span className="text-sm text-foreground font-medium">
                              {schedule.start_time}{" "}
                              <span className="text-muted-foreground">to</span>{" "}
                              {schedule.end_time}
                            </span>
                          </div>

                          {/* Venue */}
                          <div className="flex items-start gap-2 pl-6">
                            <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                            <span className="text-sm text-foreground font-medium wrap-break-word">
                              {schedule.venue}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No schedule information available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Badge key={tag.tag_abbreviation} variant="secondary">
                        {tag.tag_name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Organizers */}
            {event.organizers && event.organizers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Organizers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {event.organizers.map((org) => (
                      <div
                        key={org.org_abbreviation}
                        className="rounded-lg border border-border p-3"
                      >
                        <p className="font-semibold text-sm">
                          {org.organizer_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {org.org_type}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact People */}
            {event.people && event.people.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Key Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {event.people.map((person, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border p-3"
                      >
                        <p className="font-semibold text-sm">
                          {person.person_name}
                        </p>
                        <div className="mt-2 space-y-1">
                          {person.phone_number && (
                            <a
                              href={`tel:${person.phone_number}`}
                              className="flex items-center gap-2 text-xs text-primary hover:underline"
                            >
                              <Phone className="h-3 w-3 shrink-0" />
                              <span className="break-all">
                                {person.phone_number}
                              </span>
                            </a>
                          )}
                          {person.email && (
                            <a
                              href={`mailto:${person.email}`}
                              className="flex items-center gap-2 text-xs text-primary hover:underline break-all"
                            >
                              <span>{person.email}</span>
                            </a>
                          )}
                          {person.profession && (
                            <p className="text-xs text-muted-foreground">
                              {person.profession}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Group Info */}
            <Card>
              <CardHeader>
                <CardTitle>Group Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">
                    Group Event
                  </span>
                  <Badge variant={event.is_group ? "default" : "outline"}>
                    {event.is_group ? "Yes" : "No"}
                  </Badge>
                </div>
                {event.min_teamsize !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Min Team Size
                    </span>
                    <span className="font-semibold">{event.min_teamsize}</span>
                  </div>
                )}
                {event.max_teamsize !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Max Team Size
                    </span>
                    <span className="font-semibold">{event.max_teamsize}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <Skeleton className="mb-6 h-64 w-full rounded-lg sm:h-80 md:h-96" />
        <Skeleton className="mb-4 h-10 w-3/4" />
        <Skeleton className="mb-8 h-6 w-1/2" />

        <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-8">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
