// src/pages/Dashboard.tsx

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

type HealthState = 'Excellent' | 'Good' | 'Moderate' | 'Poor';

interface Stats {
  runway: number;
  burnRate: number;
  revenue: number;
}

interface SimulationPoint {
  month: string;
  revenue: number;
  expenses: number;
}

const Dashboard: React.FC = () => {
  const firstName = 'Manas'; // TODO: replace with real user data
  const [startupHealth, setStartupHealth] = useState<HealthState>('Good');
  const [keyStats, setKeyStats] = useState<Stats>({
    runway: 0,
    burnRate: 0,
    revenue: 0,
  });
  const [lastSimulation, setLastSimulation] = useState<SimulationPoint[]>([]);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then(
        (data: {
          health: HealthState;
          stats: Stats;
          simulationHistory: SimulationPoint[];
        }) => {
          setStartupHealth(data.health);
          setKeyStats(data.stats);
          setLastSimulation(data.simulationHistory);
        }
      )
      .catch((err) => {
        console.error('Failed to load dashboard stats:', err);
      });
  }, []);

  const healthColor = {
    Excellent: 'text-green-500',
    Good: 'text-blue-500',
    Moderate: 'text-yellow-500',
    Poor: 'text-red-500',
  }[startupHealth];

  return (
    <div className="dashboard-wrapper p-6 space-y-6">
      {/* Header */}
      <div className="dashboard-header flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome back, {firstName} 👋</h1>
      </div>

      {/* Intro */}
      <div className="dashboard-content">
        <p className="text-gray-600 dark:text-gray-300">
          Start by exploring a simulation or visiting the forum.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Runway</p>
          <p className="text-2xl font-semibold">{keyStats.runway} months</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Burn Rate</p>
          <p className="text-2xl font-semibold">
            ${keyStats.burnRate.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Monthly Revenue</p>
          <p className="text-2xl font-semibold">
            ${keyStats.revenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Health & Last Simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-2">Startup Health</h2>
          <p className={`text-xl font-bold ${healthColor}`}>{startupHealth}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-2">
            Last Simulation (Revenue Forecast)
          </h2>
          <LineChart width={350} height={200} data={lastSimulation}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-medium mb-4">📁 Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button>Ask CFO</button>
          <button>Upload PDF</button>
          <button>Run Simulation</button>
          <button>Explore Events</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
