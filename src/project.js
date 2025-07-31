class Project {
  constructor({ id, name }) {
    this.id = id ?? crypto.randomUUID();
    this.name = name;
  }

  toPlainObject() {
    return { ...this };
  }
}

export { Project };
