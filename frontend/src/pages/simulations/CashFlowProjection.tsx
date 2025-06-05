import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CashFlowProjection() {
  const [form, setForm] = useState({
    startingCash: '',
    monthlyInflow: '',
    monthlyOutflow: '',
    capex: '',
    loan: '',
    tax: ''
  });

  const [projections, setProjections] = useState<number[]>([]);

  const simulate = () => {
    const {
      startingCash,
      monthlyInflow,
      monthlyOutflow,
      capex,
      loan,
      tax
    } = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, parseFloat(v)])
    );

    const months = 12;
    const results = [];

    let cash = startingCash - capex; // subtract one-time CapEx upfront

    for (let i = 1; i <= months; i++) {
      const inflow = monthlyInflow;
      const outflow = monthlyOutflow + loan;

      // add tax every 3 months
      const taxPayment = i % 3 === 0 ? tax : 0;

      cash = cash + inflow - outflow - taxPayment;
      results.push(+cash.toFixed(2));
    }

    setProjections(results);
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

        <h2 className="login-heading">💰 Cash Flow Projection Simulation</h2>
        <p className="login-subtext">
          Model your monthly cash balance and identify periods of shortfall or surplus.
        </p>

        <div className="login-form">
          <input
            type="text"
            placeholder="Starting Cash Balance ($)"
            value={form.startingCash}
            onChange={e => setForm({ ...form, startingCash: e.target.value })}
          />
          <input
            type="text"
            placeholder="Monthly Inflows ($)"
            value={form.monthlyInflow}
            onChange={e => setForm({ ...form, monthlyInflow: e.target.value })}
          />
          <input
            type="text"
            placeholder="Monthly Outflows ($)"
            value={form.monthlyOutflow}
            onChange={e => setForm({ ...form, monthlyOutflow: e.target.value })}
          />
          <input
            type="text"
            placeholder="CapEx (one-time upfront) ($)"
            value={form.capex}
            onChange={e => setForm({ ...form, capex: e.target.value })}
          />
          <input
            type="text"
            placeholder="Monthly Loan Payment ($)"
            value={form.loan}
            onChange={e => setForm({ ...form, loan: e.target.value })}
          />
          <input
            type="text"
            placeholder="Quarterly Tax Payment ($)"
            value={form.tax}
            onChange={e => setForm({ ...form, tax: e.target.value })}
          />

          <button onClick={simulate}>Run Projection</button>
        </div>

        {projections.length > 0 && (
          <>
            <div className="login-divider"><span>📈 Monthly Cash Balances</span></div>
            <ul style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              {projections.map((val, idx) => (
                <li key={idx}>
                  <strong>Month {idx + 1}:</strong>{' '}
                  <span style={{ color: val < 0 ? 'red' : 'black' }}>${val}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
