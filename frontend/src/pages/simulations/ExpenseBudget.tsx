// src/pages/ExpenseBudgetSimulation.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ExpenseBudgetSimulation() {
  const [income0, setIncome0]             = useState('');
  const [incomeGrowth, setIncomeGrowth]   = useState('');
  const [fixed0, setFixed0]               = useState('');
  const [fixedGrowth, setFixedGrowth]     = useState('');
  const [variable0, setVariable0]         = useState('');
  const [variableGrowth, setVariableGrowth] = useState('');
  const [years, setYears]                 = useState('');

  const [baseNet, setBaseNet] = useState<number[]>([]);
  const [optNet, setOptNet]   = useState<number[]>([]);
  const [pesNet, setPesNet]   = useState<number[]>([]);

  const chartRef = useRef<any>(null);

  // 1) Compute forecasts
  const simulate = () => {
    const inc0 = parseFloat(income0);
    const ig   = parseFloat(incomeGrowth)   / 100;
    const f0   = parseFloat(fixed0);
    const fg   = parseFloat(fixedGrowth)    / 100;
    const v0   = parseFloat(variable0);
    const vg   = parseFloat(variableGrowth) / 100;
    const n    = parseInt(years, 10);
    if ([inc0, ig, f0, fg, v0, vg, n].some(v => isNaN(v) || v < 0)) return;

    const base: number[] = [], opt: number[] = [], pes: number[] = [];
    for (let i = 1; i <= n; i++) {
      const inc_i   = inc0 * Math.pow(1 + ig, i);
      const fixed_i = f0   * Math.pow(1 + fg, i);
      const var_i   = v0   * Math.pow(1 + vg, i);
      base.push(+((inc_i - (fixed_i + var_i)).toFixed(2)));

      // optimistic: slower cost growth
      const fixedOpt = f0 * Math.pow(1 + fg * 0.8, i);
      const varOpt   = v0 * Math.pow(1 + vg * 0.8, i);
      opt.push(+((inc_i - (fixedOpt + varOpt)).toFixed(2)));

      // pessimistic: faster cost growth
      const fixedPes = f0 * Math.pow(1 + fg * 1.2, i);
      const varPes   = v0 * Math.pow(1 + vg * 1.2, i);
      pes.push(+((inc_i - (fixedPes + varPes)).toFixed(2)));
    }

    setBaseNet(base);
    setOptNet(opt);
    setPesNet(pes);
  };

  // 2) After chart renders, upload to S3 + record in DB
  useEffect(() => {
    if (baseNet.length === 0) return;
    const timeout = setTimeout(async () => {
      try {
        const img = chartRef.current?.toBase64Image();
        if (!img) throw new Error('Chart not ready');

        await axios.post('/api/simulations', {
          userId:         'anonymous',
          simulationType: 'ExpenseBudget',
          parameters:     { income0, incomeGrowth, fixed0, fixedGrowth, variable0, variableGrowth, years },
          results:        { baseNet, optNet, pesNet },
          chartImage:     img
        });
        console.log('Expense/Budget simulation saved');
      } catch (e) {
        console.error('Upload failed', e);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [baseNet, optNet, pesNet, income0, incomeGrowth, fixed0, fixedGrowth, variable0, variableGrowth, years]);

  const exportToPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.text('Expense/Budget Simulation', 40, 40);
    doc.setFontSize(12);
    doc.text(`Initial Income: $${income0}`, 40, 70);
    doc.text(`Income Growth: ${incomeGrowth}%`, 40, 90);
    doc.text(`Initial Fixed Costs: $${fixed0}`, 40, 110);
    doc.text(`Fixed Cost Growth: ${fixedGrowth}%`, 40, 130);
    doc.text(`Initial Variable Costs: $${variable0}`, 40, 150);
    doc.text(`Variable Cost Growth: ${variableGrowth}%`, 40, 170);
    doc.text(`Time Horizon: ${years} yrs`, 40, 190);

    const chart = chartRef.current;
    if (chart) {
      const img = chart.toBase64Image();
      doc.addImage(img, 'PNG', 40, 210, 500, 300);
    }

    doc.save('expense_budget_simulation.pdf');
  };

  const exportToCSV = () => {
    const header = ['Year','Base Net','Optimistic Net','Pessimistic Net'];
    const rows = baseNet.map((_, i) => [
      `Year ${i + 1}`,
      baseNet[i].toString(),
      optNet[i].toString(),
      pesNet[i].toString()
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'expense_budget_simulation.csv';
    link.click();
  };

  const chartData = {
    labels: baseNet.map((_, i) => `Year ${i + 1}`),
    datasets: [
      { label: 'Base Case',             data: baseNet, borderColor: '#4f46e5', tension: 0.1 },
      { label: 'Optimistic (↓cost↗)',    data: optNet,   borderColor: '#3730a3', tension: 0.1 },
      { label: 'Pessimistic (↑cost↘)',   data: pesNet,   borderColor: '#818cf8', tension: 0.1 }
    ]
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/simulation" className="back-link">← Back to Simulations</Link>
        <h2 className="login-heading">💰 Expense/Budget Simulation</h2>
        <p className="login-subtext">
          CFO-level budget forecasting: enter growth & cost assumptions over your horizon.
        </p>

        <div className="login-form">
          {[
            ['Initial Income ($)',       income0,         setIncome0],
            ['Income Growth Rate (%)',   incomeGrowth,    setIncomeGrowth],
            ['Initial Fixed Costs ($)',  fixed0,          setFixed0],
            ['Fixed Cost Growth (%)',    fixedGrowth,     setFixedGrowth],
            ['Initial Variable Costs ($)',variable0,       setVariable0],
            ['Variable Cost Growth (%)', variableGrowth,  setVariableGrowth],
            ['Time Horizon (yrs)',       years,           setYears]
          ].map(([ph, val, setter], idx) => (
            <input
              key={idx}
              type="text"
              placeholder={ph}
              value={val as string}
              onChange={e => (setter as any)(e.target.value)}
              style={{
                color: 'white',
                backgroundColor: 'black',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #444',
                borderRadius: '4px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          ))}

          <button
            onClick={simulate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '20px',
              whiteSpace: 'nowrap'
            }}
          >
            Run Forecast
          </button>
        </div>

        {baseNet.length > 0 && (
          <>
            <h4 style={{ margin: '1.5rem 0 0.5rem', fontWeight: 600 }}>💡 Forecast Results</h4>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.875rem' }}>
              {baseNet.map((_, i) => (
                <li key={i}>
                  Year {i + 1}: Base <strong>${baseNet[i].toLocaleString()}</strong>,{' '}
                  Opt <strong>${optNet[i].toLocaleString()}</strong>,{' '}
                  Pes <strong>${pesNet[i].toLocaleString()}</strong>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '20px' }}>
              <h4>Budget vs. Expense Net</h4>
              <Line
                ref={chartRef}
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Net Cashflow Scenarios' }
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
              <button
                onClick={exportToPDF}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4f46e5',
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
                  backgroundColor: '#4f46e5',
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
