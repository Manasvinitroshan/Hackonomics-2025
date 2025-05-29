import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/sidebar.css';

// Import your content components
import Dashboard from './Dashboard';
import Learn from './Learn';
import Simulation from './Simulation';
import Forum from './Forum';
import Events from './Events';

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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with internal state change */}
      <Sidebar onTabChange={setActiveTab} activeTab={activeTab} />

      <div className="page-container flex-1">
        <div className="card text-center max-w-xl mx-auto my-24">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
