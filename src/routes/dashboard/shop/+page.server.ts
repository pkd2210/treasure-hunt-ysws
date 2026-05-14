export async function load({ fetch }) {
  try {
    const response = await fetch('/api/shop/getItems');
    const data = await response.json();
    const items = Array.isArray(data) ? data.filter((entry) => entry && typeof entry === 'object') : [];
    
    return {
      items,
      error: null
    };
  } catch (error) {
    console.error('Error loading shop items:', error);
    return {
      items: [],
      error: error instanceof Error ? error.message : 'Unknown error while loading shop items'
    };
  }
}
