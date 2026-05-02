import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, CheckCircle2, Clock, ListTodo, MoreVertical, X } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  // Forms
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '', assignedTo: '' });
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`)
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching details', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setAllUsers(res.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...taskForm, project: id });
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', dueDate: '', assignedTo: '' });
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    try {
      const currentMembers = project.members.map(m => m._id);
      if (!currentMembers.includes(selectedMember)) {
        await api.put(`/projects/${id}`, { members: [...currentMembers, selectedMember] });
        fetchProjectAndTasks();
        setShowMemberModal(false);
      }
    } catch (error) {
      console.error('Error adding member', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading project details...</div>;
  if (!project) return <div className="p-8 text-center text-slate-400">Project not found</div>;

  const isAdmin = project.admin?._id === user._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full slide-up">
      <div className="mb-8 border-b border-slate-700/50 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
        <p className="text-slate-400 mb-4">{project.description}</p>
        <div className="flex items-center space-x-4 text-sm">
          <span className="px-2.5 py-1 bg-dark-800 rounded-md border border-slate-700 text-slate-300">
            Admin: {project.admin?.name}
          </span>
          <span className="px-2.5 py-1 bg-dark-800 rounded-md border border-slate-700 text-slate-300">
            {project.members?.length || 0} Members
          </span>
          {isAdmin && (
            <button 
              onClick={() => { fetchAllUsers(); setShowMemberModal(true); }}
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              + Add Member
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Tasks</h2>
        {isAdmin && (
          <button onClick={() => setShowTaskModal(true)} className="btn-primary flex items-center py-1.5 px-3 text-sm">
            <Plus className="w-4 h-4 mr-1" />
            New Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kanban Columns */}
        {['Todo', 'In Progress', 'Done'].map(status => (
          <div key={status} className="bg-dark-800/50 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-semibold text-slate-200 flex items-center">
                {status === 'Todo' && <ListTodo className="w-4 h-4 mr-2 text-slate-400" />}
                {status === 'In Progress' && <Clock className="w-4 h-4 mr-2 text-yellow-400" />}
                {status === 'Done' && <CheckCircle2 className="w-4 h-4 mr-2 text-primary-400" />}
                {status}
              </h3>
              <span className="bg-dark-900 text-slate-400 px-2 py-0.5 rounded text-xs">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>

            <div className="space-y-3">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} className="card p-4 hover:border-slate-600 transition-colors cursor-pointer group relative">
                  <h4 className="font-medium text-white mb-1">{task.title}</h4>
                  {task.dueDate && (
                    <p className="text-xs text-slate-500 mb-3">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="w-6 h-6 rounded-full bg-dark-700 flex items-center justify-center text-xs text-slate-300 font-medium border border-slate-600" title={task.assignedTo?.name || 'Unassigned'}>
                      {task.assignedTo?.name ? task.assignedTo.name.charAt(0) : '?'}
                    </div>
                    
                    {/* Status Dropdown - simplified logic */}
                    <select 
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                      className="text-xs bg-dark-900 border border-slate-700 rounded px-1 py-0.5 text-slate-300 outline-none"
                      disabled={!isAdmin && task.assignedTo?._id !== user._id}
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="text-center py-6 text-sm text-slate-500 border border-dashed border-slate-700/50 rounded-lg">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Create Task</h2>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="label-text">Task Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="label-text">Description</label>
                <textarea
                  className="input-field min-h-[80px]"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                ></textarea>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Due Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label-text">Assign To</label>
                  <select
                    className="input-field appearance-none bg-dark-900"
                    value={taskForm.assignedTo}
                    onChange={(e) => setTaskForm({...taskForm, assignedTo: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {project.members.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                    <option value={project.admin._id}>{project.admin.name}</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-sm p-6 fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Add Member</h2>
            <form onSubmit={handleAddMember}>
              <div className="mb-6">
                <label className="label-text">Select User</label>
                <select
                  className="input-field bg-dark-900"
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  required
                >
                  <option value="">-- Select User --</option>
                  {allUsers.filter(u => u._id !== project.admin._id && !project.members.some(m => m._id === u._id)).map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowMemberModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
