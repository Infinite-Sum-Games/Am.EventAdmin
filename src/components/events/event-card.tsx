import { useState } from "react"; // Import useState
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  User,
  Trophy,
  Wrench,
  Image,
  ArrowRight,
  Activity,
  PencilLine
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventData } from "@/stores/useEventEditorStore";

interface EventCardProps {
  event: EventData;
}

export function EventCard({ event }: EventCardProps) {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const getCategoryBadge = () => {
    const techLabel = event.is_technical ? "Technical" : "Non-Technical";
    const typeLabel = event.event_type === "WORKSHOP" ? "Workshop" : "Event";
    const icon = event.event_type === "WORKSHOP" ? <Wrench className="w-3 h-3 mr-1" /> : <Trophy className="w-3 h-3 mr-1" />;
    return (
      <Badge className="py-1 px-2 flex items-center shadow-md rounded-sm">
        {icon} {techLabel} {typeLabel}
      </Badge>
    );
  };

  const progressPercentage = Math.min((event.seats_filled / event.total_seats) * 100, 100);
  const isSoldOut = event.seats_filled >= event.total_seats;
  const isClosed = event.event_status === "CLOSED";
  const hasValidPosterUrl = event.poster_url && event.poster_url.trim() !== "";

  return (
    <Card
      className={cn(
        "group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg border-muted gap-0 py-0 cursor-pointer",
      )}
      onClick={() => {
        navigate({ to: "/dashboard/events/$eventId", params: { eventId: event.id } });
      }}
    >
      {/* Poster Image */}
      <div className="relative h-96 w-full aspect-2/3 overflow-hidden bg-muted">
        {!hasValidPosterUrl || imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/50">
            <Image className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-medium">No Poster Available</span>
          </div>
        ) : (
          <img
            src={event.poster_url}
            alt={event.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10">
          {getCategoryBadge()}
        </div>

        {/* Active Badge */}
        {(event.event_status === "ACTIVE" || event.event_status === "CLOSED" || event.event_status === "COMPLETED") && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className={cn("px-2 py-1 text-xs backdrop-blur-sm rounded-sm shadow-md", {
              "bg-green-600/80 text-white": event.event_status === "ACTIVE",
              "bg-yellow-400/70 text-white": event.event_status === "CLOSED",
              "bg-blue-600/80 text-white": event.event_status === "COMPLETED",
            })}>
              {event.event_status === "ACTIVE" ? <Activity className="w-4 h-4 mr-1" /> : event.event_status === "CLOSED" ? <PencilLine className="w-4 h-4 mr-1" /> : <Trophy className="w-4 h-4 mr-1" />}
              {event.event_status === "ACTIVE" ? "PUBLISHED" : event.event_status === "CLOSED" ? "DRAFT" : "COMPLETED"}
            </Badge>
          </div>
        )}

        {/* Is Group Badge */}
        <div className="absolute bottom-3 right-3 z-10 shadow-md">
          <Badge className="px-2 py-1 text-xs backdrop-blur-sm rounded-sm">
            {event.is_group ? <Users className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
            {event.is_group ? `${event.min_teamsize ?? 1}-${event.max_teamsize ?? 1} Team` : "Individual"}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        {/* Event Name */}
        <h3 className="font-bold text-lg leading-tight line-clamp-2 min-h-[1.5em]" title={event.name}>
          {event.name}
        </h3>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-1 flex flex-col gap-4">

        {/* Seats Filled */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Seats Filled</span>
            <span className={cn("font-medium", isSoldOut ? "text-destructive" : "text-primary")}>
              {event.seats_filled} / {event.total_seats}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between gap-4">

        {/* Price */}
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground uppercase font-bold tracking-wider">
            Price
          </span>
          <div className="flex items-baseline gap-1">
            {event.price === 0 ? (
              <span className="text-lg font-bold text-muted-foreground">Unset</span>
            ) : (
              <>
                <span className="text-lg font-bold">₹{event.price}</span>
                <span className="text-xs text-muted-foreground">
                  {event.is_per_head ? "/ person" : "/ team"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Details Button */}
        <Button
          className="h-9 px-4 rounded-md"
          asChild={!isClosed && !isSoldOut}
        >
          <Link to="/dashboard/events/$eventId" params={{ eventId: event.id }} className="flex items-center">
            <span className="mr-1">Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}