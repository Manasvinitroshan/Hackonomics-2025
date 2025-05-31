import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ import Link for navigation

export default function RevenueForecast() {
  const [revenue, setRevenue] = useState('');
  const [growth, setGrowth] = useState('');
  const [forecast, setForecast] = useState<number[]>([]);

  const simulate = () => {
    const rev = parseFloat(revenue);
    const gr = parseFloat(growth) / 100;
    if (isNaN(rev) || isNaN(gr)) return;
    const results = Array.from({ length: 5 }, (_, i) =>
      +(rev * Math.pow(1 + gr, i)).toFixed(2)
    );
    setForecast(results);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* ✅ Back link */}
        <Link to="/simulation" className="back-link">
  ← Back to Simulations
</Link>


        <h2 className="login-heading">📈 Revenue Forecast Simulation</h2>
        <p className="login-subtext">
          Enter your current revenue and growth rate to forecast the next 5 years.
        </p>
        <div className="login-form">
          <input
            type="text"
            placeholder="Initial Revenue ($)"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
          />
          <input
            type="text"
            placeholder="Annual Growth Rate (%)"
            value={growth}
            onChange={(e) => setGrowth(e.target.value)}
          />
          <button type="button" onClick={simulate}>
            Run Forecast
          </button>
        </div>

        {forecast.length > 0 && (
          <>
            <h4 style={{ marginTop: '1.5rem', fontWeight: 600, fontSize: '1rem' }}>
              📊 Forecast Results
            </h4>
            <ul style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              {forecast.map((val, idx) => (
                <li key={idx}>
                  Year {idx + 1}: <strong>${val.toLocaleString()}</strong>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
