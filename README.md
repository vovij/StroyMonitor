# СтройМонитор - Construction Project Cost Monitoring System

A modern web application for tracking and managing construction project costs, built with React, TypeScript, and Supabase.

## 🏗️ Features

- **Project Management**: Create and manage multiple construction projects
- **Cost Tracking**: Track expenses by categories (materials, labor, equipment, etc.)
- **Budget Control**: Monitor budget usage and get real-time analytics
- **User Authentication**: Secure email-based authentication with confirmation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Data**: Live updates using Supabase real-time subscriptions

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm or yarn package manager
- A Supabase account

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd construction-cost-monitor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

The project includes migration files in the `supabase/migrations/` directory. To set up your database:

1. Install Supabase CLI (optional, for local development):
```bash
npm install -g supabase
```

2. Run the migrations in your Supabase dashboard SQL editor, or use the CLI:
```bash
supabase db reset
```

The migrations will create:
- `profiles` table for user profiles
- `projects` table for construction projects
- `cost_categories` table with predefined categories
- `cost_entries` table for expense tracking
- Row Level Security (RLS) policies
- Sample data for testing

### 5. Configure Email Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Enable "Confirm email" under Email Auth
3. Set up custom email templates using the provided templates in `email-templates/`
4. Configure your SMTP settings or use Supabase's built-in email service

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── Layout.tsx       # Main layout component
│   ├── ProjectCard.tsx  # Project display component
│   ├── CostForm.tsx     # Cost entry form
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useProjects.ts   # Projects management hook
│   └── useCosts.ts      # Cost tracking hook
├── lib/                 # Utilities and configurations
│   ├── supabase.ts      # Supabase client setup
│   └── database.types.ts # TypeScript database types
└── App.tsx              # Main application component

supabase/
└── migrations/          # Database migration files

email-templates/         # Custom email templates
├── confirmation.html    # Email confirmation template
└── confirmation-simple.html # Simplified version
```

## 🗄️ Database Schema

### Tables

- **profiles**: User profile information
- **projects**: Construction project details
- **cost_categories**: Predefined expense categories
- **cost_entries**: Individual cost records

### Key Features

- Row Level Security (RLS) enabled on all tables
- Automatic profile creation on user signup
- Foreign key relationships for data integrity
- Timestamps for audit trails

## 🔐 Authentication Flow

1. User registers with email and password
2. Email confirmation sent automatically
3. User confirms email to activate account
4. Profile created automatically upon confirmation
5. User can access the application

## 🎨 Design System

The application uses a custom design system built with Tailwind CSS:

- **Colors**: Blue primary, semantic colors for status
- **Typography**: System fonts with proper hierarchy
- **Spacing**: 8px grid system
- **Components**: Consistent button styles, form inputs, cards
- **Responsive**: Mobile-first approach with breakpoints

## 📱 Usage

### Creating a Project

1. Click "Новый проект" (New Project)
2. Fill in project name, description, and budget
3. Click "Создать проект" (Create Project)

### Adding Costs

1. Select a project from the dashboard
2. Click "Добавить затрату" (Add Cost)
3. Choose category, enter amount and description
4. Submit the form

### Monitoring Budget

- View real-time budget usage on project cards
- See detailed breakdown in project view
- Track spending by category with visual charts

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify/Vercel

1. Connect your repository to your hosting platform
2. Set environment variables in the hosting dashboard
3. Deploy with build command: `npm run build`
4. Set publish directory to: `dist`

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting (recommended)
- Conventional commits for git history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify your Supabase configuration
3. Ensure all environment variables are set correctly
4. Check that email confirmation is properly configured

## 🔄 Updates

To update the project:

```bash
git pull origin main
npm install
npm run dev
```

---

**СтройМонитор** - Эффективное управление затратами строительных проектов 🏗️