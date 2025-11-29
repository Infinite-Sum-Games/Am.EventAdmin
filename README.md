# anokha-2025-admin

This is the admin dashboard for the Anokha 2025 event, built with a modern frontend stack including Vite, React, TypeScript, and Tailwind CSS.

## Current Status

This project is currently in the **frontend development phase**. The core application structure, UI components, routing, and a significant portion of the page layouts have been established. Data is currently mocked to allow for rapid UI development without a backend dependency.

## Key Technologies

- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Routing:** TanStack Router (File-based)
- **Data Fetching:** TanStack Query
- **UI Components:** `shadcn/ui`
- **Styling:** Tailwind CSS with a custom theme

## Getting Started

To get the development server running:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
The application will be available at `http://localhost:5173` (or the next available port).

## Features & Implemented Pages

### Authentication & Login

-   The root page (`/`) is the login screen.
-   **Login is currently simulated.** You can enter **any non-empty email and password** to log in and access the dashboard.
-   Authentication for the dashboard routes is temporarily disabled in `src/routes/dashboard.tsx` to allow for easy development.

### Dashboard & Navigation

-   **Main Dashboard (`/dashboard`):** A central overview page featuring key statistics (Total Revenue, Participants, Active Events) and a placeholder for analytics charts.
-   **Sidebar:** A fully redesigned, responsive sidebar with two main groups: "Management" and "Analytics". Navigation is a mix of direct links for simple sections and collapsible menus for more complex ones.
-   **Theme Toggle:** A light/dark mode toggle button is available on both the login page and in the main dashboard header.

### Management Pages

-   **View Events (`/dashboard/events`):** A dedicated page to view all events. It features a powerful, client-side filtering system that allows searching by name, status, date, tags, organizers, and price range.
-   **Tags (`/dashboard/tags`):** A page to view all event tags, styled in a "Flowing Pill" layout. New tags can be created via a popup dialog form.
-   **Organizers (`/dashboard/orgs`):** A page to view all event organizers in a "Detailed List" layout. New organizers can be created via a popup dialog.
-   **People (`/dashboard/people`):** A page to view all associated people (judges, contacts) in a "Business Card" grid layout. New people can be added via a popup dialog.

## Next Steps (TODO)

The foundational frontend is largely complete. The next major phase of work involves:

-   **API Integration:**
    -   Replace all dummy data and simulated `fetch` calls with live API integration.
    -   Use TanStack Query's `queryClient.invalidateQueries` to automatically refresh data after creating or deleting items.
-   **Build Out Remaining Pages:**
    -   Implement the "Edit" functionality for Events, Tags, Organizers, and People.
    -   Build the UI for the remaining placeholder pages (Participants, Revenue, Students, Announcements).
-   **Finalize Analytics:** Connect the charts on the main dashboard to real data.
-   **Re-enable Authentication:** Uncomment the `beforeLoad` guard in `src/routes/dashboard.tsx` to protect the dashboard routes in production.