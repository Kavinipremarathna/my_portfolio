const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dataDir = path.join(__dirname, "..", "data");
const projectsFile = path.join(dataDir, "projects.json");
const usersFile = path.join(dataDir, "users.json");

function ensureFile(filePath, defaultValue) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

function readJson(filePath, defaultValue) {
  ensureFile(filePath, defaultValue);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw || JSON.stringify(defaultValue));
}

function writeJson(filePath, value) {
  ensureFile(filePath, Array.isArray(value) ? [] : {});
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function normalizeProject(project) {
  return {
    _id: project._id || crypto.randomUUID(),
    title: project.title,
    description: project.description,
    tags: Array.isArray(project.tags) ? project.tags : [],
    imageUrl: project.imageUrl,
    liveLink: project.liveLink || "",
    repoLink: project.repoLink || "",
    featured: Boolean(project.featured),
    createdAt: project.createdAt || new Date().toISOString(),
  };
}

function listProjects() {
  return readJson(projectsFile, [])
    .map(normalizeProject)
    .sort(
      (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
    );
}

function getProjectById(id) {
  return listProjects().find((project) => project._id === id) || null;
}

function createProject(project) {
  const projects = listProjects();
  const newProject = normalizeProject(project);
  projects.unshift(newProject);
  writeJson(projectsFile, projects);
  return newProject;
}

function updateProject(id, updates) {
  const projects = listProjects();
  const index = projects.findIndex((project) => project._id === id);

  if (index === -1) {
    return null;
  }

  const updatedProject = normalizeProject({
    ...projects[index],
    ...updates,
    _id: id,
    createdAt: projects[index].createdAt,
  });

  projects[index] = updatedProject;
  writeJson(projectsFile, projects);
  return updatedProject;
}

function deleteProject(id) {
  const projects = listProjects();
  const filteredProjects = projects.filter((project) => project._id !== id);

  if (filteredProjects.length === projects.length) {
    return false;
  }

  writeJson(projectsFile, filteredProjects);
  return true;
}

function listUsers() {
  return readJson(usersFile, []);
}

function countUsers() {
  return listUsers().length;
}

function findUserByUsername(username) {
  return listUsers().find((user) => user.username === username) || null;
}

function findUserById(id) {
  return listUsers().find((user) => user._id === id) || null;
}

function createUser(user) {
  const users = listUsers();
  const newUser = {
    _id: crypto.randomUUID(),
    username: user.username,
    password: user.password,
  };

  users.push(newUser);
  writeJson(usersFile, users);
  return newUser;
}

module.exports = {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  listUsers,
  countUsers,
  findUserByUsername,
  findUserById,
  createUser,
};
