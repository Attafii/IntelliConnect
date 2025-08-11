# IntelliConnect Dashboard

IntelliConnect is a modern, comprehensive project management dashboard built with cutting-edge web technologies. It provides a sophisticated interface for managing projects, tracking financials, monitoring resources, and gaining intelligent insights through AI-powered analytics.

## 🚀 Key Features

### 🎨 **Modern UI & Design**
- **Glassmorphism Interface**: Beautiful glass-morphism design with blur effects
- **Blue-to-White Gradient**: Elegant gradient background for modern aesthetics
- **Smooth Animations**: Framer Motion powered animations and transitions
- **3D Elements**: Interactive Spline 3D models and custom geometric shapes
- **Responsive Design**: Fully responsive across all device sizes

### 🧭 **Navigation & Layout**
- **Animated Navbar**: Fixed top navigation with slide-down animations and hover effects
- **Smart Sidebar**: Collapsible sidebar with gradient text and smooth transitions
- **Role-Based Interface**: Dynamic content based on user roles and permissions
- **Route Transitions**: Smooth page transitions between different sections

### 📊 **Dashboard Modules**
- **Project Overview**: Interactive grid view with filtering and status tracking
- **Financial Analytics**: Budget tracking, cost analysis, and financial forecasting
- **KPI Dashboard**: Real-time key performance indicators with comparison tables
- **Milestone Timeline**: Visual project timeline with progress tracking
- **Resource Management**: Team allocation and resource utilization monitoring
- **Risk Assessment**: Risk identification and mitigation tracking

### 🤖 **AI-Powered Features**
- **Chatbot Assistant**: Multilingual AI assistant (English, French, Tunisian Arabic)
- **Global Search**: Intelligent search across all data and pages
- **Document Intelligence**: AI-powered document analysis and insights
- **Predictive Analytics**: Forecast trends and identify potential issues

### 🔔 **Interactive Components**
- **Notification Center**: Real-time notifications with filtering and management
- **Toast System**: Elegant notification toasts for user feedback
- **Modal System**: Advanced modal dialogs for file uploads and settings
- **Loading States**: Beautiful shimmer effects and loading animations

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14**: React framework with App Router and Server Components
- **TypeScript**: Type-safe development for better code quality
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Framer Motion**: Advanced animations and micro-interactions
- **Spline**: 3D models and interactive graphics

### **UI Components**
- **Radix UI**: Accessible, unstyled UI primitives
- **Lucide Icons**: Beautiful, customizable SVG icons
- **Heroicons**: Additional icon set for enhanced UI
- **React Three Fiber**: 3D graphics and animations

### **Development Tools**
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization
- **Canvas**: Advanced graphics and image processing

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### **Installation**

