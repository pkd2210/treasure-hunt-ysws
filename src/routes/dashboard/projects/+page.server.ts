export async function load({ fetch }) {
  try {
    const response = await fetch('/api/projects/getProjects');
    const data = await response.json();
    const projects = typeof data === 'object' && data !== null ? data : {};
    
    return {
      projects,
      projectAmount: Object.keys(projects).length,
      error: null
    };
  } catch (error) {
    console.error('Error loading projects:', error);
    return {
      projects: {},
      projectAmount: 0,
      error: error instanceof Error ? error.message : 'Unknown error while loading projects'
    };
  }
}
