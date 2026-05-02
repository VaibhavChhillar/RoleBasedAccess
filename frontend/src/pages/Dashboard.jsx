import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks/my');
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching tasks', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading dashboard...</div>;
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const todoTasks = tasks.filter(t => t.status === 'Todo').length;

  // Simple overdue check (due date < today and not done)
  const today = new Date();
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'Done' || !t.dueDate) return false;
    return new Date(t.dueDate) < today;
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview of your tasks and progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 flex items-center bg-gradient-to-br from-dark-800 to-dark-900 border-l-4 border-l-blue-500">
          <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 mr-4">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Tasks</p>
            <p className="text-2xl font-bold text-white">{totalTasks}</p>
          </div>
        </div>
        
        <div className="card p-6 flex items-center bg-gradient-to-br from-dark-800 to-dark-900 border-l-4 border-l-primary-500">
          <div className="p-3 rounded-full bg-primary-500/20 text-primary-400 mr-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold text-white">{completedTasks}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center bg-gradient-to-br from-dark-800 to-dark-900 border-l-4 border-l-yellow-500">
          <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-400 mr-4">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">In Progress</p>
            <p className="text-2xl font-bold text-white">{inProgressTasks}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center bg-gradient-to-br from-dark-800 to-dark-900 border-l-4 border-l-red-500">
          <div className="p-3 rounded-full bg-red-500/20 text-red-400 mr-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Overdue</p>
            <p className="text-2xl font-bold text-white">{overdueTasks}</p>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Recent Tasks</h2>
          <Link to="/projects" className="text-sm text-primary-400 hover:text-primary-300">View Projects</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-900/50 text-slate-400 text-sm border-b border-slate-700/50">
                <th className="px-6 py-4 font-medium">Task</th>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No tasks found.</td>
                </tr>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <tr key={task._id} className="border-b border-slate-700/50 hover:bg-dark-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">{task.title}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {task.project?.name || 'Unknown Project'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        task.status === 'Done' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' :
                        task.status === 'In Progress' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
