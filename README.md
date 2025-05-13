# Diplomat Corner

Diplomat Corner is a specialized marketplace platform designed exclusively for diplomats in Ethiopia. The platform facilitates hassle-free transactions for duty-free goods, housing, and more, connecting diplomatic community members in a secure and efficient environment.

## Features

- **Car Listings**

  - Browse cars for rent and sale
  - Detailed car specifications and images
  - Advanced filtering and sorting options
  - Real-time availability updates

- **House Listings**

  - View houses and apartments for rent
  - Property details with amenities
  - Location-based search
  - Virtual tours and image galleries

- **User Features**

  - Secure authentication with Clerk
  - User profiles and preferences
  - Favorite listings
  - Notification system
  - Review and rating system

- **Admin Features**
  - Listing management
  - User management
  - Content moderation
  - Analytics dashboard

## Tech Stack

- **Frontend**

  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Clerk Authentication
  - Shadcn UI Components

- **Backend**
  - Next.js API Routes
  - MongoDB
  - WebSocket for real-time features

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Clerk account for authentication

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Other Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/your-username/diplomat-corner.git
cd diplomat-corner
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

- Copy `.env.example` to `.env.local`
- Fill in the required environment variables

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
diplomat-corner/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (root)/            # Main application routes
│   └── api/               # API routes
├── components/            # React components
│   ├── car/              # Car-related components
│   ├── house/            # House-related components
│   ├── ui/               # UI components
│   └── ...
├── lib/                   # Utility functions and configurations
├── public/               # Static assets
└── styles/              # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

The application can be deployed on Vercel:

1. Push your code to GitHub
2. Import your repository on Vercel
3. Configure environment variables
4. Deploy

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@diplomatcorner.com or join our Slack channel.

## Acknowledgments

- Next.js team for the amazing framework
- Clerk for authentication services
- MongoDB for database services
- All contributors who have helped shape this project
