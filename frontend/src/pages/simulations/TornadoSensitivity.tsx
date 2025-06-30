// src/pages/TornadoSensitivity.tsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '/Users/manassingh/LeanFoundr/frontend/src/styles/login.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DEFAULT_VARS = [
  { name: 'Price',        base: 100, swing: 20 },
  { name: 'Cost',          base: 60, swing: 20 },
  { name: 'Volume',      base:1000, swing: 20 },
  { name: 'Fixed Costs', base:20000, swing: 0 }
];

const METRICS = {
  NPV: (v: Record<string, number>) =>
    v.Price * v.Volume - v.Cost * v.Volume - v['Fixed Costs'],
  'IRR Proxy': (v: Record<string, number>) =>
    ((v.Price - v.Cost) / v.Cost) * 100,
  'EPS Proxy': (v: Record<string, number>) =>
    (v.Price * v.Volume - v.Cost * v.Volume - v['Fixed Costs']) /
    10000
};

export default function TornadoSensitivity() {
  const [variables, setVariables] = useState(DEFAULT_VARS);
  const [metric, setMetric] = useState<keyof typeof METRICS>('NPV');
  const chartRef = useRef<any>(null);

  // Compute base value
  const baseVars = Object.fromEntries(variables.map(v => [v.name, v.base]));
  const baseVal = METRICS[metric](baseVars);

  // Compute scenario impacts
  const results = variables
    .map(v => {
      const highVars = { ...baseVars, [v.name]: v.base * (1 + v.swing / 100) };
      const lowVars  = { ...baseVars, [v.name]: v.base * (1 - v.swing / 100) };
      const highVal = METRICS[metric](highVars);
      const lowVal  = METRICS[metric](lowVars);
      const highImp = highVal - baseVal;
      const lowImp  = lowVal - baseVal;
      return {
        variable: v.name,
        lowImpact: +lowImp.toFixed(2),
        highImpact: +highImp.toFixed(2),
        lowPct:  +(lowImp / baseVal * 100).toFixed(2),
        highPct: +(highImp / baseVal * 100).toFixed(2)
      };
    })
    .sort((a, b) =>
      (Math.abs(b.highImpact) + Math.abs(b.lowImpact)) -
      (Math.abs(a.highImpact) + Math.abs(a.lowImpact))
    );

  const recalculate = () => {
    // Trigger re-render with new swings
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ unit:'pt', format:'a4' });
    doc.setFont('helvetica','normal');
    doc.setFontSize(16);
    doc.text('Tornado Sensitivity Analysis', 40, 40);
    doc.setFontSize(12);
    doc.text(`Metric: ${metric}`, 40, 60);
    doc.text(`Base ${metric}: ${baseVal.toFixed(2)}`, 250, 60);

    const chart = chartRef.current;
    if (chart) {
      const img = chart.toBase64Image();
      doc.addImage(img, 'PNG', 40, 80, 520, 300);
    }
    doc.save('TornadoSensitivity.pdf');
  };

  const exportToCSV = () => {
    const header = ['Variable','Low Impact','High Impact','Low %','High %'];
    const rows = results.map(r => [
      r.variable,
      r.lowImpact.toString(),
      r.highImpact.toString(),
      r.lowPct.toString(),
      r.highPct.toString()
    ]);
    const csv = [header, ...rows].map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'TornadoSensitivity.csv';
    a.click();
  };

  const chartData = {
    labels: results.map(r => r.variable),
    datasets: [
      {
        label: 'Low Impact',
        data: results.map(r => r.lowImpact),
        backgroundColor: 'rgba(55,48,163,0.5)',
        borderColor: 'rgba(55,48,163,1)',
        borderWidth: 1
      },
      {
        label: 'High Impact',
        data: results.map(r => r.highImpact),
        backgroundColor: 'rgba(79,70,229,0.5)',
        borderColor: 'rgba(79,70,229,1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 800 }}>
        <Link to="/simulation" className="back-link">← Back to Simulations</Link>
        <h2 className="login-heading">📊 Tornado Sensitivity Analysis</h2>
        <p className="login-subtext">
          See which variables drive your <strong>{metric}</strong> most.
        </p>

        <div className="login-form">
          <label
            htmlFor="metric-select"
            style={{
              display: 'block',
              color: 'white',
              fontWeight: 600,
              marginBottom: '8px',
              fontSize: '1rem'
            }}
          >
            Metric
          </label>
          <select
            id="metric-select"
            value={metric}
            onChange={e => setMetric(e.target.value as any)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '1rem',
              marginBottom: '20px',
              backgroundColor: 'black',
              color: 'white',
              border: '1px solid #444',
              borderRadius: '4px',
              appearance: 'none'
            }}
          >
            {Object.keys(METRICS).map(m => (
              <option
                key={m}
                value={m}
                style={{ backgroundColor: 'black', color: 'white', fontSize: '1rem' }}
              >
                {m}
              </option>
            ))}
          </select>

          {variables.map((v, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'white',
                  marginBottom: '4px'
                }}
              >
                <span>{v.name} (Base: {v.base})</span>
                <span>Swing ±{v.swing}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={v.swing}
                onChange={e => {
                  const arr = [...variables];
                  arr[i].swing = +e.target.value;
                  setVariables(arr);
                }}
                style={{ width: '100%' }}
              />
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
            <button
              onClick={recalculate}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Recalculate
            </button>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <Bar
            ref={chartRef}
            data={chartData}
            options={{
              indexAxis: 'y',
              responsive: true,
              plugins: {
                legend: { position: 'top', labels: { color: 'white' } },
                title: { display: true, text: 'Variable Impact', color: 'white' }
              },
              scales: {
                x: { ticks: { color: 'white' } },
                y: { ticks: { color: 'white' } }
              }
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px'
          }}
        >
          <button
            onClick={exportToPDF}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Export to PDF
          </button>
          <button
            onClick={exportToCSV}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffc107',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
}
