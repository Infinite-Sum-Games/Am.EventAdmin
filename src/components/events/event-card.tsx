import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Notebook, Edit3 } from 'lucide-react';
import type { GetAllEventsResponse } from '@/types/events';

interface EventCardProps {
  event: GetAllEventsResponse;
}

export function EventCard({ event }: EventCardProps) {
  const seatsPercentage = (event.seats_filled / event.max_seats) * 100;


  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg">
      <CardHeader className="p-0">
        <img
          src={event.event_image_url}
          alt={event.event_name}
          className="h-48 w-full object-cover"
        />
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 text-xl">{event.event_name}</CardTitle>
        <div className="mb-4 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event.event_description}
        </p>
        <div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Seats Filled</span>
            <span>{event.seats_filled} / {event.max_seats}</span>
          </div>
          <Progress value={seatsPercentage} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t p-4">
        <Button
          variant="secondary"
          className="w-full text-center"
          asChild
        >
          <Link to="/dashboard/events/$eventId" params={{ eventId: event.event_id }}>
            <Notebook className="mr-2 h-4 w-4" />
            Details
          </Link>
        </Button>
        <Button
          className="w-full text-center"
          asChild
        >
          <Link to="/dashboard/events/edit" search={{ id: event.event_id }}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
