// src/pages/BudgetVarianceSimulation.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BudgetVarianceSimulation() {
  const YEARS = 5;

  const [budgeted, setBudgeted]   = useState<string[]>(Array(YEARS).fill(''));
  const [actual, setActual]       = useState<string[]>(Array(YEARS).fill(''));
  const [optAdjust, setOptAdjust] = useState('');  // %
  const [pesAdjust, setPesAdjust] = useState('');  // %

  const [baseVar, setBaseVar] = useState<number[]>([]);
  const [optVar, setOptVar]   = useState<number[]>([]);
  const [pesVar, setPesVar]   = useState<number[]>([]);

  const chartRef = useRef<any>(null);

  // 1) calculate variances
  const simulate = () => {
    const b = budgeted.map(v => parseFloat(v));
    const a = actual.map(v   => parseFloat(v));
    const oAdj = parseFloat(optAdjust) / 100;
    const pAdj = parseFloat(pesAdjust) / 100;
    if (b.some(isNaN) || a.some(isNaN) || isNaN(oAdj) || isNaN(pAdj)) return;

    const bv: number[] = [], ov: number[] = [], pv: number[] = [];
    for (let i = 0; i < YEARS; i++) {
      bv.push(+(a[i] - b[i]).toFixed(2));
      ov.push(+(a[i] - b[i] * (1 - oAdj)).toFixed(2));
      pv.push(+(a[i] - b[i] * (1 + pAdj)).toFixed(2));
    }

    setBaseVar(bv);
    setOptVar(ov);
    setPesVar(pv);
  };

  // 2) once chart renders, upload to S3 + record in DB
  useEffect(() => {
    if (baseVar.length === 0) return;
    const timer = setTimeout(async () => {
      try {
        const img = chartRef.current?.toBase64Image();
        if (!img) throw new Error('Chart not ready');

        await axios.post('/api/simulations', {
          userId:         'anonymous',
          simulationType: 'BudgetVariance',
          parameters:     { budgeted, actual, optAdjust, pesAdjust },
          results:        { baseVar, optVar, pesVar },
          chartImage:     img
        });
        console.log('Budget variance simulation saved');
      } catch (err) {
        console.error('Upload failed', err);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [baseVar, optVar, pesVar, budgeted, actual, optAdjust, pesAdjust]);

  const exportToPDF = () => {
    const doc = new jsPDF({ unit:'pt', format:'a4' });
    doc.setFont('helvetica','normal').setFontSize(16);
    doc.text('Budget Variance What-If Analysis', 40, 40);
    doc.setFontSize(12);
    budgeted.forEach((bud, i) => {
      doc.text(`Year ${i+1} Budgeted: $${bud}`, 40, 70 + i*15);
      doc.text(`Year ${i+1} Actual:   $${actual[i]}`, 260, 70 + i*15);
    });
    doc.text(`Optimistic Adj: –${optAdjust}%`, 40, 70 + YEARS*15 + 10);
    doc.text(`Pessimistic Adj: +${pesAdjust}%`, 260, 70 + YEARS*15 + 10);
    const chart = chartRef.current;
    if (chart) {
      const img = chart.toBase64Image();
      doc.addImage(img, 'PNG', 40, 70 + YEARS*15 + 30, 520, 300);
    }
    doc.save('budget_variance_simulation.pdf');
  };

  const exportToCSV = () => {
    const header = ['Year','Base Variance','Optimistic Var','Pessimistic Var'];
    const rows = baseVar.map((_, i) => [
      `Year ${i+1}`,
      baseVar[i].toFixed(2),
      optVar[i].toFixed(2),
      pesVar[i].toFixed(2)
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'budget_variance_simulation.csv';
    a.click();
  };

  const data = {
    labels: Array.from({ length: YEARS }, (_, i) => `Y${i+1}`),
    datasets: [
      {
        label: 'Base Variance',
        data: baseVar,
        backgroundColor: 'rgba(79,70,229,0.5)',
        borderColor: 'rgba(79,70,229,1)',
        borderWidth: 1
      },
      {
        label: 'Optimistic (–budget)',
        data: optVar,
        backgroundColor: 'rgba(55,48,163,0.5)',
        borderColor: 'rgba(55,48,163,1)',
        borderWidth: 1
      },
      {
        label: 'Pessimistic (+budget)',
        data: pesVar,
        backgroundColor: 'rgba(129,140,248,0.5)',
        borderColor: 'rgba(129,140,248,1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/simulation" className="back-link">← Back to Simulations</Link>
        <h2 className="login-heading">Budget Variance What-If Analysis</h2>
        <p className="login-subtext">
          Enter Budgeted vs Actual for 5 years, then define “what-if” budget adjustments.
        </p>

        <div className="login-form">
          {Array.from({ length: YEARS }, (_, i) => (
            <div key={i} style={{ display:'flex', gap:'10px', marginBottom:'10px' }}>
              <input
                type="text"
                placeholder={`Year ${i+1} Budgeted`}
                value={budgeted[i]}
                onChange={e => {
                  const arr = [...budgeted]; arr[i] = e.target.value; setBudgeted(arr);
                }}
                style={{
                  flex:1, backgroundColor:'black', color:'white',
                  padding:'8px', borderRadius:'4px', border:'1px solid #444'
                }}
              />
              <input
                type="text"
                placeholder={`Year ${i+1} Actual`}
                value={actual[i]}
                onChange={e => {
                  const arr = [...actual]; arr[i] = e.target.value; setActual(arr);
                }}
                style={{
                  flex:1, backgroundColor:'black', color:'white',
                  padding:'8px', borderRadius:'4px', border:'1px solid #444'
                }}
              />
            </div>
          ))}

          <div style={{ display:'flex', gap:'10px', marginBottom:'20px' }}>
            {[
              ['Optimistic Adj (%)', optAdjust, setOptAdjust],
              ['Pessimistic Adj (%)', pesAdjust, setPesAdjust]
            ].map(([ph,val,set], i) => (
              <input
                key={i}
                type="text"
                placeholder={ph}
                value={val as string}
                onChange={e=>(set as any)(e.target.value)}
                style={{
                  flex:1, backgroundColor:'black', color:'white',
                  padding:'8px', borderRadius:'4px', border:'1px solid #444'
                }}
              />
            ))}
          </div>

          <button
            onClick={simulate}
            style={{
              padding:'8px 16px', backgroundColor:'#4f46e5',
              color:'white', border:'none', borderRadius:'4px',
              cursor:'pointer', marginBottom:'20px'
            }}
          >
            Run Analysis
          </button>
        </div>

        {baseVar.length > 0 && (
          <>
            <h4 style={{ margin:'1.5rem 0 0.5rem', fontWeight:600 }}>Variance Results</h4>
            <ul style={{ paddingLeft:'1.2rem', fontSize:'0.875rem' }}>
              {baseVar.map((_, i) => (
                <li key={i}>
                  Year {i+1} — Base: <strong>${baseVar[i].toLocaleString()}</strong>,
                  Opt: <strong>${optVar[i].toLocaleString()}</strong>,
                  Pes: <strong>${pesVar[i].toLocaleString()}</strong>
                </li>
              ))}
            </ul>

            <div style={{ marginTop:'20px' }}>
              <h4>Variance Chart</h4>
              <Bar
                ref={chartRef}
                data={data}
                options={{
                  responsive: true,
                  plugins: {
                    legend:{ position:'top' },
                    title:{ display:true, text:'Budget Variance Scenarios' }
                  }
                }}
              />
            </div>

            <div style={{
              display:'flex', justifyContent:'flex-end',
              gap:'10px', marginTop:'20px'
            }}>
              <button
                onClick={exportToPDF}
                style={{
                  padding:'8px 16px', backgroundColor:'#4f46e5',
                  color:'white', border:'none', borderRadius:'4px',
                  cursor:'pointer'
                }}
              >
                Export to PDF
              </button>
              <button
                onClick={exportToCSV}
                style={{
                  padding:'8px 16px', backgroundColor:'#4f46e5',
                  color:'white', border:'none', borderRadius:'4px',
                  cursor:'pointer'
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
