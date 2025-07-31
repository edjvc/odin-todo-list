const DOMController = {
  bindUIEvents(app) {
    document
      .querySelector('#add-project')
      ?.addEventListener('click', app.handleAddProject);
    document
      .querySelector('#add-todo')
      ?.addEventListener('click', app.handleAddTodo);
    document
      .querySelector('#toggle-completed')
      ?.addEventListener('click', app.handleToggleCompleted);

    document.querySelector('#project-list')?.addEventListener('click', (e) => {
      const id = e.target.closest('li')?.dataset.id;
      if (!id) return;
      if (e.target.matches('#project-edit-btn')) {
        app.handleClickProjectEdit(id);
      } else {
        app.handleSelectProject(id);
      }
    });

    document.querySelector('#todo-list')?.addEventListener('click', (e) => {
      const id = e.target.closest('li')?.dataset.id;
      if (!id) return;
      if (e.target.matches('.complete-btn')) {
        e.target.closest('li')?.classList.add('fading-out');
        setTimeout(() => {
          app.handleToggleTodo(id);
        }, 400);
      } else if (e.target.matches('.todo-delete-btn')) {
        app.handleRemoveTodo(id);
      } else {
        app.handleSelectTodo(id);
      }
    });

    document
      .querySelector('#delete-all-completed-btn')
      ?.addEventListener('click', app.handleRemoveCompleted);

    document
      .querySelector('#delete-project-btn')
      ?.addEventListener('click', (e) => {
        if (
          !this.confirmDialog(
            '⚠️ WARNING: When you delete a project, all its tasks will be deleted as well.'
          )
        )
          return;
        app.handleDeleteProject(e.target.dataset.id);
        document.querySelector('#modal-overlay').classList.add('hidden');
      });

    document.querySelector('#toggle-sidebar')?.addEventListener('click', () => {
      document.querySelector('aside')?.classList.toggle('open');
    });
  },

  renderProjects(projects, activeId) {
    const list = document.querySelector('#project-list');
    list.innerHTML = '';
    projects.forEach((p) => {
      const li = document.createElement('li');
      const editBtn = document.createElement('button');

      li.textContent = p.name;
      li.dataset.id = p.id;
      if (p.id === activeId) {
        li.style.fontWeight = 'bold';
        // li.style.border = '2px solid grey';
        // li.style.boxShadow = '2px 2px 2px #ccc';
        li.style.backgroundColor = 'rgba(171, 233, 163, 0.3)';
      }

      editBtn.textContent = 'edit';
      editBtn.id = 'project-edit-btn';
      li.appendChild(editBtn);
      list.appendChild(li);
    });
  },

  renderTodos(todos) {
    const list = document.querySelector('#todo-list');
    list.innerHTML = '';
    todos.forEach((t) => {
      const li = document.createElement('li');
      li.dataset.id = t.id;
      li.classList.add(`priority-${t.priority}`);
      li.innerHTML = `
        <div class="left-part">  
          <button class="complete-btn">${t.completed ? 'Restore' : 'Done'}</button>
          <div class="todo-content">
            <div class="todo-title">${t.title}</div>
            <div class="todo-desc">${t.description}</div>
          </div>
        </div>
        <button class="todo-delete-btn">Delete</button>
      `;
      list.appendChild(li);
    });
  },

  toggleDeleteAllCompletedBtn(isCurrentViewCompleted) {
    const deleteAllCompleted = document.querySelector(
      '#delete-all-completed-btn'
    );
    deleteAllCompleted.classList.toggle('hidden', !isCurrentViewCompleted);
  },

  confirmDialog(message) {
    return confirm(message);
  },

  openModal({
    title,
    projectForm = false,
    editForm = false,
    defaultTodoInfo,
    activeProjectId,
    allProjects,
    targetId,
    targetProject,
    onSubmit,
  }) {
    const modal = document.querySelector('#modal');
    const form = modal.querySelector('form');
    const textAreaWrapper = modal.querySelector('#modal-description-wrapper');
    const fieldsetEl = modal.querySelector('fieldset');

    modal.querySelector('#modal-form label').textContent = title;
    textAreaWrapper.classList.toggle('hidden', projectForm);
    fieldsetEl.classList.toggle('hidden', projectForm);

    const modalDeleteProjectBtn = modal.querySelector('#delete-project-btn');
    modalDeleteProjectBtn.classList.toggle('hidden', !editForm || !projectForm);
    modalDeleteProjectBtn.dataset.id = '';
    modalDeleteProjectBtn.dataset.id = targetId;

    modal
      .querySelector('#move-to-project')
      .classList.toggle('hidden', !editForm || projectForm);

    form.reset();
    document.querySelector('#modal-overlay').classList.remove('hidden');

    const cancelBtn = modal.querySelector('#modal-cancel');
    cancelBtn?.addEventListener('click', () => {
      document.querySelector('#modal-overlay').classList.add('hidden');
    });

    form.elements.title.focus();

    if (!projectForm && editForm) {
      form.elements.title.value = defaultTodoInfo.title;
      form.elements.description.value = defaultTodoInfo.description;
      form.elements.priority.value = defaultTodoInfo.priority;

      const select = modal.querySelector('#move-to-project select');
      select.innerHTML = '';
      allProjects.forEach((p) => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.name;
        select.appendChild(option);

        if (p.id === activeProjectId) {
          option.selected = true;
        }
      });
    }

    if (projectForm && editForm) {
      form.elements.title.value = targetProject.name;
    }

    form.onsubmit = (e) => {
      e.preventDefault();
      const title = form.elements.title.value.trim();
      const name = title;
      const description = form.elements.description?.value.trim() ?? '';
      const priority = form.elements.priority?.value ?? 'low';
      const newProjectId = form.elements.project?.value;

      if (!title) return;
      document.querySelector('#modal-overlay').classList.add('hidden');
      onSubmit?.({ title, name, description, priority, newProjectId });
    };
  },
};

export default DOMController;
