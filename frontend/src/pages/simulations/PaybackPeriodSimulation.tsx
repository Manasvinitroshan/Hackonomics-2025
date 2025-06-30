// src/pages/PaybackPeriodSimulation.tsx
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

export default function PaybackPeriodSimulation() {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [annualCashInflow, setAnnualCashInflow]   = useState('');
  const [growthRate, setGrowthRate]               = useState('');
  const [timeHorizon, setTimeHorizon]             = useState('');
  const [results, setResults] = useState<
    { scenario: string; payback: number | null }[]
  >([]);
  const chartRef = useRef<any>(null);

  const simulate = () => {
    const inv = parseFloat(initialInvestment);
    const cf  = parseFloat(annualCashInflow);
    const g   = parseFloat(growthRate) / 100;
    const yrs = parseInt(timeHorizon, 10);
    if ([inv, cf, g, yrs].some(v => isNaN(v) || v <= 0)) return;

    const makeInflows = (factor: number) =>
      Array.from({ length: yrs }, (_, i) =>
        cf * Math.pow(1 + g * factor, i)
      );

    const calcPayback = (inflows: number[]) => {
      let cum = 0;
      for (let i = 0; i < inflows.length; i++) {
        cum += inflows[i];
        if (cum >= inv) return i + 1;
      }
      return null;
    };

    const base = makeInflows(1);
    const opt  = makeInflows(1.2);
    const pes  = makeInflows(0.8);

    setResults([
      { scenario: 'Optimistic',  payback: calcPayback(opt) },
      { scenario: 'Base Case',   payback: calcPayback(base) },
      { scenario: 'Pessimistic', payback: calcPayback(pes) },
    ]);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text('Payback Period Sensitivity', 40, 40);
    doc.setFontSize(12);
    doc.text(`Initial Investment: $${initialInvestment}`, 40, 70);
    doc.text(`Annual Cash Inflow: $${annualCashInflow}`, 40, 90);
    doc.text(`Growth Rate: ${growthRate}%`, 40, 110);
    doc.text(`Time Horizon: ${timeHorizon} yrs`, 40, 130);

    results.forEach((r, i) => {
      const y = 160 + i * 20;
      doc.text(
        `${r.scenario}: ${
          r.payback !== null ? r.payback + ' yrs' : 'No payback'
        }`,
        40,
        y
      );
    });

    const chart = chartRef.current;
    if (chart) {
      const img = chart.toBase64Image();
      doc.addImage(img, 'PNG', 40, 240, 520, 300);
    }

    doc.save('payback_period_simulation.pdf');
  };

  const exportToCSV = () => {
    const header = ['Scenario', 'Payback Period (yrs)'];
    const rows = results.map(r => [
      r.scenario,
      r.payback !== null ? r.payback.toString() : 'N/A',
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'payback_period_simulation.csv';
    a.click();
  };

  const chartData = {
    labels: results.map(r => r.scenario),
    datasets: [
      {
        label: 'Payback Period (yrs)',
        data: results.map(r => (r.payback !== null ? r.payback : 0)),
        backgroundColor: ['#28a745', '#4f46e5', '#ffc107'],
        borderColor: ['#28a745', '#4f46e5', '#ffc107'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 800 }}>
        <Link to="/simulation" className="back-link">
          ← Back to Simulations
        </Link>
        <h2 className="login-heading">💡 Payback Period Sensitivity</h2>
        <p className="login-subtext">
          Project how long to recoup your investment under different growth
          scenarios.
        </p>
        <div className="login-form">
          {[
            ['Initial Investment ($)', initialInvestment, setInitialInvestment],
            ['Annual Cash Inflow ($)', annualCashInflow, setAnnualCashInflow],
            ['Annual Growth Rate (%)', growthRate, setGrowthRate],
            ['Time Horizon (yrs)', timeHorizon, setTimeHorizon],
          ].map(([ph, val, set], i) => (
            <input
              key={i}
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
                boxSizing: 'border-box',
              }}
            />
          ))}

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button
              onClick={simulate}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Run Simulation
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <>
            <div style={{ marginTop: '20px' }}>
              <h4>Payback Period by Scenario</h4>
              <Bar
                ref={chartRef}
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Payback Period Comparison' },
                  },
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                marginTop: '20px',
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
                  cursor: 'pointer',
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
                  cursor: 'pointer',
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
