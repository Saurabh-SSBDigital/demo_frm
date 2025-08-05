// import React, { useState } from 'react';
// import Layout from './components/Layout';
// import Dashboard from './pages/Dashboard';
// import Reports from './pages/Reports';
// import Settings from './pages/Settings';

// function App() {
//   const [currentPage, setCurrentPage] = useState('dashboard');

//   const renderPage = () => {
//     switch (currentPage) {
//       case 'dashboard':
//         return <Dashboard />;
//       case 'reports':
//         return <Reports />;
//       case 'settings':
//         return <Settings />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   return (
//     <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
//       {renderPage()}
//     </Layout>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AccountDetails from "./pages/AccountDetails";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account-details" element={<AccountDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
