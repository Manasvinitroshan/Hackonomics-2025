import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

interface ScenarioInput {
  growth: string;
  margin: string;
  leverage: string;
}

export default function BestCaseWorstCase() {
  const [inputs, setInputs] = useState<{
    optimistic: ScenarioInput;
    base: ScenarioInput;
    pessimistic: ScenarioInput;
  }>({
    optimistic: { growth: '', margin: '', leverage: '' },
    base: { growth: '', margin: '', leverage: '' },
    pessimistic: { growth: '', margin: '', leverage: '' },
  });

  const [results, setResults] = useState<null | Record<string, any>>(null);

  const handleChange = (key: keyof typeof inputs, field: keyof ScenarioInput, value: string) => {
    setInputs(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const compute = ({ growth, margin, leverage }: ScenarioInput) => {
    const rev = 1000 * (1 + parseFloat(growth || '0') / 100);
    const grossProfit = rev * (parseFloat(margin || '0') / 100);
    const ebitda = grossProfit - parseFloat(leverage || '0');
    const netIncome = ebitda * 0.75;
    const freeCashFlow = netIncome - 50;
    return {
      revenue: +rev.toFixed(2),
      ebitda: +ebitda.toFixed(2),
      netIncome: +netIncome.toFixed(2),
      freeCashFlow: +freeCashFlow.toFixed(2)
    };
  };

  const runAnalysis = () => {
    setResults({
      Optimistic: compute(inputs.optimistic),
      Base: compute(inputs.base),
      Pessimistic: compute(inputs.pessimistic)
    });
  };

  const downloadCSV = () => {
    if (!results) return;
    const headers = ['Scenario', 'Revenue', 'EBITDA', 'Net Income', 'Free Cash Flow'];
    const rows = Object.entries(results).map(([k, v]) =>
      [k, v.revenue, v.ebitda, v.netIncome, v.freeCashFlow].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scenario-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = results
    ? {
        labels: ['Revenue', 'EBITDA', 'Net Income', 'Free Cash Flow'],
        datasets: Object.entries(results).map(([label, data], idx) => ({
          label,
          data: [data.revenue, data.ebitda, data.netIncome, data.freeCashFlow],
          backgroundColor: ['#6366f1', '#10b981', '#f59e0b'][idx]
        }))
      }
    : null;

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '900px' }}>
        <Link
          to="/simulation"
          style={{ fontSize: '0.875rem', color: '#6366f1', marginBottom: '1rem', display: 'inline-block' }}
        >
          ← Back to Simulations
        </Link>

        <h2 className="login-heading">🔀 Best‑Case/Worst‑Case Scenario Analysis</h2>
        <p className="login-subtext">Explore outcomes across optimistic, base, and pessimistic assumptions.</p>

        <div className="login-form">
          {['optimistic', 'base', 'pessimistic'].map((scenario) => (
            <div key={scenario} style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Case
              </h4>
              <input
                type="text"
                placeholder="Revenue Growth Rate (%)"
                value={inputs[scenario as keyof typeof inputs].growth}
                onChange={(e) => handleChange(scenario as keyof typeof inputs, 'growth', e.target.value)}
              />
              <input
                type="text"
                placeholder="Gross Margin (%)"
                value={inputs[scenario as keyof typeof inputs].margin}
                onChange={(e) => handleChange(scenario as keyof typeof inputs, 'margin', e.target.value)}
              />
              <input
                type="text"
                placeholder="Operating Leverage ($)"
                value={inputs[scenario as keyof typeof inputs].leverage}
                onChange={(e) => handleChange(scenario as keyof typeof inputs, 'leverage', e.target.value)}
              />
            </div>
          ))}
          <button onClick={runAnalysis}>Run Analysis</button>
        </div>

        {results && (
          <>
            <div className="login-divider"><span>📊 Scenario Results</span></div>
            <button onClick={downloadCSV} style={{ marginBottom: '1rem' }}>
              📥 Download CSV
            </button>

            {/* Bar Chart */}
            {chartData && (
              <div style={{ marginBottom: '2rem' }}>
                <Bar data={chartData} />
              </div>
            )}

            {/* Detailed Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {Object.entries(results).map(([label, data]) => (
                <div key={label} className="event-card">
                  <h4>{label}</h4>
                  <p><strong>Revenue:</strong> ${data.revenue}</p>
                  <p><strong>EBITDA:</strong> ${data.ebitda}</p>
                  <p><strong>Net Income:</strong> ${data.netIncome}</p>
                  <p><strong>Free Cash Flow:</strong> ${data.freeCashFlow}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
