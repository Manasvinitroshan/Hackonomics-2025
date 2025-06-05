import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function BudgetVariance() {
  const [form, setForm] = useState({
    budgetRevenue: '',
    actualRevenue: '',
    budgetExpense: '',
    actualExpense: '',
    revenueChange: '',
    expenseChange: ''
  });

  const [result, setResult] = useState<null | {
    originalNet: number;
    adjustedNet: number;
    variance: number;
    lineItems: { label: string; original: number; adjusted: number; diff: number }[];
  }>(null);

  const runSimulation = () => {
    const bRev = parseFloat(form.budgetRevenue);
    const aRev = parseFloat(form.actualRevenue);
    const bExp = parseFloat(form.budgetExpense);
    const aExp = parseFloat(form.actualExpense);
    const revDelta = parseFloat(form.revenueChange) / 100;
    const expDelta = parseFloat(form.expenseChange) / 100;

    const originalNet = aRev - aExp;
    const adjustedRev = aRev * (1 + revDelta);
    const adjustedExp = aExp * (1 + expDelta);
    const adjustedNet = adjustedRev - adjustedExp;
    const variance = adjustedNet - originalNet;

    setResult({
      originalNet: +originalNet.toFixed(2),
      adjustedNet: +adjustedNet.toFixed(2),
      variance: +variance.toFixed(2),
      lineItems: [
        {
          label: 'Revenue',
          original: aRev,
          adjusted: adjustedRev,
          diff: adjustedRev - aRev
        },
        {
          label: 'Expense',
          original: aExp,
          adjusted: adjustedExp,
          diff: adjustedExp - aExp
        }
      ]
    });
  };

  const exportCSV = () => {
    if (!result) return;

    const rows = [
      ['Line Item', 'Original ($)', 'Adjusted ($)', 'Variance ($)'],
      ...result.lineItems.map(row => [
        row.label,
        row.original.toFixed(2),
        row.adjusted.toFixed(2),
        (row.diff).toFixed(2)
      ]),
      [],
      ['Original Net Income', result.originalNet],
      ['Adjusted Net Income', result.adjustedNet],
      ['Net Variance', result.variance]
    ];

    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'budget-variance.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = {
    labels: ['Net Income'],
    datasets: [
      {
        label: 'Original',
        data: [result?.originalNet || 0],
        backgroundColor: '#a5b4fc'
      },
      {
        label: 'Adjusted',
        data: [result?.adjustedNet || 0],
        backgroundColor: '#6366f1'
      }
    ]
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '720px' }}>
        <Link
          to="/simulation"
          style={{ fontSize: '0.875rem', color: '#6366f1', marginBottom: '0.75rem', display: 'inline-block' }}
        >
          ← Back to Simulations
        </Link>

        <h2 className="login-heading">📊 Budget Variance What‑If Analysis</h2>
        <p className="login-subtext">
          Compare actuals to budget and simulate “what if” changes in line items.
        </p>

        <div className="login-form">
          <input type="text" placeholder="Budgeted Revenue ($)" value={form.budgetRevenue} onChange={(e) => setForm({ ...form, budgetRevenue: e.target.value })} />
          <input type="text" placeholder="Actual Revenue ($)" value={form.actualRevenue} onChange={(e) => setForm({ ...form, actualRevenue: e.target.value })} />
          <input type="text" placeholder="Budgeted Expense ($)" value={form.budgetExpense} onChange={(e) => setForm({ ...form, budgetExpense: e.target.value })} />
          <input type="text" placeholder="Actual Expense ($)" value={form.actualExpense} onChange={(e) => setForm({ ...form, actualExpense: e.target.value })} />
          <input type="text" placeholder="What‑If Revenue Change (%)" value={form.revenueChange} onChange={(e) => setForm({ ...form, revenueChange: e.target.value })} />
          <input type="text" placeholder="What‑If Expense Change (%)" value={form.expenseChange} onChange={(e) => setForm({ ...form, expenseChange: e.target.value })} />
          <button onClick={runSimulation}>Run Analysis</button>
        </div>

        {result && (
          <>
            <div className="login-divider"><span>📉 Variance Results</span></div>

            <ul style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              {result.lineItems.map((line, idx) => (
                <li key={idx}>
                  <strong>{line.label}:</strong> {line.original.toFixed(2)} → {line.adjusted.toFixed(2)} (
                  {line.diff >= 0 ? '+' : ''}{line.diff.toFixed(2)})
                </li>
              ))}
              <li><strong>Original Net Income:</strong> ${result.originalNet}</li>
              <li><strong>Adjusted Net Income:</strong> ${result.adjustedNet}</li>
              <li>
                <strong>Variance Impact:</strong>{' '}
                <span style={{ color: result.variance < 0 ? 'red' : 'green' }}>
                  {result.variance >= 0 ? '+' : ''}${result.variance}
                </span>
              </li>
            </ul>

            <div style={{ marginTop: '1.5rem' }}>
              <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '1rem' }}>
              <button onClick={exportCSV}>Export CSV</button>
              <button onClick={() => window.print()}>Save as PDF</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
