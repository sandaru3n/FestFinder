/**
 * Checks if the current user has admin role by decoding the JWT token from localStorage
 */
export function isAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Decode the token manually by splitting and parsing the payload
    const payload = token.split('.')[1];
    if (!payload) return false;
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload?.role === 'admin';
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
}

/**
 * Gets the current user's role from the JWT token
 */
export function getUserRole(): string | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    // Decode the token manually by splitting and parsing the payload
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload?.role || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Checks if a user is logged in by checking for token existence
 */
export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}

/**
 * Logs out the current user by removing the token
 */
export function logout(): void {
  localStorage.removeItem('token');
  window.location.href = '/';
} 