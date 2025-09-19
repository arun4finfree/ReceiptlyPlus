/**
 * ReceiptlyPlus Mobile - Application Entry Point
 * 
 * This is the main entry point for the ReceiptlyPlus mobile application.
 * It initializes the React application and renders the main App component.
 * 
 * @author ReceiptlyPlus Development Team
 * @version 1.0.0
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Render the main App component
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

