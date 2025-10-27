
// Change this if you deploy your backend online
const BASE_URL = 'http://localhost:8080';  

// Fetch all lessons from backend
export async function getLessons() {
  try {
    const response = await fetch(`${BASE_URL}/lessons`);
    if (!response.ok) throw new Error(`Failed to fetch lessons: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
}

// Submit a new order to backend
export async function postOrder(order) {
  try {
    const response = await fetch(`${BASE_URL}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error(`Failed to submit order: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error posting order:', error);
    throw error;
  }
}
