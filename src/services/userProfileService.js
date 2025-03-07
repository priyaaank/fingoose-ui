class UserProfileService {
  constructor() {
    this.defaultPreferences = {
      currencySymbol: '₹',
      currencyCode: 'INR',
      locale: 'en-IN',
      dateFormat: 'DD/MM/YYYY'
    };
    
    // Load preferences from localStorage if they exist
    const savedPreferences = localStorage.getItem('userPreferences');
    this.preferences = savedPreferences ? 
      JSON.parse(savedPreferences) : 
      this.defaultPreferences;
  }

  getPreferences() {
    return this.preferences;
  }

  getCurrencySymbol() {
    return this.preferences.currencySymbol;
  }

  getLocale() {
    return this.preferences.locale;
  }

  formatCurrency(value) {
    if (value == null) return '';
    return new Intl.NumberFormat(this.preferences.locale, {
      style: 'currency',
      currency: this.preferences.currencyCode
    }).format(value);
  }

  formatNumber(value) {
    if (value == null) return '';
    return new Intl.NumberFormat(this.preferences.locale).format(value);
  }

  updatePreferences(newPreferences) {
    this.preferences = {
      ...this.preferences,
      ...newPreferences
    };
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    return this.preferences;
  }

  resetPreferences() {
    this.preferences = this.defaultPreferences;
    localStorage.setItem('userPreferences', JSON.stringify(this.defaultPreferences));
    return this.preferences;
  }
}

export const userProfileService = new UserProfileService(); 