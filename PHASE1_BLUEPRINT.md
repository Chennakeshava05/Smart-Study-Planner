# Smart Study Planner with AI-Generated Schedule and Quiz Generation
## Phase 1: Blueprint Documentation

---

### 1. Define the Problem

**Problem Statement:** Students struggle to create effective, personalized study schedules and assessments that match their learning pace and knowledge gaps, leading to inefficient studying and poor academic performance.

**Who is affected:** High school and college students aged 15-25 who need to study multiple subjects with varying difficulty levels and time constraints.

**What goes wrong today:** 
- Students create generic study plans that don't adapt to their individual learning needs
- Manual quiz creation is time-consuming and often doesn't target specific knowledge gaps
- Lack of personalized study tips and progress tracking
- Difficulty balancing multiple subjects with optimal time allocation

---

### 2. Sketch the Solution

**Approach Overview:** 
Create an AI-powered web application that generates personalized study schedules and quizzes based on individual student needs, learning preferences, and academic goals.

**Core Thinking:**
- **Personalization Engine:** Use AI to analyze student inputs (subjects, topics, difficulty, time constraints) and generate tailored study plans
- **Adaptive Learning:** Create quizzes that adapt to student performance and provide targeted practice
- **Time Optimization:** Intelligently allocate study time across subjects based on difficulty and importance
- **Progress Tracking:** Monitor student performance and provide actionable insights for improvement

**Key Design Principles:**
- Simple input → Complex AI output
- Immediate feedback and results
- Mobile-first responsive design
- Minimal cognitive overhead for users

---

### 3. Confirm Technology Stack

**Frontend Technologies:**
- ✅ React 18.2.0 - Component-based UI framework
- ✅ Vite 5.0.8 - Fast development server and build tool
- ✅ Tailwind CSS 3.4.1 - Utility-first CSS framework
- ✅ HTML5/CSS3/JavaScript - Core web technologies

**Backend Technologies:**
- ✅ Node.js 24.15.0 - JavaScript runtime
- ✅ Express 4.18.2 - Web framework for API
- ✅ Google Generative AI (@google/generative-ai 0.21.0) - AI model integration
- ✅ CORS 2.8.5 - Cross-origin resource sharing
- ✅ dotenv 16.3.1 - Environment variable management

**External APIs:**
- ✅ Google Gemini AI API - For generating study schedules and quizzes
- ✅ Valid API key: AIzaSyBCNQuANVzNBW0mu1pAI_aSqQHyDAGxtg8

**Development Tools:**
- ✅ npm - Package management
- ✅ nodemon 3.0.2 - Development server auto-restart
- ✅ PostCSS 8.4.33 + Autoprefixer 10.4.17 - CSS processing

**Validation Status:** All tools are installed, configured, and accessible. API key is valid and tested.

---

### 4. Set Success Criteria

**Measurable Outcome 1:**
"We will know this worked if users can generate a complete study schedule within 10 seconds of submitting their subject, topics, duration, and difficulty level."

**Measurable Outcome 2:** 
"We will know this worked if the generated quizzes achieve a minimum 80% user satisfaction rate based on relevance to topics and appropriate difficulty matching."

**Measurable Outcome 3:**
"We will know this worked if the application maintains a 95% uptime with sub-2-second response times for AI generation requests during normal usage periods."

---

### 5. Architecture Diagram

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│   Frontend      │ ◄─────────────────► │   Backend       │
│                 │                     │                 │
│ React + Vite    │                     │ Node.js +       │
│ Tailwind CSS    │                     │ Express         │
│                 │                     │                 │
│ - Form Inputs   │                     │ - API Endpoints │
│ - Results UI    │                     │ - Gemini AI     │
│ - State Mgmt    │                     │ - Error Handling│
└─────────────────┘                     └─────────────────┘
                                                │
                                                ▼
                                        ┌─────────────────┐
                                        │ Google Gemini   │
                                        │ AI API          │
                                        │                 │
                                        │ - Schedule      │
                                        │   Generation    │
                                        │ - Quiz          │
                                        │   Generation    │
                                        └─────────────────┘
```

**Data Flow:**
1. User submits form data (subject, topics, duration, difficulty)
2. Frontend sends POST request to backend API
3. Backend processes request and calls Google Gemini AI
4. AI generates structured JSON response
5. Backend parses and forwards response to frontend
6. Frontend displays formatted results to user

---

### 6. Database Schema Draft

**Current State:** Stateless application (no persistent database)

**Future Enhancement Schema:**
```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    preferences JSON
);

-- Study Sessions Table
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    subject VARCHAR(255),
    topics JSON,
    duration_hours INTEGER,
    difficulty VARCHAR(50),
    generated_schedule JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Sessions Table
CREATE TABLE quiz_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    subject VARCHAR(255),
    topics JSON,
    num_questions INTEGER,
    difficulty VARCHAR(50),
    generated_quiz JSON,
    user_answers JSON,
    score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Progress Table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    subject VARCHAR(255),
    topic VARCHAR(255),
    mastery_level FLOAT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 7. Figma/Excalidraw Wireframe Description

**Main Layout Structure:**

**Header Section:**
- App title: "📚 Smart Study Planner"
- Subtitle: "AI-Powered Schedule & Quiz Generation"
- Gradient background (indigo → purple → pink)

**Navigation Tabs:**
- Study Schedule (active/inactive states)
- Quiz Generator (active/inactive states)
- Full-width tab bar with hover effects

**Study Schedule Form:**
- Subject input field (text)
- Topics input field (comma-separated text)
- Duration slider (1-24 hours)
- Difficulty dropdown (Beginner/Intermediate/Advanced)
- Generate Schedule button (gradient style)

**Quiz Generator Form:**
- Subject input field (text)
- Topics input field (comma-separated text)
- Number of questions input (1-20)
- Difficulty dropdown (Beginner/Intermediate/Advanced)
- Generate Quiz button (gradient style)

**Results Display Areas:**
- Schedule results: Time blocks with activity, topic, duration
- Quiz results: Multiple choice questions with interactive options
- Study tips section (yellow highlight box)
- Score display (for completed quizzes)

**Visual Design Elements:**
- Rounded corners (border-radius: 1rem+)
- Gradient buttons and headers
- Card-based layout with shadows
- Responsive grid system
- Loading states and error messages
- Color-coded feedback (green for correct, red for incorrect)

**Mobile Responsiveness:**
- Single column layout on mobile
- Stacked form elements
- Touch-friendly button sizes
- Readable typography scaling

---

## Next Steps

**Phase 2:** Implementation
- [ ] Enhance UI/UX based on wireframe
- [ ] Add error handling and validation
- [ ] Implement user authentication (optional)
- [ ] Add progress tracking features
- [ ] Deploy to production environment

**Phase 3:** Analytics & Optimization
- [ ] Add usage analytics
- [ ] Implement A/B testing
- [ ] Optimize AI prompts for better results
- [ ] Add user feedback collection

---

*This blueprint serves as the foundation for developing a comprehensive AI-powered study planning application that addresses real student needs with measurable outcomes.*
