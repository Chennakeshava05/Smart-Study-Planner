const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { db, initializeDatabase } = require('./database');
const { router: authRoutes, authenticateToken } = require('./authRoutes');
const historyRoutes = require('./historyRoutes');
const adminRoutes = require('./adminRoutes');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

// Initialize database
initializeDatabase();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Authentication routes
app.use('/api/auth', authRoutes);

// History routes
app.use('/api/history', historyRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

app.post('/api/generate-schedule', authenticateToken, async (req, res) => {
  try {
    const { subject, topics, duration_hours, difficulty } = req.body;
    
    console.log('Received schedule request:', { subject, topics, duration_hours, difficulty });
    
    const prompt = `Create a detailed study schedule for ${subject}.
Topics to cover: ${topics.join(', ')}
Total study time: ${duration_hours} hours
Difficulty level: ${difficulty}

Please provide a structured schedule with time slots, specific activities, and breaks.
Format the response as JSON with the following structure:
{
  "schedule": [
    {
      "time": "HH:MM - HH:MM",
      "activity": "description",
      "topic": "specific topic",
      "duration_minutes": number
    }
  ],
  "tips": ["tip1", "tip2"]
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const scheduleText = response.text();
    
    console.log('Raw response from Gemini:', scheduleText);
    
    // Extract JSON from response (Gemini may add extra text)
    const jsonMatch = scheduleText.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : scheduleText;
    
    console.log('Extracted JSON text:', jsonText);
    
    const parsedResult = JSON.parse(jsonText);
    
    console.log('Parsed result:', parsedResult);
    
    // Save to database for logged-in user
    const sessionId = uuidv4();
    const userId = req.user.userId;
    
    db.run(
      'INSERT INTO study_sessions (id, user_id, subject, topics, duration_hours, difficulty, generated_schedule) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [sessionId, userId, subject, JSON.stringify(topics), duration_hours, difficulty, JSON.stringify(parsedResult)],
      function(err) {
        if (err) {
          console.error('Error saving study session:', err);
          // Still return the result even if saving fails
        } else {
          console.log('Study session saved successfully');
        }
      }
    );
    
    res.json(parsedResult);
  } catch (error) {
    console.error('Error generating schedule:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message, details: error.stack });
  }
});

app.post('/api/generate-quiz', authenticateToken, async (req, res) => {
  try {
    const { subject, topics, num_questions, difficulty } = req.body;
    
    console.log('Received quiz request:', { subject, topics, num_questions, difficulty });
    
    const prompt = `Create a quiz for ${subject}.
Topics: ${topics.join(', ')}
Number of questions: ${num_questions}
Difficulty: ${difficulty}

Generate multiple choice questions. Format as JSON:
{
  "quiz": [
    {
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A",
      "explanation": "explanation"
    }
  ]
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const quizText = response.text();
    
    console.log('Raw response from Gemini:', quizText);
    
    // Extract JSON from response (Gemini may add extra text)
    const jsonMatch = quizText.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : quizText;
    
    console.log('Extracted JSON text:', jsonText);
    
    const parsedResult = JSON.parse(jsonText);
    
    console.log('Parsed result:', parsedResult);
    
    // Save to database for logged-in user
    const sessionId = uuidv4();
    const userId = req.user.userId;
    
    db.run(
      'INSERT INTO quiz_sessions (id, user_id, subject, topics, num_questions, difficulty, generated_quiz) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [sessionId, userId, subject, JSON.stringify(topics), num_questions, difficulty, JSON.stringify(parsedResult)],
      function(err) {
        if (err) {
          console.error('Error saving quiz session:', err);
          // Still return the result even if saving fails
        } else {
          console.log('Quiz session saved successfully');
        }
      }
    );
    
    res.json(parsedResult);
  } catch (error) {
    console.error('Error generating quiz:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message, details: error.stack });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
