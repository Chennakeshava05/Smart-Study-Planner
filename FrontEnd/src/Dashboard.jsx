import { useState } from 'react';
import { useAuth } from './AuthContext';
import History from './History';
import AdminDashboard from './AdminDashboard';
import Share from './Share';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('schedule')
  const [scheduleForm, setScheduleForm] = useState({
    subject: '',
    topics: '',
    duration_hours: 2,
    difficulty: 'intermediate'
  })
  const [quizForm, setQuizForm] = useState({
    subject: '',
    topics: '',
    num_questions: 5,
    difficulty: 'intermediate'
  })
  const [scheduleResult, setScheduleResult] = useState(null)
  const [quizResult, setQuizResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userAnswers, setUserAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const { user, logout, token, isAdmin } = useAuth();

  const API_URL = '/api';

  const generateSchedule = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setScheduleResult(null)

    try {
      const response = await fetch(`${API_URL}/generate-schedule`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: scheduleForm.subject,
          topics: scheduleForm.topics.split(',').map(t => t.trim()),
          duration_hours: parseInt(scheduleForm.duration_hours),
          difficulty: scheduleForm.difficulty
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate schedule')
      }

      setScheduleResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateQuiz = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setQuizResult(null)
    setUserAnswers({})
    setQuizSubmitted(false)

    try {
      const response = await fetch(`${API_URL}/generate-quiz`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: quizForm.subject,
          topics: quizForm.topics.split(',').map(t => t.trim()),
          num_questions: parseInt(quizForm.num_questions),
          difficulty: quizForm.difficulty
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz')
      }

      setQuizResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionIndex, option) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }))
  }

  const submitQuiz = () => {
    setQuizSubmitted(true)
  }

  const calculateScore = () => {
    if (!quizResult) return 0
    let score = 0
    quizResult.quiz.forEach((q, index) => {
      if (userAnswers[index] === q.correct_answer) {
        score++
      }
    })
    return score
  }

  const generateQuizFromSchedule = async (schedule) => {
    setActiveTab('quiz')
    setQuizForm({
      subject: schedule.subject,
      topics: schedule.topics.join(', '),
      num_questions: 5,
      difficulty: schedule.difficulty
    })
    setError('')
    setQuizResult(null)
    setUserAnswers({})
    setQuizSubmitted(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 md:p-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">📚 Smart Study Planner</h1>
              <p className="text-lg md:text-xl opacity-90">AI-Powered Schedule & Quiz Generation</p>
            </div>
            <div className="text-right">
              <p className="text-lg opacity-90">Welcome, {user?.name || user?.email}</p>
              <button
                onClick={logout}
                className="mt-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <nav className={`flex bg-gray-100 border-b-2 border-gray-200 ${isAdmin ? 'flex-wrap' : ''}`}>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`${isAdmin ? 'flex-1' : 'flex-1'} py-5 px-4 font-semibold text-lg transition-all duration-300 ${
              activeTab === 'schedule'
                ? 'bg-white text-indigo-600 border-b-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Study Schedule
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`${isAdmin ? 'flex-1' : 'flex-1'} py-5 px-4 font-semibold text-lg transition-all duration-300 ${
              activeTab === 'quiz'
                ? 'bg-white text-indigo-600 border-b-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Quiz Generator
          </button>
          <button
            onClick={() => setActiveTab('schedule-history')}
            className={`${isAdmin ? 'flex-1' : 'flex-1'} py-5 px-4 font-semibold text-lg transition-all duration-300 ${
              activeTab === 'schedule-history'
                ? 'bg-white text-indigo-600 border-b-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Schedule History
          </button>
          <button
            onClick={() => setActiveTab('quiz-history')}
            className={`${isAdmin ? 'flex-1' : 'flex-1'} py-5 px-4 font-semibold text-lg transition-all duration-300 ${
              activeTab === 'quiz-history'
                ? 'bg-white text-indigo-600 border-b-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Quiz History
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-5 px-4 font-semibold text-lg transition-all duration-300 ${
                  activeTab === 'admin'
                    ? 'bg-white text-purple-600 border-b-4 border-purple-600'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                👑 Admin
              </button>
              <button
                onClick={() => setActiveTab('share')}
                className={`flex-1 py-5 px-4 font-semibold text-lg transition-all duration-300 ${
                  activeTab === 'share'
                    ? 'bg-white text-green-600 border-b-4 border-green-600'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                📤 Share
              </button>
            </>
          )}
        </nav>

        <div className="p-6 md:p-10">
          {activeTab === 'schedule' && (
            <div>
              <div className="bg-gray-50 p-6 md:p-8 rounded-2xl mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Generate Study Schedule</h2>
                <form onSubmit={generateSchedule} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={scheduleForm.subject}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, subject: e.target.value })}
                      placeholder="e.g., Mathematics, Physics, Chemistry"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Topics (comma-separated)</label>
                    <input
                      type="text"
                      value={scheduleForm.topics}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, topics: e.target.value })}
                      placeholder="e.g., Algebra, Calculus, Statistics"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (hours)</label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={scheduleForm.duration_hours}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, duration_hours: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={scheduleForm.difficulty}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, difficulty: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      required
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? 'Generating...' : 'Generate Schedule'}
                  </button>
                </form>
              </div>

              {loading && (
                <div className="text-center py-12 text-gray-600 text-lg">
                  Generating your study schedule ⏳
                </div>
              )}

              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
                  Error: {error}
                </div>
              )}

              {scheduleResult && (
                <div className="bg-gray-50 p-6 md:p-8 rounded-2xl">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Your Study Schedule</h2>
                  <div className="space-y-4">
                    {scheduleResult.schedule.map((item, index) => (
                      <div key={index} className="bg-white p-5 rounded-xl border-l-4 border-indigo-500 shadow-md">
                        <div className="font-bold text-indigo-600 text-lg mb-2">{item.time}</div>
                        <div className="text-gray-800 text-lg mb-1">{item.activity}</div>
                        <div className="text-gray-600 text-sm">Topic: {item.topic}</div>
                        <div className="text-green-600 font-semibold text-sm mt-2">Duration: {item.duration_minutes} minutes</div>
                      </div>
                    ))}
                  </div>
                  {scheduleResult.tips && scheduleResult.tips.length > 0 && (
                    <div className="bg-yellow-100 p-5 rounded-xl border-l-4 border-yellow-500 mt-6">
                      <h3 className="font-bold text-yellow-800 text-lg mb-4">Study Tips</h3>
                      <ul className="space-y-2">
                        {scheduleResult.tips.map((tip, index) => (
                          <li key={index} className="text-yellow-800">💡 {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div>
              <div className="bg-gray-50 p-6 md:p-8 rounded-2xl mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Generate Quiz</h2>
                <form onSubmit={generateQuiz} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={quizForm.subject}
                      onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value })}
                      placeholder="e.g., Mathematics, Physics, Chemistry"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Topics (comma-separated)</label>
                    <input
                      type="text"
                      value={quizForm.topics}
                      onChange={(e) => setQuizForm({ ...quizForm, topics: e.target.value })}
                      placeholder="e.g., Algebra, Calculus, Statistics"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Questions</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={quizForm.num_questions}
                      onChange={(e) => setQuizForm({ ...quizForm, num_questions: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={quizForm.difficulty}
                      onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                      required
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? 'Generating...' : 'Generate Quiz'}
                  </button>
                </form>
              </div>

              {loading && (
                <div className="text-center py-12 text-gray-600 text-lg">
                  Generating your quiz ⏳
                </div>
              )}

              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
                  Error: {error}
                </div>
              )}

              {quizResult && (
                <div className="bg-gray-50 p-6 md:p-8 rounded-2xl">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Your Quiz</h2>
                  
                  {quizSubmitted && (
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-5 rounded-xl text-center text-xl font-bold mb-6">
                      Your Score: {calculateScore()}/{quizResult.quiz.length} ({Math.round((calculateScore() / quizResult.quiz.length) * 100)}%)
                    </div>
                  )}

                  <div className="space-y-6">
                    {quizResult.quiz.map((q, index) => (
                      <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                        <div className="text-xl font-semibold text-gray-800 mb-4">{index + 1}. {q.question}</div>
                        <div className="grid gap-3">
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              onClick={() => !quizSubmitted && handleAnswer(index, opt)}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                                userAnswers[index] === opt
                                  ? 'border-indigo-500 bg-indigo-50'
                                  : 'border-gray-200 hover:border-indigo-500 hover:bg-gray-50'
                              } ${
                                quizSubmitted
                                  ? opt === q.correct_answer
                                    ? 'border-green-500 bg-green-100'
                                    : userAnswers[index] === opt && opt !== q.correct_answer
                                    ? 'border-red-500 bg-red-100'
                                    : 'border-gray-200 opacity-60 cursor-not-allowed'
                                  : ''
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                        {quizSubmitted && (
                          <div className="mt-4 p-4 bg-blue-100 rounded-lg text-blue-800">
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {!quizSubmitted && (
                    <button
                      onClick={submitQuiz}
                      className="w-full mt-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {(activeTab === 'schedule-history' || activeTab === 'quiz-history') && (
            <History 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onGenerateQuizFromSchedule={generateQuizFromSchedule}
            />
          )}

          {activeTab === 'admin' && isAdmin && (
            <AdminDashboard />
          )}

          {activeTab === 'share' && isAdmin && (
            <Share />
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
