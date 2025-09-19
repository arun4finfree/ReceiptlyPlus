/**
 * ReceiptlyPlus Mobile App - Main Application Component
 * 
 * This is the main application component for the mobile version of ReceiptlyPlus.
 * It provides the mobile-optimized interface for generating rental receipts
 * with e-signature support on Android devices.
 * 
 * Key Features:
 * - Mobile-optimized UI/UX
 * - Touch-friendly interface
 * - Device integration (storage, sharing)
 * - Offline capability
 * - Responsive design
 * - Professional receipt generation
 * 
 * @author ReceiptlyPlus Development Team
 * @version 1.0.0
 */

import React from 'react';
import MobileReceiptForm from './components/MobileReceiptForm';
import '../../../src/styles/index.css';

/**
 * Main App component for ReceiptlyPlus Mobile
 * Renders the mobile-optimized receipt form interface
 */
function App() {
  return (
    <div className="App">
      <MobileReceiptForm />
    </div>
  );
}

export default App;

