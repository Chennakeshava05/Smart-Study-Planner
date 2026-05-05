import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const History = ({ activeTab, setActiveTab, onGenerateQuizFromSchedule }) => {
  const [schedules, setSchedules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    
    try {
      const endpoint = activeTab === 'schedule-history' ? '/api/history/schedules' : '/api/history/quizzes';
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch history');
      }

      if (activeTab === 'schedule-history') {
        setSchedules(data.sessions);
      } else {
        setQuizzes(data.sessions);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (sessionId) => {
    try {
      const response = await fetch(`/api/history/schedules/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete schedule');
      }

      setSchedules(schedules.filter(s => s.id !== sessionId));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteQuiz = async (sessionId) => {
    try {
      const response = await fetch(`/api/history/quizzes/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete quiz');
      }

      setQuizzes(quizzes.filter(q => q.id !== sessionId));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-600 text-lg">
        Loading history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-50 p-6 md:p-8 rounded-2xl mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          {activeTab === 'schedule-history' ? 'Study Schedule History' : 'Quiz History'}
        </h2>
        
        {activeTab === 'schedule-history' && schedules.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No study schedules found</p>
            <p className="text-sm mt-2">Generate your first schedule to see it here!</p>
          </div>
        )}
        
        {activeTab === 'quiz-history' && quizzes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No quizzes found</p>
            <p className="text-sm mt-2">Generate your first quiz to see it here!</p>
          </div>
        )}

        {activeTab === 'schedule-history' && schedules.length > 0 && (
          <div className="space-y-6">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{schedule.subject}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Topics: {schedule.topics.join(', ')}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Duration: {schedule.duration_hours} hours | Difficulty: {schedule.difficulty}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {formatDate(schedule.created_at)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onGenerateQuizFromSchedule(schedule)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                    >
                      Generate Quiz
                    </button>
                    <button
                      onClick={() => deleteSchedule(schedule.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Schedule Overview:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {schedule.generated_schedule.schedule.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm border-b pb-2">
                        <span className="font-medium text-indigo-600">{item.time}</span>
                        <span className="text-gray-700">{item.activity}</span>
                        <span className="text-gray-500 text-xs">{item.duration_minutes}min</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {schedule.generated_schedule.tips && schedule.generated_schedule.tips.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 text-sm mb-2">Study Tips:</h4>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      {schedule.generated_schedule.tips.map((tip, index) => (
                        <li key={index}>💡 {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quiz-history' && quizzes.length > 0 && (
          <div className="space-y-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{quiz.subject}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Topics: {quiz.topics.join(', ')}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Questions: {quiz.num_questions} | Difficulty: {quiz.difficulty}
                    </p>
                    {quiz.score !== null && (
                      <p className="text-sm text-gray-600 mb-1">
                        Score: {quiz.score}/{quiz.num_questions} ({Math.round((quiz.score / quiz.num_questions) * 100)}%)
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Created: {formatDate(quiz.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteQuiz(quiz.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Quiz Preview:</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {quiz.generated_quiz.quiz.slice(0, 3).map((question, index) => (
                      <div key={index} className="border-b pb-3">
                        <p className="text-sm font-medium text-gray-800 mb-2">
                          Q{index + 1}: {question.question}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {question.options.map((option, i) => (
                            <span 
                              key={i}
                              className={`p-1 rounded ${
                                option === question.correct_answer 
                                  ? 'bg-green-100 text-green-800 font-medium' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    {quiz.generated_quiz.quiz.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        ... and {quiz.generated_quiz.quiz.length - 3} more questions
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