1. **Clone the repository:**
```bash
git clone https://github.com/Attafii/IntelliConnect.git
cd IntelliConnect
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

5. **Start developing:**
Edit `src/app/page.tsx` or any component file. The application will hot-reload automatically.

## 📁 Project Structure

```
IntelliConnect/
├── 📁 public/                  # Static assets
│   ├── 🖼️ intlogo.png         # Application logo
│   ├── 🖼️ Navlogo.png         # Navigation logo
│   └── 🎨 *.svg               # Vector icons and assets
├── 📁 src/
│   ├── 📁 app/                 # Next.js App Router
│   │   ├── 📁 api/             # API Routes
│   │   │   ├── 📊 analysis/    # Document analysis endpoints
│   │   │   ├── 💰 financials/  # Financial data API
│   │   │   ├── 📋 projects/    # Project management API
│   │   │   └── 👥 resources/   # Resource management API
│   │   ├── 📁 components/      # Page-specific components
│   │   │   ├── 🤖 ChatbotAssistant.tsx
│   │   │   ├── 🔍 GlobalSearch.tsx
│   │   │   ├── 🔔 NotificationCenter.tsx
│   │   │   ├── 🏠 SimpleLayout.tsx
│   │   │   ├── 🧭 SimpleNavbar.tsx
│   │   │   ├── 📊 SplineModels.tsx
│   │   │   └── 🎨 Modern3DShape.tsx
│   │   ├── 📁 data/            # Mock JSON data
│   │   │   ├── 📊 projects.json
│   │   │   ├── 💰 financials.json
│   │   │   └── 👥 resources.json
│   │   ├── 📁 financials/      # Financial dashboard
│   │   ├── 📁 intelligence/    # AI-powered insights
│   │   ├── 📁 kpis/           # KPI dashboard
│   │   ├── 📁 milestones/     # Timeline management
│   │   ├── 📁 overview/       # Project overview
│   │   ├── 📁 resources/      # Resource management
│   │   ├── 📁 risks/          # Risk assessment
│   │   ├── 🎨 globals.css     # Global styles & animations
│   │   └── 📄 layout.tsx      # Root layout component
│   ├── 📁 components/         # Shared UI components
│   │   └── 📁 ui/             # Radix UI components
│   └── 📁 lib/                # Utilities and helpers
├── ⚙️ next.config.ts          # Next.js configuration
├── 🎨 tailwind.config.ts      # Tailwind CSS config
├── 📦 package.json            # Dependencies and scripts
└── 📖 README.md               # Documentation
```

## 🔗 API Endpoints

The application provides RESTful API endpoints for data management:

### **Core Data APIs**
- **`GET /api/projects`** - Retrieve all projects with status and metadata
- **`GET /api/financials`** - Get financial data and budget information
- **`GET /api/resources`** - Fetch resource allocation and team data

### **AI & Analytics APIs**
- **`POST /api/analysis/upload`** - Upload documents for AI analysis
- **`POST /api/analysis/chat`** - Chat with AI about uploaded documents

### **Example API Usage**

**Get all projects:**
```bash
curl http://localhost:3000/api/projects
```

**Generic API call:**
```bash
curl -X POST <API_URL> \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

## 🤖 AI Features

### **Chatbot Assistant**
- **Multilingual Support**: English, French, and Tunisian Arabic
- **Voice Synthesis**: Text-to-speech capabilities
- **Smart Suggestions**: Context-aware response suggestions
- **Animated Interface**: Smooth animations and transitions

### **Global Search**
- **Universal Search**: Search across projects, financials, resources, and pages
- **Keyboard Navigation**: Arrow keys and Enter to select
- **Real-time Results**: Instant search results as you type
- **Categorized Results**: Results grouped by type and relevance

### **Document Intelligence**
- **File Support**: PDF and CSV document analysis
- **AI Summarization**: Automatic extraction of key insights
- **Interactive Q&A**: Chat with your documents
- **Predictive Analytics**: Identify potential issues and opportunities

## 🎨 Design System

### **Colors & Themes**
- **Primary Gradient**: Blue to white gradient background
- **Glass Morphism**: Translucent elements with backdrop blur
- **Modern Palette**: Carefully curated color scheme
- **Dark Mode Ready**: Prepared for future dark theme support

### **Typography**
- **Geist Font**: Modern, readable typography
- **Font Weights**: Regular, medium, semibold, and bold variants
- **Responsive Text**: Scales appropriately across devices

### **Animations**
- **Page Transitions**: Smooth route transitions
- **Micro-interactions**: Hover effects and button animations
- **Loading States**: Elegant shimmer effects
- **3D Elements**: Interactive geometric shapes and Spline models

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy with automatic CI/CD

### **Other Platforms**
- **Netlify**: Full Next.js support
- **Railway**: Easy deployment with Git integration
- **Docker**: Containerized deployment option

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### **Code Standards**
- **TypeScript**: All new code should use TypeScript
- **ESLint**: Follow the existing linting rules
- **Component Structure**: Use functional components with hooks
- **Styling**: Prefer Tailwind CSS classes over custom CSS

### **Component Guidelines**
- **Reusable Components**: Place in `src/components/ui/`
- **Page Components**: Place in `src/app/components/`
- **Props Interface**: Always define TypeScript interfaces for props
- **Documentation**: Add JSDoc comments for complex components

## 📖 Learn More

### **Next.js Resources**
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub](https://github.com/vercel/next.js/) - Source code and community

### **Design Resources**
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help:
- 📧 **Email**: [Contact](mailto:your-email@example.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Attafii/IntelliConnect/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Attafii/IntelliConnect/discussions)

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
