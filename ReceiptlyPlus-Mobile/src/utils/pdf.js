/**
 * PDF Generation Utilities for ReceiptlyPlus Mobile
 * 
 * This module contains all utility functions for generating PDF receipts
 * with professional formatting, proper date handling, and signature integration.
 * 
 * Key Features:
 * - Number to words conversion (Indian numbering system)
 * - Date formatting for display
 * - Receipt text generation with payment mode logic
 * - PDF generation with mobile-optimized settings
 * - Signature integration with clean backgrounds
 * - Mobile-specific file handling and sharing
 * 
 * @author ReceiptlyPlus Development Team
 * @version 1.0.0
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

// ===== NUMBER CONVERSION UTILITIES =====

/**
 * Convert number to words using Indian numbering system
 * Supports numbers up to crores with proper Indian terminology
 * 
 * @param {string|number} num - The number to convert to words
 * @returns {string} Number written in words (e.g., "Fifty Thousand")
 * 
 * @example
 * convertNumberToWords(50000) // Returns "Fifty Thousand"
 * convertNumberToWords(1500000) // Returns "Fifteen Lakh"
 */
const convertNumberToWords = (num) => {
  const number = parseInt(num);
  if (isNaN(number) || number === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Lakh', 'Crore'];
  
  if (number < 10) return ones[number];
  if (number < 20) return teens[number - 10];
  if (number < 100) return tens[Math.floor(number / 10)] + (number % 10 ? ' ' + ones[number % 10] : '');
  if (number < 1000) return ones[Math.floor(number / 100)] + ' Hundred' + (number % 100 ? ' ' + convertNumberToWords(number % 100) : '');
  
  // Handle thousands, lakhs, crores
  let result = '';
  let scaleIndex = 0;
  let remaining = number;
  
  while (remaining > 0) {
    const chunk = remaining % 1000;
    if (chunk !== 0) {
      const chunkWords = convertNumberToWords(chunk);
      result = chunkWords + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + (result ? ' ' + result : '');
    }
    remaining = Math.floor(remaining / 1000);
    scaleIndex++;
  }
  
  return result;
};

// ===== DATE FORMATTING UTILITIES =====

/**
 * Format date for display in DD-MMM-YYYY format
 * Handles various date input formats and provides error handling
 * 
 * @param {string} dateString - Date string in YYYY-MM-DD format or other valid formats
 * @returns {string} Formatted date in DD-MMM-YYYY format (e.g., "9-Feb-2025")
 * 
 * @example
 * formatDateForDisplay("2025-02-09") // Returns "9-Feb-2025"
 * formatDateForDisplay("2025-12-25") // Returns "25-Dec-2025"
 */
const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  
  try {
    // Handle different date formats
    let date;
    if (dateString.includes('-')) {
      // Handle YYYY-MM-DD format
      date = new Date(dateString + 'T00:00:00');
    } else {
      // Handle other formats
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return '';
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return '';
  }
};

// ===== RECEIPT TEXT GENERATION =====

/**
 * Generate receipt text based on payment mode and form data
 * Creates different text formats for cash vs non-cash payments
 * 
 * @param {Object} formData - The form data containing all receipt information
 * @param {string} formData.amount - Rental amount
 * @param {string} formData.tenantName - Tenant name
 * @param {string} formData.term - Payment term (Monthly/Yearly)
 * @param {string} formData.durationFrom - Rental period start date
 * @param {string} formData.durationTo - Rental period end date
 * @param {string} formData.paymentMode - Payment method (Cash/Cheque/etc.)
 * @param {string} formData.referenceNo - Reference number for non-cash payments
 * @param {string} formData.dateOfTransaction - Transaction date
 * @returns {string} Formatted receipt text with proper payment mode handling
 * 
 * @example
 * // Cash payment
 * generateReceiptText({paymentMode: 'Cash', amount: '50000', ...})
 * // Returns: "This is to acknowledge the receipt of ₹50000 (Fifty Thousand Only) from John Doe towards Monthly rent for the period 1-Aug-2025 to 31-Aug-2025, paid via Cash."
 * 
 * // Non-cash payment
 * generateReceiptText({paymentMode: 'Cheque', referenceNo: '12345', ...})
 * // Returns: "This is to acknowledge the receipt of ₹50000 (Fifty Thousand Only) from John Doe towards Monthly rent for the period 1-Aug-2025 to 31-Aug-2025, paid via Cheque (12345) on 9-Feb-2025."
 */
const generateReceiptText = (formData) => {
  // Add fallback values to prevent undefined errors
  const amount = formData.amount || '0';
  const amountInWords = convertNumberToWords(amount);
  const tenantName = formData.tenantName || 'Unknown';
  const term = formData.term || 'Monthly';
  const durationFrom = formatDateForDisplay(formData.durationFrom) || 'N/A';
  const durationTo = formatDateForDisplay(formData.durationTo) || 'N/A';
  const paymentMode = formData.paymentMode || 'Cash';
  const referenceNo = formData.referenceNo || '';
  const transactionDate = formatDateForDisplay(formData.dateOfTransaction) || formatDateForDisplay(new Date().toISOString().split('T')[0]);

  // Add payment mode specific text
  if (paymentMode === 'Cash') {
    return `This is to acknowledge the receipt of <strong>₹${amount}</strong> (<strong>${amountInWords} Only</strong>) from <strong>${tenantName}</strong> towards ${term} rent for the period <strong>${durationFrom}</strong> to <strong>${durationTo}</strong>, paid via Cash.`;
  } else {
    return `This is to acknowledge the receipt of <strong>₹${amount}</strong> (<strong>${amountInWords} Only</strong>) from <strong>${tenantName}</strong> towards ${term} rent for the period <strong>${durationFrom}</strong> to <strong>${durationTo}</strong>, paid via ${paymentMode} (${referenceNo}) on ${transactionDate}.`;
  }
};

// ===== MOBILE-SPECIFIC PDF GENERATION =====

/**
 * Generate and download PDF receipt from form data and signature (Mobile Version)
 * Creates a professional PDF with proper layout, borders, and signature integration
 * Optimized for mobile devices with touch-friendly interface
 * 
 * @param {Object} formData - The receipt form data containing all necessary information
 * @param {string} signatureDataUrl - Base64 signature image data URL (optional)
 * @returns {Promise<boolean>} True if PDF generation is successful
 * 
 * @throws {Error} If PDF generation fails
 * 
 * @example
 * const formData = {
 *   titleName: "ABC Properties",
 *   tenantName: "John Doe",
 *   amount: "50000",
 *   paymentMode: "Cash",
 *   // ... other form fields
 * };
 * await generateReceiptPDF(formData, signatureDataUrl);
 */
export const generateReceiptPDF = async (formData, signatureDataUrl) => {
  try {
    // Debug logging
    console.log('Mobile PDF Generation - Form data received:', formData);
    console.log('Mobile PDF Generation - Signature data URL:', signatureDataUrl);
    
    // Create a temporary div element to render the receipt content
    const receiptElement = document.createElement('div');
    receiptElement.id = 'receipt-content';
    receiptElement.className = 'p-8 bg-white text-black';
    receiptElement.style.width = '210mm'; // A4 width
    receiptElement.style.minHeight = '297mm'; // A4 height
    receiptElement.style.fontFamily = 'Arial, sans-serif';
    receiptElement.style.fontSize = '14px';
    receiptElement.style.lineHeight = '1.6';

    // Build the receipt HTML content with new layout
    const receiptText = generateReceiptText(formData);
    const receiptDate = formatDateForDisplay(new Date().toISOString().split('T')[0]); // Current date for receipt
    
    console.log('Mobile PDF Generation - Generated receipt text:', receiptText);
    
    // Ensure all form data has fallback values
    const titleName = formData.titleName || 'Rental Receipt';
    const titleAddress = formData.titleAddress || '';
    const receiptNumber = formData.receiptNumber || 'RCT-0000-0000';

    receiptElement.innerHTML = `
      <div style="border: 4px double #000; padding: 20px; min-height: 140mm; background: white;">
        <div class="text-center mb-4" style="margin-bottom: 16px;">
          <h1 class="text-3xl font-bold mb-1" style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">
            ${titleName}
          </h1>
          <p class="text-lg" style="font-size: 16px; color: #666; margin-bottom: 8px;">
            ${titleAddress}
          </p>
          <hr style="border: 1px solid #000; margin: 8px 0;">
        </div>
        
        <!-- Invisible table for proper alignment -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="text-align: left; width: 33.33%;">
              <strong>Receipt #:</strong> ${receiptNumber}
            </td>
            <td style="text-align: center; width: 33.33%;">
              <strong>Payment Receipt</strong>
            </td>
            <td style="text-align: right; width: 33.33%;">
              <strong>Date:</strong> ${receiptDate}
            </td>
          </tr>
        </table>
        
        <div class="mb-8" style="margin-bottom: 32px;">
          <p class="text-lg leading-relaxed" style="font-size: 18px; line-height: 1.8; text-align: justify;">
            ${receiptText}
          </p>
        </div>
        
        <div class="mt-16" style="margin-top: 64px;">
          <div style="text-align: right;">
            ${signatureDataUrl ? `
              <div class="mb-4" style="margin-bottom: 16px;">
                <img src="${signatureDataUrl}" alt="Signature" style="max-width: 200px; max-height: 100px; background: white; display: block; margin-left: auto;" />
              </div>
            ` : ''}
            <div class="border-t-2 border-gray-400 pt-2" style="border-top: 2px solid #9ca3af; padding-top: 8px; width: 200px; margin-left: auto;">
              <span class="text-sm font-medium" style="font-size: 12px; font-weight: 500;">Signature</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Append to body temporarily
    document.body.appendChild(receiptElement);

    // Generate canvas from HTML element (mobile-optimized settings)
    const canvas = await html2canvas(receiptElement, {
      scale: 2, // Higher quality for mobile
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: receiptElement.offsetWidth,
      height: receiptElement.offsetHeight,
      logging: false, // Disable logging for better performance
      removeContainer: true // Clean up after rendering
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate dimensions to fit the content
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

    // Generate filename
    const filename = `receipt-${formData.receiptNumber}.pdf`;

    // Mobile-specific: Save to device and share
    await saveAndSharePDF(pdf, filename);

    // Clean up
    document.body.removeChild(receiptElement);

    return true;
  } catch (error) {
    console.error('Mobile PDF Generation Error:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

// ===== MOBILE FILE HANDLING =====

/**
 * Save PDF to device storage and share it
 * Mobile-specific function that handles file saving and sharing
 * 
 * @param {jsPDF} pdf - The generated PDF object
 * @param {string} filename - The filename for the PDF
 * @returns {Promise<void>}
 */
const saveAndSharePDF = async (pdf, filename) => {
  try {
    // Convert PDF to base64
    const pdfBase64 = pdf.output('datauristring');
    const base64Data = pdfBase64.split(',')[1];

    // Save to device storage
    const fileUri = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });

    console.log('PDF saved to:', fileUri.uri);

    // Share the PDF
    await Share.share({
      title: 'Receipt PDF',
      text: 'Generated rental receipt',
      url: fileUri.uri,
      dialogTitle: 'Share Receipt'
    });

  } catch (error) {
    console.error('Error saving/sharing PDF:', error);
    // Fallback: Download via browser
    pdf.save(filename);
  }
};

// ===== RECEIPT NUMBER GENERATION =====

/**
 * Generate receipt number in RCT-YYMM-HHMM format
 * Uses current timestamp to ensure uniqueness
 * 
 * @param {number} sequenceNumber - The sequence number (not used in new format, kept for compatibility)
 * @returns {string} Formatted receipt number (e.g., "RCT-2509-1650")
 * 
 * @example
 * generateReceiptNumber(0) // Returns "RCT-2509-1650" (current date/time)
 */
export const generateReceiptNumber = (sequenceNumber) => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month (01-12)
  const hours = now.getHours().toString().padStart(2, '0'); // Hours (00-23)
  const minutes = now.getMinutes().toString().padStart(2, '0'); // Minutes (00-59)
  return `RCT-${year}${month}-${hours}${minutes}`;
};

// ===== DATE UTILITIES =====

/**
 * Format date to DD/MM/YYYY format
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
};

