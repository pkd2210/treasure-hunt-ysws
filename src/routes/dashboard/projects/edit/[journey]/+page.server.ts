export async function load({ fetch, params }) {
  try {
    const response = await fetch(`/api/projects/getProjects`);
    const json = await response.json();
    const projects = json || {};
    
    const journey = Number(params.journey);
    const journeyProjects = projects[journey] || [];
    
    let projectData = null;
    if (journeyProjects.length > 0) {
      const p = journeyProjects[0];
      projectData = {
        projectName: p.projectName || '',
        hackatimeProject: p.hackatimeProject || '',
        screenshot: p.screenshot || '',
        description: p.description || '',
        codeUrl: p.codeUrl || '',
        readmeUrl: p.readmeUrl || '',
        demoUrl: p.demoUrl || '',
        aiUsage: p.aiUsage || ''
      };
    }
    
    return {
      projects,
      projectData,
      error: null
    };
  } catch (error) {
    console.error('Error loading edit project:', error);
    return {
      projects: {},
      projectData: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
