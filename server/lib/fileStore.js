const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dataDir = path.join(__dirname, "..", "data");
const projectsFile = path.join(dataDir, "projects.json");
const usersFile = path.join(dataDir, "users.json");
const skillsFile = path.join(dataDir, "skills.json");
const galleryFile = path.join(dataDir, "gallery.json");
const articlesFile = path.join(dataDir, "articles.json");
const heroFile = path.join(dataDir, "hero.json");
const experiencesFile = path.join(dataDir, "experiences.json");

const defaultHeroConfig = {
  badgeText: "Portfolio / Full-Stack Developer",
  greeting: "Hello, I am",
  firstName: "Kavini",
  lastName: "Premarathna",
  roles: [
    "Software Engineer",
    "Cybersecurity Enthusiast",
    "Full-Stack Developer",
  ],
  bio: "Building secure and scalable digital experiences with elegant UI, smooth motion, and production-ready engineering.",
  primaryCtaText: "View Projects",
  primaryCtaHref: "#projects",
  secondaryCtaText: "Contact Me",
  secondaryCtaHref: "#contact",
  resumeButtonText: "Download Resume",
  resumeUrl: "/resume.pdf",
  availabilityText: "Freelance / Internship",
  stats: {
    focus: "Full-Stack",
    stack: "React + Node",
    style: "Clean & Modern",
  },
  social: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "mailto:email@example.com",
  },
  profileImageUrl: "",
};

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

function normalizeSkill(skill) {
  return {
    _id: skill._id || crypto.randomUUID(),
    name: skill.name,
    category: skill.category,
    createdAt: skill.createdAt || new Date().toISOString(),
  };
}

function normalizeGalleryPhoto(photo) {
  return {
    _id: photo._id || crypto.randomUUID(),
    title: photo.title,
    caption: photo.caption || "",
    category: photo.category || "general",
    imageUrl: photo.imageUrl,
    createdAt: photo.createdAt || new Date().toISOString(),
  };
}

function normalizeArticle(article) {
  return {
    _id: article._id || crypto.randomUUID(),
    slug: String(article.slug || "")
      .trim()
      .toLowerCase(),
    title: article.title,
    excerpt: article.excerpt || "",
    content: article.content || "",
    category: article.category || "Engineering",
    readTime: article.readTime || "5 min read",
    date: article.date || new Date().toISOString().slice(0, 10),
    tags: Array.isArray(article.tags) ? article.tags : [],
    featured: Boolean(article.featured),
    source: article.source || "original",
    mediumUrl: article.mediumUrl || "",
    createdAt: article.createdAt || new Date().toISOString(),
  };
}

function normalizeHeroConfig(hero) {
  const next = hero && typeof hero === "object" ? hero : {};
  return {
    ...defaultHeroConfig,
    ...next,
    roles: Array.isArray(next.roles)
      ? next.roles.filter(Boolean)
      : defaultHeroConfig.roles,
    stats: {
      ...defaultHeroConfig.stats,
      ...(next.stats && typeof next.stats === "object" ? next.stats : {}),
    },
    social: {
      ...defaultHeroConfig.social,
      ...(next.social && typeof next.social === "object" ? next.social : {}),
    },
  };
}

function normalizeExperience(experience) {
  const parsedOrder = Number(experience.order);
  return {
    _id: experience._id || crypto.randomUUID(),
    section: experience.section === "education" ? "education" : "experience",
    order: Number.isFinite(parsedOrder) && parsedOrder > 0 ? parsedOrder : 0,
    year: String(experience.year || "").trim(),
    title: String(experience.title || "").trim(),
    organization: String(experience.organization || "").trim(),
    description: String(experience.description || "").trim(),
    createdAt: experience.createdAt || new Date().toISOString(),
  };
}

function normalizeAndOrderExperiences(experiences) {
  const normalized = experiences.map(normalizeExperience);
  const sections = ["experience", "education"];

  sections.forEach((section) => {
    const sectionItems = normalized
      .filter((item) => item.section === section)
      .sort((left, right) => {
        const orderDiff = left.order - right.order;
        if (orderDiff !== 0) {
          return orderDiff;
        }

        return new Date(left.createdAt) - new Date(right.createdAt);
      });

    sectionItems.forEach((item, index) => {
      item.order = index + 1;
    });
  });

  return normalized;
}

