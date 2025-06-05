import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ExpenseBudgetSimulation() {
  const [inputs, setInputs] = useState({
    cogs: '',
    cogsGrowth: '',
    sgna: '',
    sgnaGrowth: '',
    rnd: '',
    rndGrowth: ''
  });

  const [results, setResults] = useState<
    { year: number; cogs: number; sgna: number; rnd: number; total: number }[]
  >([]);

  const simulate = () => {
    const parsed = {
      cogs: parseFloat(inputs.cogs),
      cogsGrowth: parseFloat(inputs.cogsGrowth),
      sgna: parseFloat(inputs.sgna),
      sgnaGrowth: parseFloat(inputs.sgnaGrowth),
      rnd: parseFloat(inputs.rnd),
      rndGrowth: parseFloat(inputs.rndGrowth)
    };

    const data = Array.from({ length: 5 }, (_, i) => {
      const year = i + 1;
      const cogs = +(parsed.cogs * Math.pow(1 + parsed.cogsGrowth / 100, i)).toFixed(2);
      const sgna = +(parsed.sgna * Math.pow(1 + parsed.sgnaGrowth / 100, i)).toFixed(2);
      const rnd = +(parsed.rnd * Math.pow(1 + parsed.rndGrowth / 100, i)).toFixed(2);
      const total = +(cogs + sgna + rnd).toFixed(2);
      return { year, cogs, sgna, rnd, total };
    });

    setResults(data);
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '600px' }}>
        <Link
          to="/simulation"
          style={{
            fontSize: '0.875rem',
            color: '#6366f1',
            marginBottom: '0.75rem',
            display: 'inline-block'
          }}
        >
          ← Back to Simulations
        </Link>

        <h2 className="login-heading">🧾 Expense/Budget Simulation</h2>
        <p className="login-subtext">
          Estimate COGS, SG&A, and R&D over 5 years based on cost inflation assumptions.
        </p>

        <div className="login-form">
          <input
            type="text"
            className="login-input"
            placeholder="Initial COGS ($)"
            value={inputs.cogs}
            onChange={e => setInputs({ ...inputs, cogs: e.target.value })}
          />
          <input
            type="text"
            className="login-input"
            placeholder="COGS Growth Rate (%)"
            value={inputs.cogsGrowth}
            onChange={e => setInputs({ ...inputs, cogsGrowth: e.target.value })}
          />

          <input
            type="text"
            className="login-input"
            placeholder="Initial SG&A ($)"
            value={inputs.sgna}
            onChange={e => setInputs({ ...inputs, sgna: e.target.value })}
          />
          <input
            type="text"
            className="login-input"
            placeholder="SG&A Growth Rate (%)"
            value={inputs.sgnaGrowth}
            onChange={e => setInputs({ ...inputs, sgnaGrowth: e.target.value })}
          />

          <input
            type="text"
            className="login-input"
            placeholder="Initial R&D ($)"
            value={inputs.rnd}
            onChange={e => setInputs({ ...inputs, rnd: e.target.value })}
          />
          <input
            type="text"
            className="login-input"
            placeholder="R&D Growth Rate (%)"
            value={inputs.rndGrowth}
            onChange={e => setInputs({ ...inputs, rndGrowth: e.target.value })}
          />

          <button onClick={simulate}>Run Simulation</button>
        </div>

        {results.length > 0 && (
          <>
            <div className="login-divider"><span>📊 Expense Projections</span></div>
            <ul style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              {results.map((r, idx) => (
                <li key={idx}>
                  <strong>Year {r.year}</strong>: COGS: ${r.cogs}, SG&A: ${r.sgna}, R&D: ${r.rnd}, <strong>Total: ${r.total}</strong>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
