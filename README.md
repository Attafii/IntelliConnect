This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## IntelliConnect Dashboard

IntelliConnect is a modern project management dashboard built with Next.js, Tailwind CSS, and Framer Motion. It features a glassmorphism UI, smooth animations, and provides a comprehensive overview of project statuses, financials, resources, and more.

### Features

*   **Project Overview**: Filterable and role-based grid view of projects.
*   **Milestone Timeline**: Horizontal scrollable timeline of project milestones.
*   **KPI Comparison**: Sortable table for Key Performance Indicators.
*   **Action Item List**: Animated list of tasks with status indicators.
*   **Predictions Panel**: Charts for CM trend, resource shortages, and forecast confidence.
*   **📁 Project Intelligence Agent**: Upload project documents (.csv, .pdf) for automated summary, insights, and Q&A.
*   **Mock API Backend**: Serves data from JSON files for easy development and testing.
*   **Theming**: Styled with Capgemini's color palette.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Structure

Key directories and files:

```
IntelliConnect/
├── public/                     # Static assets (images, icons)
│   ├── favicon.svg             # Site icon (replace with your own)
│   └── ...
├── src/
│   ├── app/
│   │   ├── api/                # Next.js API Routes
│   │   │   ├── projects/route.ts
│   │   │   ├── financials/route.ts
│   │   │   └── resources/route.ts
│   │   ├── components/         # Reusable UI components for specific pages or layouts
│   │   ├── data/               # Mock JSON data files
│   │   │   ├── projects.json
│   │   │   ├── financials.json
│   │   │   └── resources.json
│   │   ├── overview/           # Overview page components and logic
│   │   ├── intelligence/       # Project Intelligence Agent page
│   │   ├── milestones/         # Milestones page
│   │   ├── kpis/               # KPIs page
│   │   ├── financials/         # Financials page (placeholder)
│   │   ├── resources/          # Resources page (placeholder)
│   │   ├── risks/              # Risks page (placeholder)
│   │   ├── globals.css         # Global styles and Tailwind directives
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Shared UI components (e.g., Shadcn UI)
│   │   └── ui/
│   └── lib/                    # Utility functions
├── tailwind.config.ts          # Tailwind CSS configuration
└── next.config.ts              # Next.js configuration
```

## API Routes

The application uses Next.js API routes to serve mock data from JSON files located in `src/app/data/`.

*   `GET /api/projects`: Returns a list of all projects.
*   `GET /api/financials`: Returns financial data for projects.
*   `GET /api/resources`: Returns resource allocation data.
*   `POST /api/analysis/upload`: Handles project file uploads for the Intelligence Agent.
*   `POST /api/analysis/chat`: Handles chat messages for the Intelligence Agent.

These can be extended or replaced with a real backend integration.

## 📁 Project Intelligence Agent

The Project Intelligence Agent is a new feature designed to help you quickly understand and interact with your project documents.

**Purpose:**

*   Automate the extraction and summarization of key project data.
*   Provide a quick overview of project status, timelines, resources, budget, and risks.
*   Allow users to ask natural language questions about the uploaded document.

**Supported File Types:**

*   `.csv` (Comma Separated Values)
*   `.pdf` (Portable Document Format)

**How to Use:**

1.  Navigate to the **Intelligence** page from the sidebar.
2.  Use the upload section to select a `.csv` or `.pdf` file from your computer.
3.  Once uploaded, the system will analyze the file and display:
    *   An **Intelligence Summary** with key data points (Project Name, Timeline, Tasks, Resources, Budget, Risks).
    *   A **Predictive Insights Panel** (if data allows) with potential delays or CM risks.
4.  Use the **Chat Interface** below the summary to ask questions about the content of the uploaded file (e.g., "What are the current risks?", "Summarize the project budget.").

**Note on GenAI Integration:**

The chat functionality currently uses placeholder responses. The backend API route `/api/analysis/chat` is set up, but the actual Generative AI model integration for advanced Q&A is pending future development.

## Site Icon

The site icon (favicon) can be replaced by updating the `favicon.svg` (or `.png`, `.ico`, etc.) file in the `/public` directory. Next.js will automatically pick up a file named `icon.*` or `favicon.*` from the `app` or `public` directory. The previous `src/app/favicon.ico` has been removed to allow the new icon in `/public` to take precedence.

To use the image you provided as the site icon:
1.  Save the image as `favicon.svg` (recommended for vector) or `favicon.png` in the `public` folder.
2.  If you use a different name or want to specify multiple icon sizes/types, you can update the `metadata` object in `src/app/layout.tsx`:
    ```typescript
    // src/app/layout.tsx
    export const metadata: Metadata = {
      title: "IntelliConnect - Modern Dashboard",
      description: "A modern dashboard with glassmorphism UI and smooth animations",
      icons: {
        icon: '/path/to/your/icon.svg', // e.g., '/favicon.svg'
        // apple: '/apple-icon.png',
        // other icons...
      },
    };
    ```

## Contributing

Contributions are welcome! Please follow these general guidelines:

1.  **Branching**: Create a new branch for each feature or bug fix (e.g., `feature/new-chart` or `fix/login-bug`).
2.  **Coding Style**: Follow the existing code style and conventions. Use Prettier and ESLint if configured.
3.  **Components**: Create reusable components where possible. Place shared UI components in `src/components/ui` and page-specific or layout components in `src/app/components`.
4.  **Data Fetching**: For new dashboard sections requiring data, create a new JSON file in `src/app/data/` and a corresponding API route in `src/app/api/`.
5.  **Commits**: Write clear and concise commit messages.
6.  **Pull Requests**: Submit a pull request to the main branch for review.

### Dependencies for New Components

If you are adding new components that rely on charting libraries or icon sets, please note the following dependencies used in recent additions:

*   **Recharts**: For charts and graphs (e.g., in `PredictionsPanel`). Install with `npm install recharts`.
*   **Lucide React**: For icons. Install with `npm install lucide-react`.

Ensure these are installed if you are working with or extending components that use them.

## Example: Generic API Call with curl

You can use curl to call any API endpoint. Replace `<API_URL>` and `<DATA>` as needed:

```bash
curl -X POST <API_URL> \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

For GET requests:

```bash
curl <API_URL>
```