function sortExperiences(experiences) {
  const sectionRank = {
    experience: 0,
    education: 1,
  };

  return [...experiences].sort((left, right) => {
    const sectionDiff =
      (sectionRank[left.section] ?? 99) - (sectionRank[right.section] ?? 99);
    if (sectionDiff !== 0) {
      return sectionDiff;
    }

    const orderDiff = left.order - right.order;
    if (orderDiff !== 0) {
      return orderDiff;
    }

    return new Date(right.createdAt) - new Date(left.createdAt);
  });
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

function listSkills() {
  return readJson(skillsFile, [])
    .map(normalizeSkill)
    .sort(
      (left, right) => new Date(left.createdAt) - new Date(right.createdAt),
    );
}

function getSkillById(id) {
  return listSkills().find((skill) => skill._id === id) || null;
}

function createSkill(skill) {
  const skills = listSkills();
  const newSkill = normalizeSkill(skill);
  skills.push(newSkill);
  writeJson(skillsFile, skills);
  return newSkill;
}

function updateSkill(id, updates) {
  const skills = listSkills();
  const index = skills.findIndex((skill) => skill._id === id);

  if (index === -1) {
    return null;
  }

  const updatedSkill = normalizeSkill({
    ...skills[index],
    ...updates,
    _id: id,
    createdAt: skills[index].createdAt,
  });

  skills[index] = updatedSkill;
  writeJson(skillsFile, skills);
  return updatedSkill;
}

function deleteSkill(id) {
  const skills = listSkills();
  const filteredSkills = skills.filter((skill) => skill._id !== id);

  if (filteredSkills.length === skills.length) {
    return false;
  }

  writeJson(skillsFile, filteredSkills);
  return true;
}

function listGalleryPhotos() {
  return readJson(galleryFile, [])
    .map(normalizeGalleryPhoto)
    .sort(
      (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
    );
}

function getGalleryPhotoById(id) {
  return listGalleryPhotos().find((photo) => photo._id === id) || null;
}

function createGalleryPhoto(photo) {
  const photos = listGalleryPhotos();
  const newPhoto = normalizeGalleryPhoto(photo);
  photos.unshift(newPhoto);
  writeJson(galleryFile, photos);
  return newPhoto;
}

function updateGalleryPhoto(id, updates) {
  const photos = listGalleryPhotos();
  const index = photos.findIndex((photo) => photo._id === id);

  if (index === -1) {
    return null;
  }

  const updatedPhoto = normalizeGalleryPhoto({
    ...photos[index],
    ...updates,
    _id: id,
    createdAt: photos[index].createdAt,
  });

  photos[index] = updatedPhoto;
  writeJson(galleryFile, photos);
  return updatedPhoto;
}

function deleteGalleryPhoto(id) {
  const photos = listGalleryPhotos();
  const filteredPhotos = photos.filter((photo) => photo._id !== id);

  if (filteredPhotos.length === photos.length) {
    return false;
  }

  writeJson(galleryFile, filteredPhotos);
  return true;
}

function listArticles() {
  return readJson(articlesFile, [])
    .map(normalizeArticle)
    .sort(
      (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
    );
}

function getArticleById(id) {
  return listArticles().find((article) => article._id === id) || null;
}

function getArticleBySlug(slug) {
  const normalizedSlug = String(slug || "")
    .trim()
    .toLowerCase();
  return (
    listArticles().find((article) => article.slug === normalizedSlug) || null
  );
}

function createArticle(article) {
  const articles = listArticles();
  const newArticle = normalizeArticle(article);
  articles.unshift(newArticle);
  writeJson(articlesFile, articles);
  return newArticle;
}

function updateArticle(id, updates) {
  const articles = listArticles();
  const index = articles.findIndex((article) => article._id === id);

  if (index === -1) {
    return null;
  }

  const updatedArticle = normalizeArticle({
    ...articles[index],
    ...updates,
    _id: id,
    createdAt: articles[index].createdAt,
  });

  articles[index] = updatedArticle;
  writeJson(articlesFile, articles);
  return updatedArticle;
}

function deleteArticle(id) {
  const articles = listArticles();
  const filteredArticles = articles.filter((article) => article._id !== id);

  if (filteredArticles.length === articles.length) {
    return false;
  }

  writeJson(articlesFile, filteredArticles);
  return true;
}

function listExperiences() {
  const normalized = normalizeAndOrderExperiences(readJson(experiencesFile, []));
  return sortExperiences(normalized);
}

function getExperienceById(id) {
  return listExperiences().find((experience) => experience._id === id) || null;
}

function createExperience(experience) {
  const experiences = normalizeAndOrderExperiences(readJson(experiencesFile, []));
  const section = experience.section === "education" ? "education" : "experience";
  const nextOrder =
    experiences
      .filter((item) => item.section === section)
      .reduce((max, item) => Math.max(max, item.order), 0) + 1;

  const newExperience = normalizeExperience({
    ...experience,
    section,
    order: nextOrder,
  });

  experiences.push(newExperience);
  writeJson(experiencesFile, sortExperiences(experiences));
  return newExperience;
}

function updateExperience(id, updates) {
  const experiences = normalizeAndOrderExperiences(readJson(experiencesFile, []));
  const index = experiences.findIndex((experience) => experience._id === id);

  if (index === -1) {
    return null;
  }

  const current = experiences[index];
  const nextSection =
    updates.section !== undefined
      ? updates.section === "education"
        ? "education"
        : "experience"
      : current.section;
  const nextOrder =
    nextSection === current.section
      ? current.order
      : experiences.filter((item) => item.section === nextSection).length + 1;

  const updatedExperience = normalizeExperience({
    ...current,
    ...updates,
    section: nextSection,
    order: nextOrder,
    _id: id,
    createdAt: current.createdAt,
  });

  experiences[index] = updatedExperience;
  const normalized = normalizeAndOrderExperiences(experiences);
  const sorted = sortExperiences(normalized);
  writeJson(experiencesFile, sorted);
  return sorted.find((item) => item._id === id) || updatedExperience;
}

function deleteExperience(id) {
  const experiences = normalizeAndOrderExperiences(readJson(experiencesFile, []));
  const filteredExperiences = experiences.filter(
    (experience) => experience._id !== id,
  );

  if (filteredExperiences.length === experiences.length) {
    return false;
  }

  const normalized = normalizeAndOrderExperiences(filteredExperiences);
  writeJson(experiencesFile, sortExperiences(normalized));
  return true;
}

function reorderExperience(id, direction) {
  const experiences = normalizeAndOrderExperiences(readJson(experiencesFile, []));
  const current = experiences.find((experience) => experience._id === id);

  if (!current) {
    return null;
  }

  const sectionItems = experiences
    .filter((experience) => experience.section === current.section)
    .sort((left, right) => left.order - right.order);
  const currentIndex = sectionItems.findIndex((experience) => experience._id === id);
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= sectionItems.length) {
    return current;
  }

  const [moved] = sectionItems.splice(currentIndex, 1);
  sectionItems.splice(targetIndex, 0, moved);
  sectionItems.forEach((experience, index) => {
    experience.order = index + 1;
  });

  const sorted = sortExperiences(experiences);
  writeJson(experiencesFile, sorted);
  return sorted.find((experience) => experience._id === id) || moved;
}

function getHeroConfig() {
  return normalizeHeroConfig(readJson(heroFile, defaultHeroConfig));
}

function updateHeroConfig(updates) {
  const current = getHeroConfig();
  const merged = normalizeHeroConfig({ ...current, ...updates });
  writeJson(heroFile, merged);
  return merged;
}

function listUsers() {
  return readJson(usersFile, []);
}

function countUsers() {
  return listUsers().length;
}

function findUserByUsername(username) {
  const normalizedUsername = String(username || "")
    .trim()
    .toLowerCase();

  return (
    listUsers().find(
      (user) =>
        String(user.username || "")
          .trim()
          .toLowerCase() === normalizedUsername,
    ) || null
  );
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
  listSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  listGalleryPhotos,
  getGalleryPhotoById,
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  listArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  listExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperience,
  getHeroConfig,
  updateHeroConfig,
  listUsers,
  countUsers,
  findUserByUsername,
  findUserById,
  createUser,
};
