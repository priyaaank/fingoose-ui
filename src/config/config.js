const environments = {
  development: {
    apiUrl: 'http://127.0.0.1:5000/api'
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://api.wealthtracker.com/api'
  }
};

const env = process.env.REACT_APP_ENV || 'development';

export const config = environments[env]; 