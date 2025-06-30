// src/pages/WorkingCapitalSimulation.tsx
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

export default function WorkingCapitalSimulation() {
  // Inputs
  const [initialSales, setInitialSales]       = useState('');
  const [salesGrowth, setSalesGrowth]         = useState('');
  const [cogsPct, setCogsPct]                 = useState('');
  const [dso, setDso]                         = useState('');
  const [dio, setDio]                         = useState('');
  const [dpo, setDpo]                         = useState('');
  const [swingPct, setSwingPct]               = useState('');
  const [horizon, setHorizon]                 = useState('');

  // Results
  const [wcBase, setWcBase]                   = useState<number[]>([]);
  const [wcOpt,  setWcOpt]                    = useState<number[]>([]);
  const [wcPes,  setWcPes]                    = useState<number[]>([]);
  const chartRef = useRef<any>(null);

  const simulate = () => {
    const sales0 = parseFloat(initialSales);
    const g      = parseFloat(salesGrowth) / 100;
    const cRate  = parseFloat(cogsPct)      / 100;
    const daysDSO= parseFloat(dso);
    const daysDIO= parseFloat(dio);
    const daysDPO= parseFloat(dpo);
    const swing  = parseFloat(swingPct)     / 100;
    const yrs    = parseInt(horizon, 10);

    if ([sales0,g,cRate,daysDSO,daysDIO,daysDPO,swing,yrs].some(v=>isNaN(v)||v<0)) return;

    const baseArr: number[] = [], optArr: number[] = [], pesArr: number[] = [];
    for (let i=1; i<=yrs; i++) {
      const sales = sales0 * Math.pow(1+g, i);
      const cogs  = sales * cRate;
      // base days
      const baseDSO = daysDSO, baseDIO = daysDIO, baseDPO = daysDPO;
      // optimistic: tighter DSO/DIO, longer DPO
      const optDSO  = baseDSO * (1 - swing);
      const optDIO  = baseDIO * (1 - swing);
      const optDPO  = baseDPO * (1 + swing);
      // pessimistic: looser DSO/DIO, shorter DPO
      const pesDSO  = baseDSO * (1 + swing);
      const pesDIO  = baseDIO * (1 + swing);
      const pesDPO  = baseDPO * (1 - swing);

      const wcBaseY = (sales/365*baseDSO + cogs/365*baseDIO) - (cogs/365*baseDPO);
      const wcOptY  = (sales/365*optDSO  + cogs/365*optDIO ) - (cogs/365*optDPO );
      const wcPesY  = (sales/365*pesDSO  + cogs/365*pesDIO ) - (cogs/365*pesDPO );

      baseArr.push(+wcBaseY.toFixed(2));
      optArr.push( +wcOptY.toFixed(2));
      pesArr.push( +wcPesY.toFixed(2));
    }

    setWcBase(baseArr);
    setWcOpt(optArr);
    setWcPes(pesArr);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ unit:'pt', format:'a4' });
    doc.setFont('helvetica','normal');
    doc.setFontSize(16);
    doc.text('Working Capital Simulation', 40, 40);
    doc.setFontSize(12);
    doc.text(`Initial Sales: $${initialSales}`, 40, 70);
    doc.text(`Sales Growth: ${salesGrowth}%`, 40, 90);
    doc.text(`COGS % of Sales: ${cogsPct}%`, 40, 110);
    doc.text(`DSO / DIO / DPO: ${dso}/${dio}/${dpo} days`, 40, 130);
    doc.text(`Swing: ±${swingPct}%`, 40, 150);
    doc.text(`Horizon: ${horizon} yrs`, 40, 170);

    const chart = chartRef.current;
    if (chart) {
      const img = chart.toBase64Image();
      doc.addImage(img,'PNG',40,190,520,300);
    }

    doc.save('working_capital_simulation.pdf');
  };

  const exportToCSV = () => {
    const header = ['Year','WC Base','WC Optimistic','WC Pessimistic'];
    const rows = wcBase.map((_,i)=>[
      `Year ${i+1}`,
      wcBase[i].toFixed(2),
      wcOpt[i].toFixed(2),
      wcPes[i].toFixed(2)
    ]);
    const csv = [header, ...rows].map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'working_capital_simulation.csv';
    a.click();
  };

  const labels = wcBase.map((_,i)=>`Year ${i+1}`);
  const data = {
    labels,
    datasets:[
      { label:'Base WC',           data:wcBase, borderColor:'#4f46e5', tension:0.1 },
      { label:'Optimistic WC',    data:wcOpt,  borderColor:'#3730a3', tension:0.1 },
      { label:'Pessimistic WC',   data:wcPes,  borderColor:'#818cf8', tension:0.1 }
    ]
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 800 }}>
        <Link to="/simulation" className="back-link">← Back to Simulations</Link>
        <h2 className="login-heading">📊 Working Capital Simulation</h2>
        <p className="login-subtext">
          CFO-level analysis of working capital needs under Base, Optimistic, and Pessimistic scenarios.
        </p>
        <div className="login-form">
          {[
            ['Initial Sales ($)', initialSales, setInitialSales],
            ['Sales Growth (%)',  salesGrowth,   setSalesGrowth],
            ['COGS % of Sales',    cogsPct,       setCogsPct],
            ['DSO (days)',         dso,           setDso],
            ['DIO (days)',         dio,           setDio],
            ['DPO (days)',         dpo,           setDpo],
            ['Swing (%)',          swingPct,      setSwingPct],
            ['Horizon (yrs)',      horizon,       setHorizon]
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

        {wcBase.length>0 && (
          <>
            <div style={{ marginTop:'20px' }}>
              <h4>Working Capital Over Time</h4>
              <Line
                ref={chartRef}
                data={data}
                options={{
                  responsive:true,
                  plugins:{
                    legend:{position:'top'},
                    title:{display:true,text:'Working Capital Scenarios'}
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
