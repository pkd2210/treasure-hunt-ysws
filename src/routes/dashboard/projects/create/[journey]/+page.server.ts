export async function load({ fetch, params }) {
  try {
    const response = await fetch(`/api/projects/getProjects`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    const projectsData = await response.json();
    const journey = Number(params.journey);
    
    // Convert object to array if needed
    let projectsArray = Array.isArray(projectsData) ? projectsData : Object.values(projectsData).flat();
    
    // Filter to only actual projects (not eligibility records)
    const actualProjects = projectsArray.filter(p => p.projectName);
    
    // Organize projects by journey
    const newProjects = {};
    actualProjects.forEach(p => {
      if (!newProjects[p.journeyNumber]) {
        newProjects[p.journeyNumber] = [];
      }
      newProjects[p.journeyNumber].push(p);
    });
    
    const isCreateable = (journeyNum) => {
      if (newProjects[journeyNum]?.length) return false;
      if (journeyNum === 1) return true;
      
      const prevJourneySubmitted = newProjects[journeyNum - 1]?.length > 0;
      if (!prevJourneySubmitted) return false;
      
      if (journeyNum > 2) {
        const twoBackApproved = newProjects[journeyNum - 2]?.some((project) => project.status === 'APPROVED');
        if (!twoBackApproved) return false;
      }
      
      return true;
    };
    
    const getErrorMessage = (journeyNum) => {
      if (newProjects[journeyNum]?.length) {
        return `You already have a project for Journey ${journeyNum}!`;
      }
      
      if (journeyNum > 1) {
        const prevJourneySubmitted = newProjects[journeyNum - 1]?.length > 0;
        if (!prevJourneySubmitted) {
          return `Complete Journey ${journeyNum - 1} before attempting Journey ${journeyNum}!`;
        }
        
        if (journeyNum > 2) {
          const twoBackApproved = newProjects[journeyNum - 2]?.some((project) => project.status === 'APPROVED');
          if (!twoBackApproved) {
            return `Journey ${journeyNum - 2} must be APPROVED before you can create for Journey ${journeyNum}!`;
          }
        }
      }
      return 'You cannot create this project.';
    };
    
    return {
      projects: newProjects,
      canCreate: isCreateable(journey),
      errorMessage: isCreateable(journey) ? '' : getErrorMessage(journey),
      error: null
    };
  } catch (error) {
    console.error('Error loading create project:', error);
    return {
      projects: {},
      canCreate: false,
      errorMessage: 'Failed to load projects',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
