import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Notebook, Edit3 } from "lucide-react";
import { useEventEditorStore, type EventData } from "@/stores/useEventEditorStore";

interface EventCardProps {
  event: EventData;
}

export function EventCard({ event }: EventCardProps) {
  const seatsPercentage = event.total_seats
    ? ((event.seats_filled || 0) / event.total_seats) * 100
    : 0;

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg">
      <CardHeader className="p-0">
        <img
          src={event.poster_url}
          alt={event.name}
          className="h-48 w-full object-cover"
        />
      </CardHeader>

      <CardContent className="grow p-4">
        <CardTitle className="mb-2 text-xl">{event.name}</CardTitle>

        <div className="mb-4 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <Badge key={tag.name} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {event.blurb}
        </p>

        <div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Seats Filled</span>
            <span>
              {event.seats_filled} / {event.total_seats}
            </span>
          </div>
          <Progress value={seatsPercentage} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 border-t p-4">
        <Button variant="secondary" className="flex-1" asChild>
          <Link
            to="/dashboard/events/$eventId"
            params={{ eventId: event.id }}
            className="flex items-center justify-center gap-2"
          >
            <Notebook className="h-4 w-4" />
            Details
          </Link>
        </Button>
        <Button className="flex-1" onClick={() => {
          console.log("Setting event data in store:", event);
          useEventEditorStore.setState({ eventData: event });
        }} asChild>
          <Link
            to="/dashboard/events/new"
            className="flex items-center justify-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
