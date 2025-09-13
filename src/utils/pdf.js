import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

    // Build the receipt HTML content
    receiptElement.innerHTML = `
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2" style="font-size: 28px; font-weight: bold; margin-bottom: 16px;">
          ${formData.titleName || 'Rental Receipt'}
        </h1>
        <p class="text-lg" style="font-size: 16px; color: #666;">
          ${formData.titleAddress || ''}
        </p>
      </div>
      
      <div class="flex justify-between mb-8" style="margin-bottom: 32px;">
        <div>
          <strong>Receipt Number:</strong> ${formData.receiptNumber}
        </div>
        <div>
          <strong>Date:</strong> ${formData.dateOfReceipt}
        </div>
      </div>
      
      <div class="mb-8" style="margin-bottom: 32px;">
        <p class="text-lg leading-relaxed" style="font-size: 18px; line-height: 1.8;">
          Received <strong>${formData.denomination} ${formData.amount}</strong> from 
          <strong>${formData.tenantName}</strong> as rent/advance/lending for the period 
          <strong>${formData.durationFrom}</strong> - <strong>${formData.durationTo}</strong> 
          under the term <strong>${formData.term}</strong>.
        </p>
      </div>
      
      <div class="mt-16" style="margin-top: 64px;">
        <div class="text-center">
          ${signatureDataUrl ? `
            <div class="mb-4">
              <img src="${signatureDataUrl}" alt="Signature" style="max-width: 200px; max-height: 100px; border: 1px solid #ddd;" />
            </div>
          ` : ''}
          <div class="border-t-2 border-gray-400 pt-2" style="border-top: 2px solid #9ca3af; padding-top: 8px; width: 200px; margin: 0 auto;">
            <span class="text-sm font-medium" style="font-size: 12px; font-weight: 500;">Signature</span>
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
 * Generate receipt number in format RCT-YYYY-XXXX
 * @param {number} sequenceNumber - The sequence number
 * @returns {string} Formatted receipt number
 */
export const generateReceiptNumber = (sequenceNumber) => {
  const year = new Date().getFullYear();
  const paddedSequence = sequenceNumber.toString().padStart(4, '0');
  return `RCT-${year}-${paddedSequence}`;
};
