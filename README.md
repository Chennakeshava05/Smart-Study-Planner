# Smart Study Planner with AI-Generated Schedule and Quiz Generation

A web application that uses AI to generate personalized study schedules and quizzes based on your subjects, topics, and preferences.

## Features

- **AI-Powered Study Schedules**: Generate detailed study schedules with time slots, activities, and study tips
- **Quiz Generation**: Create multiple-choice quizzes on any topic with instant feedback and explanations
- **Customizable Difficulty**: Choose from beginner, intermediate, or advanced difficulty levels
- **Modern UI**: Beautiful, responsive interface with smooth interactions

## Tech Stack

### Backend
- Node.js with Express
- OpenAI API for AI generation
- CORS for cross-origin requests

### Frontend
- Pure HTML, CSS, and JavaScript
- No framework dependencies for easy setup
- Responsive design with modern styling

## Setup Instructions

### 1. Backend Setup

Navigate to the BackEnd directory:
```bash
cd BackEnd
```

Install dependencies:
```bash
npm install
```

Set up your OpenAI API key:
- Copy `.env.example` to `.env`
- Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY=your_actual_api_key_here
PORT=5000
```

Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

Navigate to the FrontEnd directory:
```bash
cd FrontEnd
```

Start a simple HTTP server:
```bash
# Using Python 3
python -m http.server 3000

# Or using Node.js (if you have http-server installed)
npx http-server -p 3000
```

The frontend will run on `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Generate Study Schedule

1. Click on the "Study Schedule" tab
2. Enter your subject (e.g., Mathematics, Physics)
3. List topics separated by commas (e.g., Algebra, Calculus, Statistics)
4. Set the duration in hours
5. Choose difficulty level
6. Click "Generate Schedule"
7. View your personalized schedule with study tips

### Generate Quiz

1. Click on the "Quiz Generator" tab
2. Enter your subject
3. List topics
4. Set the number of questions
5. Choose difficulty level
6. Click "Generate Quiz"
7. Answer the questions by clicking on options
8. Submit to see your score and explanations

## API Endpoints

### POST /api/generate-schedule
Generates a study schedule based on input parameters.

**Request Body:**
```json
{
  "subject": "Mathematics",
  "topics": ["Algebra", "Calculus"],
  "duration_hours": 2,
  "difficulty": "intermediate"
}
```

**Response:**
```json
{
  "schedule": [
    {
      "time": "09:00 - 09:30",
      "activity": "Review concepts",
      "topic": "Algebra",
      "duration_minutes": 30
    }
  ],
  "tips": ["tip1", "tip2"]
}
```

### POST /api/generate-quiz
Generates a quiz based on input parameters.

**Request Body:**
```json
{
  "subject": "Mathematics",
  "topics": ["Algebra", "Calculus"],
  "num_questions": 5,
  "difficulty": "intermediate"
}
```

**Response:**
```json
{
  "quiz": [
    {
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correct_answer": "4",
      "explanation": "2 + 2 equals 4"
    }
  ]
}
```

## Requirements

- Node.js (v14 or higher)
- Python (for serving frontend, or use any HTTP server)
- OpenAI API key

## Troubleshooting

### Backend not starting
- Ensure all dependencies are installed with `npm install`
- Check that port 5000 is not already in use
- Verify your OpenAI API key is correct in the `.env` file

### Frontend not loading
- Ensure the HTTP server is running on port 3000
- Check that the backend is running on port 5000
- Verify CORS is properly configured in the backend

### API errors
- Check your OpenAI API key has credits available
- Verify the API key is correctly set in the `.env` file
- Check browser console for specific error messages

## License

MIT License - feel free to use this project for learning and development.
