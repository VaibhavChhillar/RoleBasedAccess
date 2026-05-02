import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Users, ArrowRight } from 'lucide-react';

const ProjectList = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name: newProjectName, description: newProjectDesc });
      setShowModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
      fetchProjects();
    } catch (error) {
      console.error('Error creating project', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading projects...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full slide-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-slate-400">Manage your team projects.</p>
        </div>
        {user.role === 'Admin' && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card p-12 text-center border-dashed border-2 border-slate-700 bg-transparent shadow-none">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-800 mb-4">
            <FolderKanban className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No projects found</h3>
          <p className="text-slate-400 mb-6">You don't have access to any projects yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="card group hover:-translate-y-1 transition-transform duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                    {project.name}
                  </h3>
                  <span className="px-2 py-1 bg-dark-900 rounded text-xs font-medium text-slate-400 border border-slate-700">
                    {project.admin?._id === user._id ? 'Owner' : 'Member'}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                  {project.description || 'No description provided.'}
                </p>
                
                <div className="flex items-center justify-between border-t border-slate-700/50 pt-4 mt-auto">
                  <div className="flex items-center text-sm text-slate-500">
                    <Users className="w-4 h-4 mr-1.5" />
                    {project.members?.length || 0} Members
                  </div>
                  <Link 
                    to={`/projects/${project._id}`}
                    className="flex items-center text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="label-text">Project Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="label-text">Description</label>
                <textarea
                  className="input-field min-h-[100px] resize-y"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import { FolderKanban } from 'lucide-react'; // Import missing icon
export default ProjectList;
