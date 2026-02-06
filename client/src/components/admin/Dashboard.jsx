import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, LogOut, X } from 'lucide-react';

const Dashboard = ({ token, setToken }) => {
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        imageUrl: '',
        liveLink: '',
        repoLink: '',
        featured: false
    });

    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/projects/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchProjects();
        } catch (err) {
            console.error(err);
            alert('Error deleting project');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const projectData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim())
        };

        try {
            const config = {
                headers: { 'x-auth-token': token }
            };

            if (isEditing) {
                await axios.put(`http://localhost:5000/api/projects/${currentId}`, projectData, config);
            } else {
                await axios.post('http://localhost:5000/api/projects', projectData, config);
            }

            fetchProjects();
            resetForm();
            setShowForm(false);
        } catch (err) {
            console.error(err);
            alert('Error saving project');
        }
    };

    const handleEdit = (project) => {
        setFormData({
            title: project.title,
            description: project.description,
            tags: project.tags.join(', '),
            imageUrl: project.imageUrl,
            liveLink: project.liveLink || '',
            repoLink: project.repoLink || '',
            featured: project.featured
        });
        setCurrentId(project._id);
        setIsEditing(true);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            tags: '',
            imageUrl: '',
            liveLink: '',
            repoLink: '',
            featured: false
        });
        setIsEditing(false);
        setCurrentId(null);
    };

    return (
        <div className="min-h-screen bg-primary">
            {/* Admin Header */}
            <header className="bg-secondary border-b border-slate-700 py-4 px-6 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <div className="flex gap-4">
                    <a href="/" className="btn-primary text-sm py-2 px-4">View Site</a>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Projects</h2>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} /> Add Project
                    </button>
                </div>

                {/* Project Form Modal/Overlay */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-secondary p-8 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">{isEditing ? 'Edit Project' : 'New Project'}</h3>
                                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 mb-1">Title</label>
                                    <input type="text" className="input-field" required
                                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-slate-400 mb-1">Description</label>
                                    <textarea className="input-field h-24" required
                                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 mb-1">Image URL</label>
                                        <input type="text" className="input-field" required
                                            value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 mb-1">Tags (comma separated)</label>
                                        <input type="text" className="input-field" placeholder="React, Node, MongoDB"
                                            value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 mb-1">Live Link</label>
                                        <input type="text" className="input-field"
                                            value={formData.liveLink} onChange={e => setFormData({ ...formData, liveLink: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 mb-1">Repo Link</label>
                                        <input type="text" className="input-field"
                                            value={formData.repoLink} onChange={e => setFormData({ ...formData, repoLink: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="featured"
                                        checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 focus:ring-accent" />
                                    <label htmlFor="featured" className="text-slate-400">Featured Project</label>
                                </div>

                                <button type="submit" className="w-full btn-primary mt-4">
                                    {isEditing ? 'Update Project' : 'Create Project'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Projects List */}
                <div className="grid gap-4">
                    {projects.map(project => (
                        <div key={project._id} className="bg-secondary p-4 rounded-lg border border-slate-700 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <img src={project.imageUrl} alt={project.title} className="w-16 h-16 object-cover rounded" />
                                <div>
                                    <h4 className="text-white font-bold">{project.title}</h4>
                                    <p className="text-slate-500 text-sm">{project.tags.join(', ')}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(project)} className="p-2 hover:bg-slate-700 rounded text-accent">
                                    <Edit size={20} />
                                </button>
                                <button onClick={() => handleDelete(project._id)} className="p-2 hover:bg-slate-700 rounded text-red-500">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && <p className="text-slate-500 text-center">No projects found.</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
