import React, { useState, useEffect } from 'react';
import './UserPreferences.css';

function UserPreferences() {
  const [preferences, setPreferences] = useState({
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    currency: 'USD',
    currencySymbol: '$',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    username: 'John Doe',
    userHandle: '@johndoe',
    email: 'john.doe@example.com',
    profilePhoto: '/profile-placeholder.png'
  });

  const [newPassword, setNewPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(preferences.profilePhoto);

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  const timeFormats = [
    { value: '12', label: '12-hour' },
    { value: '24', label: '24-hour' }
  ];

  const currencies = [
    { value: 'USD', symbol: '$', label: 'US Dollar ($)' },
    { value: 'EUR', symbol: '€', label: 'Euro (€)' },
    { value: 'GBP', symbol: '£', label: 'British Pound (£)' },
    { value: 'JPY', symbol: '¥', label: 'Japanese Yen (¥)' },
    { value: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' }
  ];

  const timezones = Intl.supportedValuesOf('timeZone');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'currency' && {
        currencySymbol: currencies.find(c => c.value === value)?.symbol || '$'
      })
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setNewPassword(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setPreferences(prev => ({
          ...prev,
          profilePhoto: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the preferences to backend
    console.log('Saving preferences:', preferences);
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Here you would typically update the password
    console.log('Updating password');
    setNewPassword({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="preferences-page">
      <h1>User Preferences</h1>

      <div className="preferences-container">
        <div className="preferences-section">
          <h2>Profile Settings</h2>
          <div className="profile-photo-section">
            <img 
              src={photoPreview} 
              alt="Profile" 
              className="profile-photo"
            />
            <div className="photo-upload">
              <label htmlFor="photo-upload" className="upload-button">
                Change Photo
              </label>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Full Name</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={preferences.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="userHandle">User Handle</label>
                <input
                  type="text"
                  id="userHandle"
                  name="userHandle"
                  value={preferences.userHandle}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={preferences.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {!isEditing ? (
              <button 
                type="button" 
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <div className="button-group">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="preferences-section">
          <h2>Display Settings</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateFormat">Date Format</label>
                <select
                  id="dateFormat"
                  name="dateFormat"
                  value={preferences.dateFormat}
                  onChange={handleChange}
                >
                  {dateFormats.map(format => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="timeFormat">Time Format</label>
                <select
                  id="timeFormat"
                  name="timeFormat"
                  value={preferences.timeFormat}
                  onChange={handleChange}
                >
                  {timeFormats.map(format => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={preferences.currency}
                  onChange={handleChange}
                >
                  {currencies.map(currency => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="timezone">Timezone</label>
                <select
                  id="timezone"
                  name="timezone"
                  value={preferences.timezone}
                  onChange={handleChange}
                >
                  {timezones.map(zone => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="save-button">
              Save Preferences
            </button>
          </form>
        </div>

        <div className="preferences-section">
          <h2>Security</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="current">Current Password</label>
              <input
                type="password"
                id="current"
                name="current"
                value={newPassword.current}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="new">New Password</label>
                <input
                  type="password"
                  id="new"
                  name="new"
                  value={newPassword.new}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm">Confirm Password</label>
                <input
                  type="password"
                  id="confirm"
                  name="confirm"
                  value={newPassword.confirm}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="save-button">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserPreferences; 