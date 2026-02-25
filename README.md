# TypeRacer Tonik Coding Challenge

A real-time multiplayer typing game built with Next.js and Socket.io.

## Getting Started

```bash
# Install dependencies
npm install

# Start the Socket.io server
npm run dev:server

# Start the Next.js client (in a separate terminal)
npm run dev:web
```

## Project Structure

This project is organized as a monorepo using npm workspaces, with separate applications for the server and web client:

```
apps/
├── server/     # Socket.io server
└── web/        # Next.js frontend
```

This structure enables independent deployment to platforms like Vercel while maintaining a unified codebase. Both applications can be developed, built, and deployed separately.

## Technology Choices

### Socket.io for Real-time Communication

Socket.io was chosen for real-time features because it is a library I am already familiar with and comfortable using.

This approach avoids expensive third-party alternatives like Firebase or Supabase, reducing infrastructure costs while maintaining professional-grade real-time capabilities.

## Random Sentence Generator

This project uses a dynamic sentence generator instead of a predefined list of sentences. This approach was chosen because it provides significantly more variety and replayability.

### How It Works

The generator combines words from four different categories:
- **Subjects** (10 options): The cat, A dog, The bird, etc.
- **Verbs** (10 options): quickly runs, slowly walks, carefully writes, etc.
- **Objects** (10 options): through the park, across the street, in the library, etc.
- **Endings** (10 options): every morning, on sunny days, during the weekend, etc.

This means the generator can create **10 × 10 × 10 × 10 = 10,000 different sentences** from just 40 words total, providing much more variety than a static list.

## Browser Storage

Player stats (games played, average WPM, average accuracy) are persisted in `localStorage` so progress is retained across sessions without requiring a backend database.

## AI Usage

AI was used to generate the word lists for the sentence generator. Beyond that, AI was primarily used for chat completions and error fixing and creating UI theme.
