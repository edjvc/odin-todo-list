class Todo {
  constructor({
    id,
    title,
    description = '',
    priority = 'low',
    projectId,
    completed = false,
  }) {
    this.id = id ?? crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.projectId = projectId;
    this.completed = completed;
  }

  markComplete() {
    this.completed = true;
  }

  restore() {
    this.completed = false;
  }

  toPlainObject() {
    return { ...this };
  }
}

export { Todo };
