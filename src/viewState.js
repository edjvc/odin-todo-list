let currentView = 'project';
let activeProjectId = null;

const viewState = {
  getCurrentView() {
    return currentView;
  },

  setProjectView(id) {
    currentView = 'project';
    activeProjectId = id;
  },

  setCompletedView() {
    currentView = 'completed';
    // activeProjectId = null;
  },

  isCompletedView() {
    currentView === 'completed';
  },

  getActiveProjectId() {
    return activeProjectId;
  },

  toPlainObject() {
    if (currentView === 'project') {
      return { type: 'project', projectId: activeProjectId };
    } else if (currentView === 'completed') {
      return { type: 'completed' };
    } else {
      return null;
    }
  },

  load(plainObjectViewState) {
    currentView = plainObjectViewState.type;
    activeProjectId = plainObjectViewState.projectId;
  },
};

export default viewState;
