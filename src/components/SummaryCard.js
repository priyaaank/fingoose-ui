import { useUserPreferences } from '../hooks/useUserPreferences';

function SummaryCard({ title, value, change, trend }) {
  const { currencySymbol } = useUserPreferences();
  
  return (
    <div className={`summary-card ${trend}`}>
      {/* ... other JSX ... */}
      <div className="value">{currencySymbol}{(value || 0).toLocaleString()}</div>
      {/* ... other JSX ... */}
    </div>
  );
}

export default SummaryCard; 