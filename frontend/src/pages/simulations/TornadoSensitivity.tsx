import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import '/Users/manassingh/LeanFoundr/frontend/src/styles/login.css';

const defaultVariables = [
  { name: 'Price', base: 100, swing: 20 },
  { name: 'Cost', base: 60, swing: 20 },
  { name: 'Volume', base: 1000, swing: 20 },
  { name: 'Fixed Costs', base: 20000, swing: 0 }
];

const metrics = {
  'NPV': (vars: Record<string, number>) => (vars.Price - vars.Cost) * vars.Volume - vars['Fixed Costs'],
  'IRR Proxy': (vars: Record<string, number>) => ((vars.Price - vars.Cost) / vars.Cost) * 100,
  'EPS Proxy': (vars: Record<string, number>) => (vars.Price * vars.Volume - vars.Cost * vars.Volume - vars['Fixed Costs']) / 10000
};

export default function TornadoSensitivity() {
  const [variables, setVariables] = useState(defaultVariables);
  const [metric, setMetric] = useState('NPV');

  const baseVars = Object.fromEntries(variables.map(v => [v.name, v.base]));
  const baseResult = metrics[metric](baseVars);

  const results = variables.map(v => {
    const high = { ...baseVars, [v.name]: v.base * (1 + v.swing / 100) };
    const low = { ...baseVars, [v.name]: v.base * (1 - v.swing / 100) };
    return {
      variable: v.name,
      lowImpact: +(metrics[metric](low) - baseResult).toFixed(2),
      highImpact: +(metrics[metric](high) - baseResult).toFixed(2)
    };
  });

  const exportToExcel = () => {
    const data = results.map(r => ({
      Variable: r.variable,
      'Low Impact': r.lowImpact,
      'High Impact': r.highImpact
    }));
    const sheet = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, 'Tornado');
    XLSX.writeFile(wb, 'TornadoSensitivity.xlsx');
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '800px' }}>
        <h2 className="login-heading">📊 Tornado Sensitivity Analysis</h2>
        <p className="login-subtext">Visualize which assumptions drive your metric the most.</p>

        <div className="login-form">
          <label>Metric:</label>
          <select
            value={metric}
            onChange={e => setMetric(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '0.5rem', marginBottom: '1rem', width: '100%' }}
          >
            {Object.keys(metrics).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {variables.map((v, idx) => (
            <div key={idx} style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: '600' }}>{v.name} — Base: ${v.base}, Swing: ±{v.swing}%</label>
              <input
                type="range"
                min={0}
                max={50}
                value={v.swing}
                onChange={e => {
                  const updated = [...variables];
                  updated[idx].swing = +e.target.value;
                  setVariables(updated);
                }}
              />
            </div>
          ))}
        </div>

        <h4 style={{ marginTop: '1rem' }}>Tornado Chart Data</h4>
        <ul style={{ fontSize: '0.875rem', lineHeight: 1.75 }}>
          {results
            .sort((a, b) => Math.abs(b.highImpact - b.lowImpact) - Math.abs(a.highImpact - a.lowImpact))
            .map((r, i) => (
              <li key={i}>
                <strong>{r.variable}</strong>: Low Impact: {r.lowImpact}, High Impact: {r.highImpact}
              </li>
            ))}
        </ul>

        <button onClick={exportToExcel} style={{ marginTop: '1rem' }}>📥 Export to Excel</button>
      </div>
    </div>
  );
}
