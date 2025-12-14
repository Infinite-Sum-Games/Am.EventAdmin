export interface People {
    id: string;
    name: string;
    phone_number: string;
    email: string;
    profession: string;
}

export type GetAllPeopleResponse = {
  message: string;
  people: People[];
};