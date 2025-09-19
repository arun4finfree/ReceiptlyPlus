/**
 * MobileReceiptForm Component - Mobile-optimized form for creating rental receipts
 * 
 * This component is specifically designed for mobile devices with touch-friendly interface,
 * optimized layouts, and mobile-specific features like file sharing and device storage.
 * 
 * Key Features:
 * - Touch-optimized form inputs
 * - Mobile-friendly signature capture
 * - Device storage integration
 * - Share functionality
 * - Responsive design for various screen sizes
 * - Offline capability
 * 
 * @author ReceiptlyPlus Development Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import MobileSignatureModal from '../../../src/components/SignatureModal';
import { generateReceiptPDF, formatDate, generateReceiptNumber } from '../../../utils/pdf';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * Main mobile form component for rental receipt generation
 * Handles form state, mobile storage, validation, and PDF generation
 */
const MobileReceiptForm = () => {
  // Form state with mobile-optimized defaults
  const [formData, setFormData] = useState({
    titleName: '',
    titleAddress: '',
    tenantName: '',
    durationFrom: '',
    durationTo: '',
    term: 'Monthly',
    amount: '',
    dateOfTransaction: new Date().toISOString().split('T')[0], // Today's date
    paymentMode: 'Cash',
    referenceNo: '',
    receiptNumber: '',
    eSignatureRequired: false
  });

  // Component state
  const [signatureDataUrl, setSignatureDataUrl] = useState('');
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');

  // Mobile-specific state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deviceInfo, setDeviceInfo] = useState(null);

  // Initialize mobile app
  useEffect(() => {
    initializeMobileApp();
  }, []);

  /**
   * Initialize mobile app with device-specific settings
   * Sets up status bar, splash screen, and device information
   */
  const initializeMobileApp = async () => {
    try {
      // Hide splash screen
      await SplashScreen.hide();
      
      // Set status bar style
      await StatusBar.setStyle({ style: 'dark' });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      
      // Set device info
      setDeviceInfo({
        platform: 'mobile',
        userAgent: navigator.userAgent
      });
      
      console.log('Mobile app initialized successfully');
    } catch (error) {
      console.error('Error initializing mobile app:', error);
    }
  };

  // Helper function to get previous month's start and end dates
  const getPreviousMonthDates = () => {
    const now = new Date();
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    const startDate = previousMonth.getFullYear() + '-' + 
                     String(previousMonth.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(previousMonth.getDate()).padStart(2, '0');
    const endDate = lastDayOfPreviousMonth.getFullYear() + '-' + 
                   String(lastDayOfPreviousMonth.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(lastDayOfPreviousMonth.getDate()).padStart(2, '0');
    
    return { startDate, endDate };
  };

  // Helper function to get date constraints
  const getDateConstraints = () => {
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const minDate = oneYearAgo.getFullYear() + '-' + 
                   String(oneYearAgo.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(oneYearAgo.getDate()).padStart(2, '0');
    const maxDate = currentMonthEnd.getFullYear() + '-' + 
                   String(currentMonthEnd.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(currentMonthEnd.getDate()).padStart(2, '0');
    
    return { minDate, maxDate };
  };

  // Initialize form with stored data and generate receipt number
  useEffect(() => {
    // Load last receipt number from localStorage
    const lastSequence = parseInt(localStorage.getItem('rental_receipt_seq') || '0');
    const nextSequence = lastSequence + 1;
    const receiptNumber = generateReceiptNumber(nextSequence);

    // Get default dates for previous month
    const { startDate, endDate } = getPreviousMonthDates();

    setFormData(prev => ({
      ...prev,
      receiptNumber,
      durationFrom: startDate,
      durationTo: endDate
    }));

    // Load any previously saved form data (optional - for user convenience)
    const savedFormData = localStorage.getItem('rental_receipt_form_data');
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          receiptNumber, // Always use new receipt number
          dateOfTransaction: new Date().toISOString().split('T')[0], // Always use today's date
          // Override with default dates if not set
          durationFrom: parsed.durationFrom || startDate,
          durationTo: parsed.durationTo || endDate
        }));
      } catch (error) {
        console.warn('Could not load saved form data:', error);
      }
    }
  }, []);

  // Save form data to localStorage on changes (except receipt number and date)
  useEffect(() => {
    const dataToSave = {
      titleName: formData.titleName,
      titleAddress: formData.titleAddress,
      tenantName: formData.tenantName,
      durationFrom: formData.durationFrom,
      durationTo: formData.durationTo,
      term: formData.term,
      amount: formData.amount,
      paymentMode: formData.paymentMode,
      referenceNo: formData.referenceNo,
      eSignatureRequired: formData.eSignatureRequired
    };
    localStorage.setItem('rental_receipt_form_data', JSON.stringify(dataToSave));
  }, [formData]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle term change - update duration dates
    if (name === 'term') {
      const { startDate, endDate } = getPreviousMonthDates();
      setFormData(prev => ({
        ...prev,
        [name]: value,
        durationFrom: startDate,
        durationTo: endDate
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle signature modal open
  const handleSignatureRequired = () => {
    setIsSignatureModalOpen(true);
  };

  // Handle signature confirmation
  const handleSignatureConfirm = (signatureData) => {
    setSignatureDataUrl(signatureData);
    setIsSignatureModalOpen(false);
    setMessage('Signature captured successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Handle signature modal cancel
  const handleSignatureCancel = () => {
    setIsSignatureModalOpen(false);
  };

  // Helper function to show error message and scroll to top
  const showErrorMessage = (errorMessage) => {
    setMessage(errorMessage);
    // Scroll to top to show the error message
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return false;
  };

  // Validate form data
  const validateForm = () => {
    const required = ['titleName', 'tenantName', 'durationFrom', 'durationTo', 'amount'];
    const missing = required.filter(field => !formData[field].trim());
    
    if (missing.length > 0) {
      return showErrorMessage(`Please fill in: ${missing.join(', ')}`);
    }

    // Check reference number requirement for non-cash payments
    if (formData.paymentMode !== 'Cash' && !formData.referenceNo.trim()) {
      return showErrorMessage('Reference number is required for non-cash payments.');
    }

    if (formData.eSignatureRequired && !signatureDataUrl) {
      return showErrorMessage('E-signature is required but not provided. Please sign the document.');
    }

    // Validate date ranges
    const { minDate, maxDate } = getDateConstraints();
    const durationFrom = new Date(formData.durationFrom);
    const durationTo = new Date(formData.durationTo);
    const minDateObj = new Date(minDate);
    const maxDateObj = new Date(maxDate);

    if (durationFrom < minDateObj || durationFrom > maxDateObj) {
      return showErrorMessage('Duration From date must be within the allowed range (1 year ago to end of current month).');
    }

    if (durationTo < minDateObj || durationTo > maxDateObj) {
      return showErrorMessage('Duration To date must be within the allowed range (1 year ago to end of current month).');
    }

    if (durationFrom > durationTo) {
      return showErrorMessage('Duration From date cannot be after Duration To date.');
    }

    return true;
  };

  // Generate and download PDF
  const handleGeneratePDF = async () => {
    if (!validateForm()) {
      return;
    }

    setIsGenerating(true);
    setMessage('');

    try {
      // Prepare form data for PDF generation
      const pdfData = {
        ...formData,
        dateOfTransaction: formatDate(formData.dateOfTransaction)
      };

      // Generate PDF using mobile utility function
      await generateReceiptPDF(pdfData, signatureDataUrl);

      // Save receipt to localStorage for history tracking
      const receipt = {
        id: formData.receiptNumber,
        ...pdfData,
        signatureDataUrl,
        createdAt: new Date().toISOString()
      };

      // Update receipt history
      const existingReceipts = JSON.parse(localStorage.getItem('rental_receipts') || '[]');
      existingReceipts.push(receipt);
      localStorage.setItem('rental_receipts', JSON.stringify(existingReceipts));

      // Generate next receipt number for future use
      const nextReceiptNumber = generateReceiptNumber(0);

      // Reset form for next receipt (preserve some fields for convenience)
      setFormData(prev => ({
        ...prev,
        receiptNumber: nextReceiptNumber,
        dateOfTransaction: new Date().toISOString().split('T')[0],
        amount: '',
        tenantName: '',
        durationFrom: '',
        durationTo: '',
        referenceNo: ''
      }));

      // Clear signature and show success message
      setSignatureDataUrl('');
      setMessage('Receipt generated and saved successfully!');
      setTimeout(() => setMessage(''), 5000);

    } catch (error) {
      console.error('Error generating PDF:', error);
      setMessage('Error generating PDF. Please try again.');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsGenerating(false);
    }
  };

  // Clear all stored data
  const handleClearStorage = () => {
    localStorage.removeItem('rental_receipt_form_data');
    localStorage.removeItem('rental_receipts');
    localStorage.removeItem('rental_receipt_seq');
    
    // Reset form to defaults
    const { startDate, endDate } = getPreviousMonthDates();
    const receiptNumber = generateReceiptNumber(0);
    
    setFormData(prev => ({
      ...prev,
      receiptNumber,
      dateOfTransaction: new Date().toISOString().split('T')[0],
      amount: '',
      tenantName: '',
      durationFrom: startDate,
      durationTo: endDate,
      referenceNo: ''
    }));
    
    setSignatureDataUrl('');
    setMessage('All data cleared successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Mobile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          📱 ReceiptlyPlus Mobile
        </h1>
        <p className="text-gray-600 text-sm">
          Professional Rental Receipt Generator with E-Signature Support
        </p>
        {!isOnline && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 text-xs">
            ⚠️ Offline Mode - Some features may be limited
          </div>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.includes('Error') || message.includes('Please fill in') || 
          message.includes('required') || message.includes('must be') || 
          message.includes('cannot be') || message.includes('not provided')
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <form className="space-y-6">
        {/* Header Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Receipt Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="titleName" className="block text-sm font-medium text-gray-700 mb-2">
                Title Name *
              </label>
              <input
                type="text"
                id="titleName"
                name="titleName"
                value={formData.titleName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="Enter company or person name"
                required
              />
            </div>

            <div>
              <label htmlFor="titleAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Title Address
              </label>
              <textarea
                id="titleAddress"
                name="titleAddress"
                value={formData.titleAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                rows="3"
                placeholder="Enter address"
              />
            </div>
          </div>
        </div>

        {/* Tenant Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">👤 Tenant Information</h2>
          
          <div>
            <label htmlFor="tenantName" className="block text-sm font-medium text-gray-700 mb-2">
              Tenant Name *
            </label>
            <input
              type="text"
              id="tenantName"
              name="tenantName"
              value={formData.tenantName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="Enter tenant name"
              required
            />
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📅 Duration & Terms</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="durationFrom" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration From *
                </label>
                <input
                  type="date"
                  id="durationFrom"
                  name="durationFrom"
                  value={formData.durationFrom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  min={getDateConstraints().minDate}
                  max={getDateConstraints().maxDate}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: 1 year ago to end of current month
                </p>
              </div>

              <div>
                <label htmlFor="durationTo" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration To *
                </label>
                <input
                  type="date"
                  id="durationTo"
                  name="durationTo"
                  value={formData.durationTo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  min={getDateConstraints().minDate}
                  max={getDateConstraints().maxDate}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: 1 year ago to end of current month
                </p>
              </div>

              <div>
                <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-2">
                  Term
                </label>
                <select
                  id="term"
                  name="term"
                  value={formData.term}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Amount, Payment Mode, and Date */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">💰 Payment Details</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="Enter amount"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Mode
              </label>
              <select
                id="paymentMode"
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              >
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Deposit">Bank Deposit</option>
                <option value="UPI Payment">UPI Payment</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>

            {formData.paymentMode !== 'Cash' && (
              <div>
                <label htmlFor="referenceNo" className="block text-sm font-medium text-gray-700 mb-2">
                  Reference No. *
                </label>
                <input
                  type="text"
                  id="referenceNo"
                  name="referenceNo"
                  value={formData.referenceNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="Enter reference number"
                  required={formData.paymentMode !== 'Cash'}
                />
              </div>
            )}

            <div>
              <label htmlFor="dateOfTransaction" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Transaction
              </label>
              <input
                type="date"
                id="dateOfTransaction"
                name="dateOfTransaction"
                value={formData.dateOfTransaction}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                required
              />
            </div>

            <div>
              <label htmlFor="receiptNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Number
              </label>
              <input
                type="text"
                id="receiptNumber"
                name="receiptNumber"
                value={formData.receiptNumber}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-base"
              />
            </div>
          </div>
        </div>

        {/* E-Signature */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">✍️ E-Signature</h2>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="eSignatureRequired"
              name="eSignatureRequired"
              checked={formData.eSignatureRequired}
              onChange={handleInputChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="eSignatureRequired" className="text-sm font-medium text-gray-700">
              E-Signature required
            </label>
            {formData.eSignatureRequired && (
              <button
                type="button"
                onClick={handleSignatureRequired}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                {signatureDataUrl ? 'Update Signature' : 'Add Signature'}
              </button>
            )}
          </div>
          
          {signatureDataUrl && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Signature Preview:</p>
              <img 
                src={signatureDataUrl} 
                alt="Signature" 
                className="max-w-full h-20 border border-gray-300 rounded"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 focus:ring-2 focus:ring-green-500"
          >
            {isGenerating ? '📱 Generating PDF...' : '📄 Generate Receipt PDF'}
          </button>

          <button
            type="button"
            onClick={handleClearStorage}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500"
          >
            🗑️ Clear All Data
          </button>
        </div>
      </form>

      {/* Mobile Signature Modal */}
      <MobileSignatureModal
        isOpen={isSignatureModalOpen}
        onConfirm={handleSignatureConfirm}
        onCancel={handleSignatureCancel}
      />
    </div>
  );
};

export default MobileReceiptForm;

