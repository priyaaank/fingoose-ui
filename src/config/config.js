const environments = {
  development: {
    apiUrl: 'http://127.0.0.1:5000/api'
  },
  production: {
    apiUrl: 'https://localhost:5000/api'      // Example Production URL
  }
};

const env = process.env.REACT_APP_ENV || 'development';

export const config = environments[env]; 