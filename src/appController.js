import todoManager from './todoManager.js';
import projectManager from './projectManager.js';
import storageController from './storageController.js';
import viewState from './viewState.js';
import DOMController from './DOMController.js';

const appController = {
  init() {
    const data = storageController.load();
    if (data?.projects?.length > 0) {
      // console.log('data:', data.projects[0]);
      viewState.load(data.viewState);
      projectManager.load(data.projects);
      projectManager.setActive(viewState.getActiveProjectId());
      todoManager.load(data.todos);
    } else {
      const defaultProject = projectManager.createDefaultProject();
      viewState.setProjectView(defaultProject.id);
      this.persist();
    }
    DOMController.bindUIEvents(this);
    this.renderProjects();
    this.renderTodos();
  },

  renderProjects() {
    DOMController.renderProjects(
      projectManager.getAll(),
      projectManager.getActiveId()
    );
  },

  renderTodos() {
    const currentView = viewState.getCurrentView();
    const currentProjectId = viewState.getActiveProjectId();
    if (!currentView) return;
    let todos = todoManager.getByProject(currentProjectId);
    if (currentView === 'completed') {
      const allCompletedTodos = todoManager.getCompleted();
      todos = allCompletedTodos.filter((t) => t.projectId === currentProjectId);
    }
    const isCurrentViewCompleted = currentView === 'completed';
    DOMController.toggleDeleteAllCompletedBtn(isCurrentViewCompleted);
    DOMController.renderTodos(todos);
  },

  handleAddTodo() {
    if (!viewState.getActiveProjectId()) return;
    DOMController.openModal({
      title: 'New Task',
      projectForm: false,
      onSubmit({ title, description, priority }) {
        todoManager.add({
          title: title + ' and love Ed',
          description,
          priority,
          projectId: viewState.getActiveProjectId(),
        });
        appController.persist();
        appController.renderTodos();
      },
    });
  },

  handleEditTodo(id, updates) {
    todoManager.edit(id, updates);
    this.persist();
    this.renderTodos();
  },

  handleEditProject(id, updates) {
    projectManager.edit(id, updates);
    this.persist();
    this.renderProjects();
  },

  handleRemoveTodo(id) {
    todoManager.remove(id);
    this.persist();
    this.renderTodos();
  },

  handleToggleTodo(id) {
    const todo = todoManager.getById(id);
    if (!todo) return;
    todo.completed ? todoManager.restore(id) : todoManager.markComplete(id);
    this.persist();
    this.renderProjects();
    this.renderTodos();
  },

  handleAddProject() {
    DOMController.openModal({
      title: 'New Project',
      projectForm: true,
      onSubmit({ title }) {
        const newProject = projectManager.add({ name: title });
        appController.handleSelectProject(newProject.id);
      },
    });
  },

  handleDeleteProject(id) {
    projectManager.remove(id);
    todoManager.removeByProject(id);
    viewState.setProjectView(projectManager.getActiveId());
    this.persist();
    this.renderProjects();
    this.renderTodos();
  },

  handleMoveToProject(id, newProjectId) {
    if (!newProjectId) return;
    todoManager.moveToProject(id, newProjectId);
    this.persist();
    this.renderProjects();
    this.renderTodos();
  },

  handleSelectProject(id) {
    projectManager.setActive(id);
    viewState.setProjectView(id);
    this.persist();
    this.renderProjects();
    this.renderTodos();
  },

  handleClickProjectEdit(id) {
    if (!id) return;
    DOMController.openModal({
      title: 'Project Name:',
      projectForm: true,
      editForm: true,
      activeProjectId: viewState.getActiveProjectId(),
      targetId: id,
      targetProject: projectManager.getById(id),
      onSubmit: ({ name }) => {
        this.handleEditProject(id, { name });
      },
    });
  },

  handleToggleCompleted() {
    if (viewState.getCurrentView() === 'completed') {
      viewState.setProjectView(viewState.getActiveProjectId());
    } else {
      viewState.setCompletedView();
    }
    appController.persist();
    appController.renderProjects();
    appController.renderTodos();
  },

  handleRemoveCompleted() {
    if (viewState.getCurrentView() === 'completed') {
      const allCompletedTodos = todoManager.getCompleted();
      const completedTodosHere = allCompletedTodos.filter(
        (t) => t.projectId === viewState.getActiveProjectId()
      );

      if (!completedTodosHere[0]) return;
      if (
        !DOMController.confirmDialog(
          '⚠️ WARNING: Are you sure to delete all the completed tasks in this project?'
        )
      )
        return;

      completedTodosHere.forEach((t) => todoManager.remove(t.id));
      appController.persist();
      appController.renderTodos();
    }
  },

  handleSelectTodo(id) {
    const todo = todoManager.getById(id);
    if (!todo) return;

    DOMController.openModal({
      title: 'Title: ',
      projectForm: false,
      editForm: true,
      defaultTodoInfo: todo,
      activeProjectId: viewState.getActiveProjectId(),
      allProjects: projectManager.getAll(),
      onSubmit: ({ title, description, priority, newProjectId }) => {
        this.handleEditTodo(id, { title, description, priority });
        this.handleMoveToProject(id, newProjectId);
      },
    });
  },

  persist() {
    storageController.save(
      projectManager.toPlainObject(),
      todoManager.toPlainObject(),
      viewState.toPlainObject()
    );
  },
};

export default appController;
