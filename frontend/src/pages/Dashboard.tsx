const Dashboard = () => {
  const firstName = 'Manas'; // Replace with dynamic user data when available

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="text-2xl font-bold">Welcome back, {firstName} 👋</h1>
      </div>

      <div className="dashboard-content">
        <p className="text-gray-600 dark:text-gray-300">
          Start by exploring a simulation or visiting the forum.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
