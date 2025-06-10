// pages/Learn.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const modules = [
  { id: 1, title: 'Financial Modeling Basics', description: 'Learn core principles of startup financial modeling.', score: 85 },
  { id: 2, title: 'Understanding Burn Rate', description: 'What it is, why it matters, and how to calculate it.', score: 72 },
  { id: 3, title: 'Cash Flow Management', description: 'Strategies to forecast and manage your cash flow.', score: 0 },
  { id: 4, title: 'Unit Economics', description: 'Analyzing the profitability of your business model per unit.', score: 0 },
  { id: 5, title: 'Cap Table Management', description: 'How to structure and maintain your cap table effectively.', score: 0 },
  { id: 6, title: 'Valuation Methods', description: 'Different approaches to valuing your startup.', score: 0 },
  { id: 7, title: 'Debt vs Equity Financing', description: 'Pros and cons of raising funds through debt or equity.', score: 0 },
  { id: 8, title: 'Budgeting and Forecasting', description: 'Building realistic budgets and financial forecasts.', score: 0 },
  { id: 9, title: 'Key Financial KPIs', description: 'Important metrics every founder should track.', score: 0 },
  { id: 10, title: 'Exit Strategies', description: 'Understanding exit options and preparing for acquisitions or IPOs.', score: 0 },
  { id: 11, title: 'Fundraising Strategies', description: 'Exploring seed, Series A/B rounds, and alternative financing options.', score: 0 },
  { id: 12, title: 'Scenario & Sensitivity Analysis', description: 'Model best- and worst-case scenarios to stress-test your plan.', score: 0 },
];

export default function Learn() {
  const navigate = useNavigate();

  return (
    <div className="login-page py-12">
      <div className="login-card" style={{ maxWidth: '1000px' }}>
        <h2 className="login-heading text-center mb-4">
          Learn
        </h2>
        <p className="login-subtext text-center mb-8">
          Click a topic to explore details and resources.
        </p>

        {/* Flexbox layout: wrap items, show 3 per row with increased spacing */}
        <div className="flex flex-wrap justify-evenly gap-12">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="w-full sm:w-1/2 md:w-1/3 login-card hover:shadow-lg cursor-pointer p-6"
              onClick={() => navigate(`/learn/module/${mod.id}`)}
              style={{ marginBottom: '2rem' }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {mod.title}
              </h3>
              <p className="text-gray-600 mb-4">{mod.description}</p>
              <div className="text-sm font-medium text-blue-700">
                Score: {mod.score}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}