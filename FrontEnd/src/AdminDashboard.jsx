import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActivities, setUserActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats');
      }

      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivities = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/activity`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user activities');
      }

      setUserActivities(data.activities);
      setSelectedUser(userId);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role })
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateUserStatus = async (userId, isActive) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: isActive })
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      fetchUsers();
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
        Loading admin dashboard...
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">👑 Admin Dashboard</h1>
            <p className="text-lg md:text-xl opacity-90">Manage Users and Monitor Activity</p>
          </header>

          <div className="p-6 md:p-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers || 0}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Active Users</h3>
                <p className="text-3xl font-bold text-green-600">{stats.activeUsers || 0}</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Total Schedules</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalSchedules || 0}</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Total Quizzes</h3>
                <p className="text-3xl font-bold text-orange-600">{stats.totalQuizzes || 0}</p>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-50 p-6 rounded-2xl mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">All Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="pb-3 text-sm font-semibold text-gray-700">Email</th>
                      <th className="pb-3 text-sm font-semibold text-gray-700">Name</th>
                      <th className="pb-3 text-sm font-semibold text-gray-700">Role</th>
                      <th className="pb-3 text-sm font-semibold text-gray-700">Status</th>
                      <th className="pb-3 text-sm font-semibold text-gray-700">Schedules</th>
                      <th className="pb-3 text-sm font-semibold text-gray-700">Quizzes</th>
                      <th className="pb-3 text-sm font-semibold text-gray-700">Last Login</th>
                      <th className="pb-3 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 text-sm text-gray-800">{user.email}</td>
                        <td className="py-3 text-sm text-gray-800">{user.name || 'N/A'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-800">{user.schedule_count}</td>
                        <td className="py-3 text-sm text-gray-800">{user.quiz_count}</td>
                        <td className="py-3 text-sm text-gray-600">
                          {user.last_login ? formatDate(user.last_login) : 'Never'}
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => fetchUserActivities(user.id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-600 transition-colors"
                            >
                              View Activity
                            </button>
                            <select
                              value={user.role}
                              onChange={(e) => updateUserRole(user.id, e.target.value)}
                              className="px-2 py-1 rounded text-xs border border-gray-300"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              onClick={() => updateUserStatus(user.id, !user.is_active)}
                              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                                user.is_active 
                                  ? 'bg-red-500 text-white hover:bg-red-600' 
                                  : 'bg-green-500 text-white hover:bg-green-600'
                              }`}
                            >
                              {user.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Activities */}
            {selectedUser && (
              <div className="bg-gray-50 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">User Activities</h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {userActivities.map((activity, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-indigo-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            activity.type === 'schedule' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {activity.type}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-800 mt-2">{activity.subject}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Topics: {activity.topics.join(', ')}
                          </p>
                          <p className="text-sm text-gray-600">
                            Difficulty: {activity.difficulty} | 
                            {activity.type === 'schedule' ? ` Duration: ${activity.duration_hours}h` : ` Questions: ${activity.duration_hours}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{formatDate(activity.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {stats.recentActivity && stats.recentActivity.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
                <div className="space-y-3">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          activity.type === 'schedule' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {activity.type}
                        </span>
                        <span className="ml-2 text-sm font-medium text-gray-800">{activity.subject}</span>
                        <span className="ml-2 text-sm text-gray-600">by {activity.email}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(activity.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
