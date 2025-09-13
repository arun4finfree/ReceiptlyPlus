import React, { useState, useEffect } from 'react';
import SignatureModal from './SignatureModal';
import { generateReceiptPDF, formatDate, generateReceiptNumber } from '../utils/pdf';

/**
 * ReceiptForm component - Main form for creating rental receipts
 * Handles form state, localStorage persistence, and PDF generation
 */
const ReceiptForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    titleName: '',
    titleAddress: '',
    tenantName: '',
    durationFrom: '',
    durationTo: '',
    term: 'Monthly',
    denomination: 'INR',
    amount: '',
    dateOfReceipt: new Date().toISOString().split('T')[0], // Today's date
    receiptNumber: '',
    eSignatureRequired: false
  });

  // Component state
  const [signatureDataUrl, setSignatureDataUrl] = useState('');
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');

  // Initialize form with stored data and generate receipt number
  useEffect(() => {
    // Load last receipt number from localStorage
    const lastSequence = parseInt(localStorage.getItem('rental_receipt_seq') || '0');
    const nextSequence = lastSequence + 1;
    const receiptNumber = generateReceiptNumber(nextSequence);

    setFormData(prev => ({
      ...prev,
      receiptNumber
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
          dateOfReceipt: new Date().toISOString().split('T')[0] // Always use today's date
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
      denomination: formData.denomination,
      amount: formData.amount,
      eSignatureRequired: formData.eSignatureRequired
    };
    localStorage.setItem('rental_receipt_form_data', JSON.stringify(dataToSave));
  }, [formData]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
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

  // Validate form data
  const validateForm = () => {
    const required = ['titleName', 'tenantName', 'durationFrom', 'durationTo', 'amount'];
    const missing = required.filter(field => !formData[field].trim());
    
    if (missing.length > 0) {
      setMessage(`Please fill in: ${missing.join(', ')}`);
      return false;
    }

    if (formData.eSignatureRequired && !signatureDataUrl) {
      setMessage('E-signature is required but not provided. Please sign the document.');
      return false;
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
        dateOfReceipt: formatDate(formData.dateOfReceipt)
      };

      // Generate PDF
      await generateReceiptPDF(pdfData, signatureDataUrl);

      // Save receipt to localStorage
      const receipt = {
        id: formData.receiptNumber,
        ...pdfData,
        signatureDataUrl,
        createdAt: new Date().toISOString()
      };

      // Get existing receipts
      const existingReceipts = JSON.parse(localStorage.getItem('rental_receipts') || '[]');
      existingReceipts.push(receipt);
      localStorage.setItem('rental_receipts', JSON.stringify(existingReceipts));

      // Update sequence number
      const currentSequence = parseInt(localStorage.getItem('rental_receipt_seq') || '0');
      localStorage.setItem('rental_receipt_seq', (currentSequence + 1).toString());

      // Generate next receipt number
      const nextSequence = currentSequence + 2;
      const nextReceiptNumber = generateReceiptNumber(nextSequence);

      // Reset form for next receipt
      setFormData(prev => ({
        ...prev,
        receiptNumber: nextReceiptNumber,
        dateOfReceipt: new Date().toISOString().split('T')[0],
        amount: '',
        tenantName: '',
        durationFrom: '',
        durationTo: ''
      }));

      setSignatureDataUrl('');
      setMessage('Receipt generated and saved successfully!');
      setTimeout(() => setMessage(''), 5000);

    } catch (error) {
      console.error('Error generating PDF:', error);
      setMessage('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Clear all stored data
  const handleClearStorage = () => {
    if (window.confirm('Are you sure you want to clear all stored receipts and reset the sequence? This action cannot be undone.')) {
      localStorage.removeItem('rental_receipts');
      localStorage.removeItem('rental_receipt_seq');
      localStorage.removeItem('rental_receipt_form_data');
      
      // Reset to initial state
      const nextSequence = 1;
      const receiptNumber = generateReceiptNumber(nextSequence);
      
      setFormData(prev => ({
        ...prev,
        receiptNumber,
        dateOfReceipt: new Date().toISOString().split('T')[0],
        amount: '',
        tenantName: '',
        durationFrom: '',
        durationTo: ''
      }));
      
      setSignatureDataUrl('');
      setMessage('All data cleared successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          ReceiptlyPlus
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Professional Rental Receipt Generator with E-Signature Support
        </p>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('Error') || message.includes('Please fill in')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        <form className="space-y-6">
          {/* Header Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="titleName" className="form-label">
                Title Name (Company/Person) *
              </label>
              <input
                type="text"
                id="titleName"
                name="titleName"
                value={formData.titleName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter company or person name"
                required
              />
            </div>

            <div>
              <label htmlFor="denomination" className="form-label">
                Currency Denomination
              </label>
              <select
                id="denomination"
                name="denomination"
                value={formData.denomination}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="INR">INR (Indian Rupees)</option>
                <option value="USD">USD (US Dollars)</option>
                <option value="EUR">EUR (Euros)</option>
                <option value="GBP">GBP (British Pounds)</option>
                <option value="CAD">CAD (Canadian Dollars)</option>
                <option value="AUD">AUD (Australian Dollars)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="titleAddress" className="form-label">
              Title Address
            </label>
            <textarea
              id="titleAddress"
              name="titleAddress"
              value={formData.titleAddress}
              onChange={handleInputChange}
              className="form-input"
              rows="3"
              placeholder="Enter address"
            />
          </div>

          {/* Tenant Information */}
          <div>
            <label htmlFor="tenantName" className="form-label">
              Tenant Name *
            </label>
            <input
              type="text"
              id="tenantName"
              name="tenantName"
              value={formData.tenantName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter tenant name"
              required
            />
          </div>

          {/* Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="durationFrom" className="form-label">
                Duration From *
              </label>
              <input
                type="date"
                id="durationFrom"
                name="durationFrom"
                value={formData.durationFrom}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label htmlFor="durationTo" className="form-label">
                Duration To *
              </label>
              <input
                type="date"
                id="durationTo"
                name="durationTo"
                value={formData.durationTo}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label htmlFor="term" className="form-label">
                Term
              </label>
              <select
                id="term"
                name="term"
                value={formData.term}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="amount" className="form-label">
                Amount *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter amount"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label htmlFor="dateOfReceipt" className="form-label">
                Date of Receipt
              </label>
              <input
                type="date"
                id="dateOfReceipt"
                name="dateOfReceipt"
                value={formData.dateOfReceipt}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label htmlFor="receiptNumber" className="form-label">
                Receipt Number
              </label>
              <input
                type="text"
                id="receiptNumber"
                name="receiptNumber"
                value={formData.receiptNumber}
                className="form-input bg-gray-50"
                readOnly
              />
            </div>
          </div>

          {/* E-Signature Option */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="eSignatureRequired"
              name="eSignatureRequired"
              checked={formData.eSignatureRequired}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="eSignatureRequired" className="text-sm font-medium text-gray-700">
              E-Signature required
            </label>
            {formData.eSignatureRequired && (
              <button
                type="button"
                onClick={handleSignatureRequired}
                className="btn-primary text-sm"
              >
                {signatureDataUrl ? 'Update Signature' : 'Add Signature'}
              </button>
            )}
          </div>

          {/* Signature Preview */}
          {signatureDataUrl && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <label className="form-label">Signature Preview</label>
              <div className="flex items-center space-x-4">
                <img
                  src={signatureDataUrl}
                  alt="Signature"
                  className="border border-gray-300 rounded max-h-20"
                />
                <button
                  type="button"
                  onClick={() => setSignatureDataUrl('')}
                  className="btn-danger text-sm"
                >
                  Remove Signature
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating PDF...' : 'Generate Receipt PDF'}
            </button>

            <button
              type="button"
              onClick={handleClearStorage}
              className="btn-danger flex-1"
            >
              Clear All Data
            </button>
          </div>
        </form>

        {/* Signature Modal */}
        <SignatureModal
          isOpen={isSignatureModalOpen}
          onClose={() => setIsSignatureModalOpen(false)}
          onConfirm={handleSignatureConfirm}
          onCancel={handleSignatureCancel}
        />
      </div>
    </div>
  );
};

export default ReceiptForm;
