// pages/Learn.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const modules = [
  {
    id: 1,
    title: 'Financial Modeling Basics',
    description: 'Learn the core principles of startup financial modeling.',
    score: 85,
  },
  {
    id: 2,
    title: 'Understanding Burn Rate',
    description: 'What it is, why it matters, and how to calculate it.',
    score: 72,
  },
];

export default function Learn() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '800px' }}>
        <h2 className="login-heading">Learning Modules</h2>
        <p className="login-subtext">Click a module to start learning and take quizzes to test your understanding.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="login-card hover:shadow-lg cursor-pointer"
              onClick={() => navigate(`/learn/module/${mod.id}`)}
              style={{ textAlign: 'left' }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-1">{mod.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{mod.description}</p>
              <div className="text-sm text-blue-700 font-medium">Score: {mod.score}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
