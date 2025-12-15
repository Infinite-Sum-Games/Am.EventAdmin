export type Tags = {
  id: string;
  name: string;
  abbreviation: string;
};

export type GetAllTagsResponse = {
  message: string;
  tags: Tags[];
};