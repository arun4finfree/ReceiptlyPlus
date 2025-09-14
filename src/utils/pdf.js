import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Convert number to words (Indian numbering system)
 * @param {string|number} num - The number to convert
 * @returns {string} Number in words
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

/**
 * Format date for display (DD-MMM-YYYY format)
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Generate receipt text based on payment mode
 * @param {Object} formData - The form data
 * @returns {string} Formatted receipt text
 */
const generateReceiptText = (formData) => {
  const amount = formData.amount;
  const amountInWords = convertNumberToWords(amount);
  const tenantName = formData.tenantName;
  const term = formData.term;
  const durationFrom = formatDateForDisplay(formData.durationFrom);
  const durationTo = formatDateForDisplay(formData.durationTo);
  const paymentMode = formData.paymentMode;
  const referenceNo = formData.referenceNo;
  const transactionDate = formatDateForDisplay(formData.dateOfTransaction);

  if (paymentMode === 'Cash') {
    return `This is to acknowledge the receipt of <strong>₹${amount}</strong> (<strong>${amountInWords} Only</strong>) from <strong>${tenantName}</strong> towards ${term} rent for the period <strong>${durationFrom}</strong> to <strong>${durationTo}</strong>, paid via Cash.`;
  } else {
    return `This is to acknowledge the receipt of <strong>₹${amount}</strong> (<strong>${amountInWords} Only</strong>) from <strong>${tenantName}</strong> towards ${term} rent for the period <strong>${durationFrom}</strong> to <strong>${durationTo}</strong>, paid via ${paymentMode} (${referenceNo}) on ${transactionDate}.`;
  }
};

/**
 * Generate a PDF receipt from form data and signature
 * @param {Object} formData - The receipt form data
 * @param {string} signatureDataUrl - Base64 signature image data URL
 * @returns {Promise<void>}
 */
export const generateReceiptPDF = async (formData, signatureDataUrl) => {
  try {
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
    
    receiptElement.innerHTML = `
      <div style="border: 4px double #000; padding: 20px; min-height: 180mm; background: white;">
        <div class="text-center mb-4" style="margin-bottom: 16px;">
          <h1 class="text-3xl font-bold mb-1" style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">
            ${formData.titleName || 'Rental Receipt'}
          </h1>
          <p class="text-lg" style="font-size: 16px; color: #666; margin-bottom: 8px;">
            ${formData.titleAddress || ''}
          </p>
          <hr style="border: 1px solid #000; margin: 8px 0;">
        </div>
        
        <div class="flex justify-between mb-6" style="margin-bottom: 24px;">
          <div>
            <strong>Receipt Number:</strong> ${formData.receiptNumber}
          </div>
          <div style="text-align: center; flex: 1;">
            <strong>Receipt</strong>
          </div>
          <div>
            <strong>Date:</strong> ${formatDateForDisplay(formData.dateOfTransaction)}
          </div>
        </div>
        
        <div class="mb-8" style="margin-bottom: 32px;">
          <p class="text-lg leading-relaxed" style="font-size: 18px; line-height: 1.8; text-align: justify;">
            ${receiptText}
          </p>
        </div>
        
        <div class="mt-16" style="margin-top: 64px;">
          <div style="text-align: right;">
            ${signatureDataUrl ? `
              <div class="mb-4" style="margin-bottom: 16px;">
                <img src="${signatureDataUrl}" alt="Signature" style="max-width: 200px; max-height: 100px; background: white;" />
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

    // Generate canvas from HTML element
    const canvas = await html2canvas(receiptElement, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: receiptElement.offsetWidth,
      height: receiptElement.offsetHeight
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
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

    // Save the PDF
    pdf.save(filename);

    // Clean up
    document.body.removeChild(receiptElement);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

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

/**
 * Generate receipt number in format RCT-YYMM-HHMM
 * @param {number} sequenceNumber - The sequence number (not used in new format)
 * @returns {string} Formatted receipt number
 */
export const generateReceiptNumber = (sequenceNumber) => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month (01-12)
  const hours = now.getHours().toString().padStart(2, '0'); // Hours (00-23)
  const minutes = now.getMinutes().toString().padStart(2, '0'); // Minutes (00-59)
  return `RCT-${year}${month}-${hours}${minutes}`;
};

