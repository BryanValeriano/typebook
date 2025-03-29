export async function listAvailableBooks(): Promise<string[]> {
  try {
    const response = await fetch('/api/books');
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

