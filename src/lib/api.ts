
// For now, let's use a relative URL to leverage the Vite proxy.
const CURRENT_BASE_URL: string = "/api/v1"; 

export const api = {
  FETCH_ALL_EVENTS: `${CURRENT_BASE_URL}/events`,
  FETCH_ALL_ORGANIZERS: `${CURRENT_BASE_URL}/organizers`,
  CREATE_ORGANIZER: `${CURRENT_BASE_URL}/organizers`,
};
