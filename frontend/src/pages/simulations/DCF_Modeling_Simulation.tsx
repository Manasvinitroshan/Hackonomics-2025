// src/pages/DCF_Modeling_Simulation.tsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
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
import '/Users/manassingh/LeanFoundr/frontend/src/styles/login.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DCF_Modeling_Simulation() {
  // inputs
  const [cash0, setCash0]           = useState('');
  const [growth, setGrowth]         = useState('');
  const [discount, setDiscount]     = useState('');
  const [horizon, setHorizon]       = useState('');
  const chartRef = useRef<any>(null);

  // results
  const [discBase, setDiscBase]     = useState<number[]>([]);
  const [discOpt, setDiscOpt]       = useState<number[]>([]);
  const [discPes, setDiscPes]       = useState<number[]>([]);
  const [npvs, setNpvs]             = useState<{base:number,opt:number,pes:number} | null>(null);

  const simulate = () => {
    const c0 = parseFloat(cash0);
    const g  = parseFloat(growth)   / 100;
    const d  = parseFloat(discount) / 100;
    const yrs= parseInt(horizon, 10);
    if ([c0,g,d,yrs].some(v=>isNaN(v)||v<=0)) return;

    const baseArr: number[] = [];
    const optArr:  number[] = [];
    const pesArr:  number[] = [];
    let npvB = 0, npvO = 0, npvP = 0;

    for (let i = 1; i <= yrs; i++) {
      // nominal future cash flows
      const fBase = c0 * Math.pow(1+g, i);
      const fOpt  = c0 * Math.pow(1+g*1.2, i);
      const fPes  = c0 * Math.pow(1+g*0.8, i);
      // discount factor
      const df = 1/Math.pow(1+d, i);
      const dBase = fBase * df;
      const dOpt  = fOpt  * df;
      const dPes  = fPes  * df;

      baseArr.push(+dBase.toFixed(2));
      optArr .push(+dOpt .toFixed(2));
      pesArr .push(+dPes .toFixed(2));

      npvB += dBase;
      npvO += dOpt;
      npvP += dPes;
    }

    setDiscBase(baseArr);
    setDiscOpt(optArr);
    setDiscPes(pesArr);
    setNpvs({
      base: +npvB.toFixed(2),
      opt:  +npvO.toFixed(2),
      pes:  +npvP.toFixed(2)
    });
  };

  const exportToPDF = () => {
    if (!npvs) return;
    const doc = new jsPDF({ unit:'pt', format:'a4' });
    doc.setFont('helvetica','normal');
    doc.setFontSize(16);
    doc.text('Discounted Cash Flow Simulation', 40, 40);
    doc.setFontSize(12);
    doc.text(`Initial Cash Flow: $${cash0}`, 40, 70);
    doc.text(`Growth Rate: ${growth}%`, 40, 90);
    doc.text(`Discount Rate: ${discount}%`, 40, 110);
    doc.text(`Horizon: ${horizon} yrs`, 40, 130);
    doc.text(`NPV Base Case: $${npvs.base}`, 40, 160);
    doc.text(`NPV Optimistic: $${npvs.opt}`, 40, 180);
    doc.text(`NPV Pessimistic: $${npvs.pes}`, 40, 200);

    const chart = chartRef.current;
    if (chart) {
      const img = chart.toBase64Image();
      doc.addImage(img, 'PNG', 40, 220, 520, 300);
    }

    doc.save('dcf_simulation.pdf');
  };

  const exportToCSV = () => {
    if (!npvs) return;
    const header = ['Scenario','NPV'];
    const rows = [
      ['Optimistic', npvs.opt.toFixed(2)],
      ['Base Case',  npvs.base.toFixed(2)],
      ['Pessimistic',npvs.pes.toFixed(2)]
    ];
    const csv = [header, ...rows].map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dcf_simulation.csv';
    a.click();
  };

  // chart data
  const labels = discBase.map((_,i)=>`Year ${i+1}`);
  const lineData = {
    labels,
    datasets: [
      {
        label: 'Base Case',
        data: discBase,
        borderColor: '#4f46e5',
        tension: 0.1
      },
      {
        label: 'Optimistic (+20% g)',
        data: discOpt,
        borderColor: '#3730a3',
        tension: 0.1
      },
      {
        label: 'Pessimistic (-20% g)',
        data: discPes,
        borderColor: '#818cf8',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 800 }}>
        <Link to="/simulation" className="back-link">← Back to Simulations</Link>
        <h2 className="login-heading">📉 DCF Modeling with Scenario Branches</h2>
        <p className="login-subtext">
          Project and discount cash flows under Base, Optimistic, and Pessimistic assumptions.
        </p>
        <div className="login-form">
          {[
            ['Initial Cash Flow ($)', cash0, setCash0],
            ['Annual Growth Rate (%)', growth, setGrowth],
            ['Discount Rate (%)', discount, setDiscount],
            ['Time Horizon (yrs)', horizon, setHorizon]
          ].map(([ph,val,set],i)=>(
            <input key={i}
              type="text"
              placeholder={ph}
              value={val as string}
              onChange={e=>(set as any)(e.target.value)}
              style={{
                width:'100%',
                padding:'10px',
                marginBottom:'10px',
                backgroundColor:'black',
                color:'white',
                border:'1px solid #444',
                borderRadius:'4px',
                boxSizing:'border-box'
              }}
            />
          ))}
          <div style={{ textAlign:'center', marginBottom:'20px' }}>
            <button onClick={simulate}
              style={{
                padding:'10px 20px',
                backgroundColor:'#4f46e5',
                color:'white',
                border:'none',
                borderRadius:'4px',
                cursor:'pointer'
              }}
            >
              Run Simulation
            </button>
          </div>
        </div>

        {npvs && (
          <>
            <div style={{ marginTop:'20px' }}>
              <h4>Discounted Cash Flows by Year</h4>
              <Line
                ref={chartRef}
                data={lineData}
                options={{
                  responsive:true,
                  plugins:{
                    legend:{position:'top'},
                    title:{display:true,text:'Discounted CF Scenarios'}
                  }
                }}
              />
            </div>
            <div style={{
              display:'flex',
              justifyContent:'flex-end',
              gap:'10px',
              marginTop:'20px'
            }}>
              <button onClick={exportToPDF}
                style={{
                  padding:'8px 16px',
                  backgroundColor:'#28a745',
                  color:'white',
                  border:'none',
                  borderRadius:'4px',
                  cursor:'pointer'
                }}
              >
                Export to PDF
              </button>
              <button onClick={exportToCSV}
                style={{
                  padding:'8px 16px',
                  backgroundColor:'#ffc107',
                  color:'white',
                  border:'none',
                  borderRadius:'4px',
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
