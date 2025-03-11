export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}; 