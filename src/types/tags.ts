export type Tags = {
  id: string;
  name: string;
  abbreviation: string;
  events: {
    id: string;
    name: string;
  }[];
};

export type GetAllTagsResponse = {
  message: string;
  tags: Tags[];
};