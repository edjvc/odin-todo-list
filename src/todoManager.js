import { Todo } from './todo.js';

let todos = [];

const todoManager = {
  add(data) {
    const todo = new Todo(data);
    todos.push(todo);
    return todo;
  },

  edit(id, updates) {
    const todo = this.getById(id);
    if (!todo) return false;
    Object.assign(todo, updates);
    return true;
  },

  remove(id) {
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) return false;
    todos.splice(index, 1);
    return true;
  },

  removeByProject(projectId) {
    todos = todos.filter((t) => t.projectId !== projectId);
  },

  markComplete(id) {
    const todo = this.getById(id);
    if (!todo) return false;
    todo.markComplete();
    return true;
  },

  restore(id) {
    const todo = this.getById(id);
    if (!todo) return false;
    todo.restore();
    return true;
  },

  moveToProject(id, newProjectId) {
    const todo = this.getById(id);
    if (!todo) return false;
    todo.projectId = newProjectId;
    return true;
  },

  clearCompleted() {
    todos = todos.filter((t) => !t.completed);
  },

  getById(id) {
    return todos.find((t) => t.id === id);
  },

  getByProject(projectId) {
    return todos.filter((t) => t.projectId === projectId && !t.completed);
  },

  getCompleted() {
    return todos.filter((t) => t.completed);
  },

  getAll() {
    return [...todos];
  },

  load(plainObjectTodos) {
    todos = plainObjectTodos.map((obj) => new Todo(obj));
  },

  toPlainObject() {
    return todos.map((t) => t.toPlainObject());
  },
};

export default todoManager;
