export type Event = {
  event_id: string;
  event_name: string;
  event_image_url: string;
  event_status: string;
  event_description: string;
  event_date: string;
  is_group: boolean;
  tags: string[];
  event_price: number;
  is_registered: boolean;
  is_starred: boolean;
  max_seats: number;
  seats_filled: number;
};
