const STORAGE_KEY = 'todoAppData';
const STORAGE_VERSION = 1;

const storageController = {
  save(projects, todos, viewState) {
    const data = {
      version: STORAGE_VERSION,
      data: {
        projects,
        todos,
        viewState,
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed.version !== STORAGE_VERSION)
        throw new Error('Version mismatch');
      return parsed.data;
    } catch (err) {
      console.warn('Storage load failed:', err);
      return null;
    }
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
};

export default storageController;
