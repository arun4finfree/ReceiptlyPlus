import React from 'react';
import ReceiptForm from './components/ReceiptForm';
import '../../../src/styles/index.css';

/**
 * Main App component
 * Renders the rental receipt generator application
 * Updated for GitHub Pages deployment
 */
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ReceiptForm />
    </div>
  );
}

export default App;
