import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/sidebar.css';

import Dashboard from './Dashboard';
import Learn from './Learn';
import Simulation from './Simulation';
import Forum from './Forum';
import Events from './Events';
import AiCFO from './AiCFO';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Learn':
        return <Learn />;
      case 'Simulation':
        return <Simulation />;
      case 'Forum':
        return <Forum />;
      case 'Events':
        return <Events />;
        case 'AI CFO':
        return <AiCFO />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onTabChange={setActiveTab} activeTab={activeTab} />

      <div className="page-container flex-1">
        <div className="card text-center max-w-xl mx-auto my-24">
          <div key={activeTab} className="content-fade">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
