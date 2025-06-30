// src/pages/VAR_CFAR_Simulation.tsx
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

export default function VAR_CFAR_Simulation() {
  // Inputs
  const [initialCashFlow, setInitialCashFlow]   = useState('');
  const [volatility, setVolatility]             = useState('');
  const [confidenceLevel, setConfidenceLevel]   = useState('');
  const [timeHorizon, setTimeHorizon]           = useState('');
  const [iterations, setIterations]             = useState('');
  // Results
  const [VaR, setVaR]                           = useState<number | null>(null);
  const [CFaR, setCFaR]                         = useState<number | null>(null);
  const [distribution, setDistribution]         = useState<number[]>([]);
  const chartRef = useRef<any>(null);

  const simulate = () => {
    const cf0 = parseFloat(initialCashFlow);
    const vol = parseFloat(volatility) / 100;
    const conf = parseFloat(confidenceLevel) / 100;
    const yrs = parseInt(timeHorizon, 10);
    const iter = parseInt(iterations, 10);
    if (
      [cf0, vol, conf, yrs, iter].some(v => isNaN(v) || v <= 0)
    ) return;

    const sims: number[] = [];
    for (let i = 0; i < iter; i++) {
      // simulate CF_T = CF0 * (1 + ε)^years, ε ~ Uniform[-vol, +vol]
      const eps = (Math.random() * 2 - 1) * vol;
      const cfT = cf0 * Math.pow(1 + eps, yrs);
      sims.push(cfT);
    }
    sims.sort((a, b) => a - b);
    setDistribution(sims);

    const lowerIndex = Math.floor((1 - conf) * iter);
    const varVal = sims[lowerIndex];
    setVaR(varVal);
    setCFaR(cf0 - varVal);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text('VaR & CFaR Simulation', 40, 40);
    doc.setFontSize(12);
    doc.text(`Initial Cash Flow: $${initialCashFlow}`, 40, 70);
    doc.text(`Volatility: ${volatility}%`, 40, 90);
    doc.text(`Confidence Level: ${confidenceLevel}%`, 40, 110);
    doc.text(`Time Horizon: ${timeHorizon} yrs`, 40, 130);
    doc.text(`Iterations: ${iterations}`, 40, 150);
    if (VaR !== null && CFaR !== null) {
      doc.text(`VaR (${confidenceLevel}%): $${VaR.toFixed(2)}`, 40, 170);
      doc.text(`CFaR: $${CFaR.toFixed(2)}`, 40, 190);
    }
    const chart = chartRef.current;
    if (chart) {
      const img = chart.toBase64Image();
      doc.addImage(img, 'PNG', 40, 210, 520, 300);
    }
    doc.save('var_cfar_simulation.pdf');
  };

  const exportToCSV = () => {
    const header = ['Iteration', 'Simulated CF'];
    const rows = distribution.map((v, i) => [ (i+1).toString(), v.toFixed(2) ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'var_cfar_simulation.csv';
    a.click();
  };

  // Build histogram
  const bins = 20;
  const histData = () => {
    if (!distribution.length) return { labels: [], datasets: [] };
    const min = distribution[0], max = distribution[distribution.length - 1];
    const width = (max - min) / bins;
    const counts = Array(bins).fill(0);
    distribution.forEach(v => {
      const idx = Math.min(bins - 1, Math.floor((v - min) / width));
      counts[idx]++;
    });
    return {
      labels: counts.map((_, i) => {
        const start = (min + i * width).toFixed(0);
        const end = (min + (i + 1) * width).toFixed(0);
        return `${start}–${end}`;
      }),
      datasets: [{
        label: 'Simulated CF Distribution',
        data: counts,
        backgroundColor: 'rgba(75,192,192,0.5)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1
      }]
    };
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 800 }}>
        <Link to="/simulation" className="back-link">← Back to Simulations</Link>
        <h2 className="login-heading">📉 VaR & CFaR Simulation</h2>
        <p className="login-subtext">
          CFO‐grade risk analysis: simulate cash‐flow loss under volatility.
        </p>
        <div className="login-form">
          {[
            ['Initial Cash Flow ($)', initialCashFlow, setInitialCashFlow],
            ['Volatility (%)',       volatility,        setVolatility],
            ['Confidence Level (%)', confidenceLevel,    setConfidenceLevel],
            ['Time Horizon (yrs)',    timeHorizon,       setTimeHorizon],
            ['Iterations',            iterations,        setIterations]
          ].map(([ph, val, set], i) => (
            <input key={i}
              type="text"
              placeholder={ph}
              value={val as string}
              onChange={e => (set as any)(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: 'black',
                color: 'white',
                border: '1px solid #444',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          ))}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button onClick={simulate}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Run Simulation
            </button>
          </div>
        </div>

        {distribution.length > 0 && (
          <>
            <div style={{ marginTop: '20px' }}>
              <h4>Simulated CF Distribution</h4>
              <Bar
                ref={chartRef}
                data={histData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Cash‐Flow Distribution Histogram' }
                  }
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '20px'
            }}>
              <button onClick={exportToPDF}
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
              <button onClick={exportToCSV}
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
          </>
        )}
      </div>
    </div>
  );
}
