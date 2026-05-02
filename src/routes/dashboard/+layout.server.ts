export async function load({ fetch, parent }) {
  const parentData = await parent();
  
  try {
    const response = await fetch('/api/me');
    const userData = await response.json();
    
    return {
      slackId: userData.slackId || '',
      displayName: userData.displayName || '',
      avatarUrl: userData.imageUrl || userData.avatarUrl || '',
      user: userData
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      slackId: '',
      displayName: '',
      avatarUrl: '',
      user: null
    };
  }
}