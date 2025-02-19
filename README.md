# Backend API for Supabase Project

## Prerequisites
- Node.js (v18+)
- npm

## Setup
1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your Supabase credentials
3. Install dependencies: `npm install`

## Development
- Start development server: `npm run dev`
- Build project: `npm run build`
- Start production server: `npm start`

## Testing
- Run tests: `npm test`

## Technologies
- Express.js
- TypeScript
- Supabase
- Jest (testing)

## Project Structure
- `src/`: Source code
  - `config/`: Configuration files
  - `controllers/`: Route handlers
  - `routes/`: API route definitions
  - `models/`: Data models
  - `types/`: TypeScript type definitions
- `dist/`: Compiled JavaScript files

## Environment Variables
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase API key
- `PORT`: Server port (default: 3000)
