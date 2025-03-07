// Create a singleton instance
const authService = {
  signOut() {
    // Clear any auth tokens or user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Add any other cleanup needed for logout
  },

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }
};

// Export the singleton instance
export { authService };