const environments = {
  development: {
    apiUrl: 'http://127.0.0.1:5000/api'
  },
  uat: {
    apiUrl: 'https://uat-api.wealthtracker.com/api'  // Example UAT URL
  },
  production: {
    apiUrl: 'https://api.wealthtracker.com/api'      // Example Production URL
  }
};

const env = process.env.REACT_APP_ENV || 'development';

export const config = environments[env]; 