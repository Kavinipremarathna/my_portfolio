import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Edit, LogOut, X } from "lucide-react";
import { API_URL } from "../../config/api";

const emptyProjectForm = {
  title: "",
  description: "",
  tags: "",
  imageUrl: "",
  liveLink: "",
  repoLink: "",
  featured: false,
};

const emptySkillForm = {
  name: "",
  category: "Frontend",
};

const Dashboard = ({ token, setToken }) => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [activeSection, setActiveSection] = useState("projects");
  const [editingType, setEditingType] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [skillForm, setSkillForm] = useState(emptySkillForm);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [projectsResponse, skillsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/projects`),
          axios.get(`${API_URL}/api/skills`),
        ]);

        setProjects(
          Array.isArray(projectsResponse.data) ? projectsResponse.data : [],
        );
        setSkills(
          Array.isArray(skillsResponse.data) ? skillsResponse.data : [],
        );
      } catch (err) {
        console.error(err);
      }
    };

    void loadDashboardData();
  }, []);

  const refreshProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects`);
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshSkills = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/skills`);
      setSkills(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const resetForms = () => {
    setProjectForm(emptyProjectForm);
    setSkillForm(emptySkillForm);
    setEditingType(null);
    setCurrentId(null);
  };

  const openProjectForm = (project = null) => {
    if (project) {
      const editTags = Array.isArray(project.tags)
        ? project.tags.join(", ")
        : String(project.tags || "");

      setProjectForm({
        title: project.title,
        description: project.description,
        tags: editTags,
        imageUrl: project.imageUrl,
        liveLink: project.liveLink || "",
        repoLink: project.repoLink || "",
        featured: Boolean(project.featured),
      });
      setCurrentId(project._id);
    } else {
      setProjectForm(emptyProjectForm);
      setCurrentId(null);
    }

    setEditingType("project");
    setShowForm(true);
  };

  const openSkillForm = (skill = null, category = "Frontend") => {
    if (skill) {
      setSkillForm({
        name: skill.name || "",
        category: skill.category || "Frontend",
      });
      setCurrentId(skill._id);
    } else {
      setSkillForm({
        name: "",
        category,
      });
      setCurrentId(null);
    }

    setEditingType("skill");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = { headers: { "x-auth-token": token } };

      if (editingType === "project") {
        const normalizedTags = Array.isArray(projectForm.tags)
          ? projectForm.tags
          : String(projectForm.tags)
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean);

        const projectData = {
          ...projectForm,
          tags: normalizedTags,
        };

        if (currentId) {
          await axios.put(
            `${API_URL}/api/projects/${currentId}`,
            projectData,
            config,
          );
        } else {
          await axios.post(`${API_URL}/api/projects`, projectData, config);
        }

        refreshProjects();
      }

      if (editingType === "skill") {
        const skillData = {
          name: skillForm.name.trim(),
          category: skillForm.category.trim(),
        };

        if (currentId) {
          await axios.put(
            `${API_URL}/api/skills/${currentId}`,
            skillData,
            config,
          );
        } else {
          await axios.post(`${API_URL}/api/skills`, skillData, config);
        }

        refreshSkills();
      }

      setShowForm(false);
      resetForms();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        alert("Your session expired. Please log in again.");
        return;
      }

      const message = err.response?.data?.msg || "Error saving record";
      alert(message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await axios.delete(`${API_URL}/api/projects/${id}`, {
        headers: { "x-auth-token": token },
      });
      refreshProjects();
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm("Delete this skill?")) return;

    try {
      await axios.delete(`${API_URL}/api/skills/${id}`, {
        headers: { "x-auth-token": token },
      });
      refreshSkills();
    } catch (err) {
      console.error(err);
      alert("Error deleting skill");
    }
  };

  const groupedSkills = skills.reduce((groups, skill) => {
    const category = skill.category || "Other";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(skill);
    return groups;
  }, {});

  const sectionLabel = activeSection === "projects" ? "Projects" : "Skills";
  const sectionCount =
    activeSection === "projects" ? projects.length : skills.length;

  return (
    <div className="min-h-screen bg-primary">
      <header className="sticky top-0 z-30 bg-secondary/90 backdrop-blur-xl border-b border-white/10 py-4 px-6 flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mt-1">
            Manage portfolio content
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="/" className="btn-primary text-sm py-2 px-4">
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-300 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col gap-6 mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 w-fit">
            <button
              type="button"
              onClick={() => setActiveSection("projects")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                activeSection === "projects"
                  ? "bg-accent text-primary"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Projects
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("skills")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                activeSection === "skills"
                  ? "bg-accent text-primary"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Skills
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-secondary/60 px-4 py-3 text-sm text-slate-300">
              <span className="text-white font-semibold">{sectionCount}</span>{" "}
              items in {sectionLabel}
            </div>
            <button
              onClick={() => {
                resetForms();
                if (activeSection === "projects") {
                  openProjectForm();
                } else {
                  openSkillForm();
                }
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} /> Add{" "}
              {activeSection === "projects" ? "Project" : "Skill Section"}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-secondary p-8 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl shadow-black/30">
              <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingType === "project"
                      ? currentId
                        ? "Edit Project"
                        : "New Project"
                      : currentId
                        ? "Edit Skill"
                        : "New Skill"}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {editingType === "skill"
                      ? "Add a skill name and category. The category becomes a separate section on the site."
                      : "Create or update a portfolio project."}
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {editingType === "project" ? (
                  <>
                    <div>
                      <label className="block text-slate-400 mb-1">Title</label>
                      <input
                        type="text"
                        className="input-field"
                        required
                        value={projectForm.title}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">
                        Description
                      </label>
                      <textarea
                        className="input-field h-24"
                        required
                        value={projectForm.description}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">
                          Image URL
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          required
                          value={projectForm.imageUrl}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              imageUrl: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">
                          Tags
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="React, Node, MongoDB"
                          value={projectForm.tags}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              tags: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">
                          Live Link
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          value={projectForm.liveLink}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              liveLink: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">
                          Repo Link
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          value={projectForm.repoLink}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              repoLink: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={projectForm.featured}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            featured: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 focus:ring-accent"
                      />
                      <label htmlFor="featured" className="text-slate-400">
                        Featured Project
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-slate-400 mb-1">
                        Skill Name
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        required
                        placeholder="React"
                        value={skillForm.name}
                        onChange={(e) =>
                          setSkillForm({ ...skillForm, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">
                        Section / Category
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        required
                        placeholder="Frontend"
                        value={skillForm.category}
                        onChange={(e) =>
                          setSkillForm({
                            ...skillForm,
                            category: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                )}

                <button type="submit" className="w-full btn-primary mt-4">
                  {editingType === "project"
                    ? currentId
                      ? "Update Project"
                      : "Create Project"
                    : currentId
                      ? "Update Skill"
                      : "Create Skill"}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeSection === "projects" ? (
          <div className="grid gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-secondary p-4 rounded-xl border border-white/10 flex justify-between items-center gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-bold truncate">
                      {project.title}
                    </h4>
                    <p className="text-slate-500 text-sm truncate">
                      {Array.isArray(project.tags)
                        ? project.tags.join(", ")
                        : String(project.tags || "")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openProjectForm(project)}
                    className="p-2 hover:bg-slate-700 rounded text-accent"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="p-2 hover:bg-slate-700 rounded text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-slate-500 text-center">No projects found.</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([category, items]) => (
              <div
                key={category}
                className="rounded-2xl border border-white/10 bg-secondary/70 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-white text-xl font-bold">{category}</h3>
                    <p className="text-slate-400 text-sm">
                      {items.length} skills in this section
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openSkillForm(null, category)}
                    className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
                  >
                    <Plus size={16} /> Add Skill
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((skill) => (
                    <div
                      key={skill._id}
                      className="rounded-xl border border-white/10 bg-primary/50 p-4 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-white font-semibold truncate">
                          {skill.name}
                        </p>
                        <p className="text-xs text-slate-400 uppercase tracking-[0.3em] mt-1">
                          {skill.category}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => openSkillForm(skill)}
                          className="p-2 hover:bg-slate-700 rounded text-accent"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill._id)}
                          className="p-2 hover:bg-slate-700 rounded text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {skills.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-secondary/70 p-8 text-center text-slate-400">
                No skills added yet. Create your first separate section with the
                button above.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
