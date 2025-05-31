# FinStack Task Assignment

A modern web application built with Next.js, Firebase, and Tailwind CSS for managing and tracking tasks.

## Features

- Modern UI with Tailwind CSS and Radix UI components
- Real-time data synchronization with Firebase
- Responsive design for all devices
- Type-safe development with TypeScript
- Form validation with React Hook Form and Zod
- Beautiful charts and data visualization with Recharts

## Tech Stack

- **Frontend Framework**: Next.js 15.2.3
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: Firebase
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Type Safety**: TypeScript

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/agkhushi/FinStack_TaskAssignment.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app`: Next.js app router pages and layouts
- `/src/components`: Reusable UI components
- `/src/lib`: Utility functions and configurations
- `/public`: Static assets

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint
- `npm run typecheck`: Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
