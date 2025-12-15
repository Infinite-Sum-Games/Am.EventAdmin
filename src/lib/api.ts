// For now, let's use a relative URL to leverage the Vite proxy.
const CURRENT_BASE_URL: string = "/api/v1";

export const api = {
  LOGIN: `${CURRENT_BASE_URL}/auth/admin/login`,
  LOGOUT: `${CURRENT_BASE_URL}/auth/admin/logout`,
  SESSION: `${CURRENT_BASE_URL}/auth/admin/session`,

  // Organizers
  FETCH_ALL_ORGANIZERS: `${CURRENT_BASE_URL}/organizers`,
  CREATE_ORGANIZER: `${CURRENT_BASE_URL}/organizers`,
  UPDATE_ORGANIZER: (id: string) => `${CURRENT_BASE_URL}/organizers/${id}`,
  DELETE_ORGANIZER: (id: string) => `${CURRENT_BASE_URL}/organizers/${id}`,

  // Tags
  FETCH_ALL_TAGS: `${CURRENT_BASE_URL}/tags`,
  CREATE_TAG: `${CURRENT_BASE_URL}/tags`,
  UPDATE_TAG: (id: string) => `${CURRENT_BASE_URL}/tags/${id}`,
  DELETE_TAG: (id: string) => `${CURRENT_BASE_URL}/tags/${id}`,  

  // People
  FETCH_ALL_PEOPLE: `${CURRENT_BASE_URL}/people/`,
  CREATE_PEOPLE: `${CURRENT_BASE_URL}/people`,  
  UPDATE_PEOPLE: (id: string) => `${CURRENT_BASE_URL}/people/${id}`,
  DELETE_PEOPLE: (id: string) => `${CURRENT_BASE_URL}/people/${id}`,

  // Events

  FETCH_ALL_EVENTS: `${CURRENT_BASE_URL}/events/admin`,
  FETCH_EVENT_BY_ID: (eventId: string) => `${CURRENT_BASE_URL}/events/admin/${eventId}`,

  CREATE_EVENT: `${CURRENT_BASE_URL}/events/admin/new`,
  UPDATE_BASIC_EVENT_DETAILS: (id : string) => `${CURRENT_BASE_URL}/events/admin/details/${id}`,

  UPDATE_EVENT_POSTER_URL: (id: string) => `${CURRENT_BASE_URL}/events/admin/poster/${id}`,
  DELETE_EVENT_POSTER_URL: (id: string) => `${CURRENT_BASE_URL}/events/admin/poster/${id}`,

  UPDATE_EVENT_SIZE: (id: string) => `${CURRENT_BASE_URL}/events/admin/size/${id}`,
  UPDATE_EVENT_MODES: (id: string) => `${CURRENT_BASE_URL}/events/admin/toggle/${id}`,

  CONNECT_EVENT_ORGANIZER:`${CURRENT_BASE_URL}/events/admin/organizer/`,
  DISCONNECT_EVENT_ORGANIZER:`${CURRENT_BASE_URL}/events/admin/organizer/`,

  CONNECT_EVENT_TAG:`${CURRENT_BASE_URL}/events/admin/tag/`,
  DISCONNECT_EVENT_TAG:`${CURRENT_BASE_URL}/events/admin/tag/`,

  CONNECT_EVENT_PEOPLE:`${CURRENT_BASE_URL}/events/admin/people/`,
  DISCONNECT_EVENT_PEOPLE:`${CURRENT_BASE_URL}/events/admin/people/`,

  ADD_EVENT_SCHEDULE: (id: string) => `${CURRENT_BASE_URL}/events/admin/schedule/${id}`,
  UPDATE_EVENT_SCHEDULE: (id: string) => `${CURRENT_BASE_URL}/events/admin/schedule/${id}`,
  DELETE_EVENT_SCHEDULE: (id: string) => `${CURRENT_BASE_URL}/events/admin/schedule/${id}`,
};
