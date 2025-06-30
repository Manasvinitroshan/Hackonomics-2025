// src/pages/RevenueForecastSimulation.tsx
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

export default function RevenueForecastSimulation() {
  const [initialRevenue, setInitialRevenue] = useState('');
  const [growthRate, setGrowthRate]         = useState('');
  const [inflation, setInflation]           = useState('');
  const [seasonality, setSeasonality]       = useState('');
  const [years, setYears]                   = useState('');

  const [baseForecast, setBaseForecast] = useState<number[]>([]);
  const [optForecast, setOptForecast]   = useState<number[]>([]);
  const [pesForecast, setPesForecast]   = useState<number[]>([]);

  const chartRef = useRef<any>(null);

  // 1) Only compute forecasts here
  const simulate = () => {
    const rev0 = parseFloat(initialRevenue);
    const g    = parseFloat(growthRate) / 100;
    const infl = parseFloat(inflation)  / 100;
    const seas = parseFloat(seasonality)/ 100;
    const n    = parseInt(years, 10);
    if ([rev0, g, infl, seas, n].some(v => isNaN(v) || v < 0)) return;

    const base: number[] = [];
    const opt: number[]  = [];
    const pes: number[]  = [];
    for (let i = 1; i <= n; i++) {
      const f  = rev0
        * Math.pow(1 + g, i)
        * Math.pow(1 + infl, i)
        * Math.pow(1 + seas, i);
      base.push(+f.toFixed(2));
      opt.push(+(
        rev0
        * Math.pow(1 + g * 1.2, i)
        * Math.pow(1 + infl, i)
        * Math.pow(1 + seas, i)
      ).toFixed(2));
      pes.push(+(
        rev0
        * Math.pow(1 + g * 0.8, i)
        * Math.pow(1 + infl, i)
        * Math.pow(1 + seas, i)
      ).toFixed(2));
    }

    setBaseForecast(base);
    setOptForecast(opt);
    setPesForecast(pes);
  };

  // 2) After chart renders, upload PNG to S3 + record in DB
  useEffect(() => {
    if (baseForecast.length === 0) return;
    const timeout = setTimeout(async () => {
      try {
        const img = chartRef.current?.toBase64Image();
        if (!img) throw new Error('Chart image not ready');

        await axios.post('/api/simulations', {
          userId:         'anonymous',
          simulationType: 'RevenueForecast',
          parameters:     { initialRevenue, growthRate, inflation, seasonality, years },
          results:        { baseForecast, optForecast, pesForecast },
          chartImage:     img
        });
        console.log('Simulation saved to S3 & DynamoDB');
      } catch (err) {
        console.error('Upload failed', err);
      }
    }, 100); // slight delay for chart to mount

    return () => clearTimeout(timeout);
  }, [baseForecast, optForecast, pesForecast, initialRevenue, growthRate, inflation, seasonality, years]);

  // PDF export
  const exportToPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.text('Revenue Forecast Simulation', 40, 40);
    doc.setFontSize(12);
    doc.text(`Initial Revenue: $${initialRevenue}`, 40, 70);
    doc.text(`Growth Rate: ${growthRate}%`, 40, 90);
    doc.text(`Inflation: ${inflation}%`, 40, 110);
    doc.text(`Seasonality: ${seasonality}%`, 40, 130);
    doc.text(`Time Horizon: ${years} yrs`, 40, 150);
    const chart = chartRef.current;
    if (chart) {
      const img = chart.toBase64Image();
      doc.addImage(img, 'PNG', 40, 170, 500, 300);
    }
    doc.save('revenue_forecast_simulation.pdf');
  };

  // CSV export
  const exportToCSV = () => {
    const header = ['Year','Base','Optimistic','Pessimistic'];
    const rows = baseForecast.map((_, i) => [
      `Year ${i + 1}`,
      baseForecast[i].toString(),
      optForecast[i].toString(),
      pesForecast[i].toString()
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'revenue_forecast_simulation.csv';
    link.click();
  };

  // Chart data
  const chartData = {
    labels: baseForecast.map((_, i) => `Year ${i + 1}`),
    datasets: [
      { label: 'Base Case',           data: baseForecast, borderColor: '#4f46e5', tension: 0.1 },
      { label: 'Optimistic (×1.2g)',  data: optForecast,   borderColor: '#3730a3', tension: 0.1 },
      { label: 'Pessimistic (×0.8g)', data: pesForecast,   borderColor: '#818cf8', tension: 0.1 }
    ]
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/simulation" className="back-link">
          ← Back to Simulations
        </Link>

        <h2 className="login-heading">📈 Revenue Forecast Simulation</h2>
        <p className="login-subtext">
          Multi-scenario CFO forecast: enter growth, inflation, seasonality & horizon.
        </p>

        <div className="login-form">
          {[
            ['Initial Revenue ($)', initialRevenue, setInitialRevenue],
            ['Annual Growth Rate (%)', growthRate, setGrowthRate],
            ['Inflation Rate (%)', inflation, setInflation],
            ['Seasonality Impact (%)', seasonality, setSeasonality],
            ['Time Horizon (yrs)', years, setYears]
          ].map(([ph, val, set], i) => (
            <input
              key={i}
              type="text"
              placeholder={ph}
              value={val as string}
              onChange={e => (set as any)(e.target.value)}
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
              marginBottom: '20px'
            }}
          >
            Run Forecast
          </button>
        </div>

        {baseForecast.length > 0 && (
          <>
            <h4 style={{ margin: '1.5rem 0 0.5rem', fontWeight: 600 }}>
              📊 Forecast Results
            </h4>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.875rem' }}>
              {baseForecast.map((_, i) => (
                <li key={i}>
                  Year {i + 1}: Base <strong>${baseForecast[i].toLocaleString()}</strong>,{' '}
                  Opt <strong>${optForecast[i].toLocaleString()}</strong>,{' '}
                  Pes <strong>${pesForecast[i].toLocaleString()}</strong>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '20px' }}>
              <h4>Forecast Chart</h4>
              <Line
                ref={chartRef}
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Revenue Scenarios' }
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
