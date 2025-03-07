import { useState, useEffect } from 'react';
import { userProfileService } from '../services/userProfileService';

export function useUserPreferences() {
  const [preferences, setPreferences] = useState(userProfileService.getPreferences());

  useEffect(() => {
    // Subscribe to preference changes if needed
    // This could be expanded to handle real-time updates
  }, []);

  return {
    ...preferences,
    currencySymbol: preferences.currencySymbol,
    updatePreferences: (newPreferences) => {
      const updated = userProfileService.updatePreferences(newPreferences);
      setPreferences(updated);
    }
  };
} 