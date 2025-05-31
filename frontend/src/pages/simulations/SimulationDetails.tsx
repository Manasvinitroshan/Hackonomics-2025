import React from 'react';
import { useParams } from 'react-router-dom';
import RevenueForecast from './RevenueForecast';

export default function SimulationDetail() {
  const { title } = useParams();
  const decoded = decodeURIComponent(title || '');

  if (decoded === 'Revenue Forecast Simulation') {
    return <RevenueForecast />;
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-heading">{decoded}</h2>
        <p className="login-subtext">Simulation not yet implemented.</p>
      </div>
    </div>
  );
}