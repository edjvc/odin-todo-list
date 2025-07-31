import { Project } from './project.js';

let projects = [];
let activeProjectId = null;

const projectManager = {
  add(data) {
    const project = new Project(data);
    projects.push(project);
    return project;
  },

  edit(id, updates) {
    const project = this.getById(id);
    if (!project) return false;
    Object.assign(project, updates);
    return true;
  },

  remove(id) {
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return false;
    projects.splice(index, 1);

    if (activeProjectId === id) {
      activeProjectId = projects[0]?.id ?? null;
    }
    return true;
  },

  getById(id) {
    return projects.find((p) => p.id === id);
  },

  getFirstIdByName(name) {
    return projects.find((p) => p.name === name).id;
  },

  getAll() {
    return [...projects];
  },

  getActive() {
    return this.getById(activeProjectId);
  },

  getActiveId() {
    return activeProjectId;
  },

  setActive(id) {
    if (this.getById(id)) activeProjectId = id;
  },

  createDefaultProject() {
    const defaultProject = this.add({ name: 'My Project' });
    this.setActive(defaultProject.id);
    return defaultProject;
  },

  load(plainObjectProjects) {
    projects = plainObjectProjects.map((obj) => new Project(obj));
    // activeProjectId ||= projects[0]?.id ?? null;
  },

  toPlainObject() {
    return projects.map((p) => p.toPlainObject());
  },
};

export default projectManager;
