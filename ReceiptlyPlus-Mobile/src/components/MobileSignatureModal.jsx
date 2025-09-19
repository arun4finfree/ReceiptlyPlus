/**
 * MobileSignatureModal Component - Mobile-optimized signature capture
 * 
 * This component provides a touch-friendly signature capture interface
 * specifically designed for mobile devices with larger touch areas,
 * better gesture recognition, and mobile-optimized UI.
 * 
 * Key Features:
 * - Touch-optimized signature canvas
 * - Mobile-friendly modal design
 * - Gesture-based signature capture
 * - High-resolution signature output
 * - Responsive design for various screen sizes
 * - Clear and reset functionality
 * 
 * @author ReceiptlyPlus Development Team
 * @version 1.0.0
 */

import React, { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

/**
 * Mobile-optimized signature modal component
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onConfirm - Callback when signature is confirmed
 * @param {function} onCancel - Callback when modal is cancelled
 */
const MobileSignatureModal = ({ isOpen, onConfirm, onCancel }) => {
  const signatureRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 200 });

  // Update canvas size based on screen size
  useEffect(() => {
    const updateCanvasSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Calculate optimal canvas size for mobile
      const maxWidth = Math.min(screenWidth - 80, 500); // Leave margin for modal padding
      const maxHeight = Math.min(screenHeight * 0.4, 300); // Max 40% of screen height
      
      setCanvasSize({
        width: maxWidth,
        height: Math.max(150, maxHeight) // Minimum height of 150px
      });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('orientationchange', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('orientationchange', updateCanvasSize);
    };
  }, []);

  // Clear signature
  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsDrawing(false);
    }
  };

  // Confirm signature
  const handleConfirm = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const signatureData = signatureRef.current.toDataURL('image/png');
      onConfirm(signatureData);
    } else {
      alert('Please provide a signature before confirming.');
    }
  };

  // Handle drawing start
  const handleBegin = () => {
    setIsDrawing(true);
  };

  // Handle drawing end
  const handleEnd = () => {
    setIsDrawing(false);
  };

  // Handle touch events for better mobile experience
  const handleTouchStart = (e) => {
    e.preventDefault();
    handleBegin();
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleEnd();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-blue-600 text-white p-4">
          <h3 className="text-lg font-semibold text-center">✍️ Add Your Signature</h3>
          <p className="text-blue-100 text-sm text-center mt-1">
            Draw your signature in the box below
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          {/* Signature Canvas */}
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                width: canvasSize.width,
                height: canvasSize.height,
                className: 'signature-canvas w-full h-full',
                style: {
                  backgroundColor: '#ffffff',
                  touchAction: 'none' // Prevent scrolling while drawing
                }
              }}
              backgroundColor="rgb(255, 255, 255)"
              penColor="rgb(0, 0, 0)"
              minWidth={2}
              maxWidth={4}
              velocityFilterWeight={0.7}
              onBegin={handleBegin}
              onEnd={handleEnd}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            />
          </div>

          {/* Drawing Status */}
          <div className="mt-3 text-center">
            {isDrawing ? (
              <p className="text-blue-600 text-sm">✏️ Drawing...</p>
            ) : (
              <p className="text-gray-500 text-sm">👆 Touch and drag to sign</p>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">📱 Mobile Tips:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Use your finger or stylus to draw</li>
              <li>• Draw slowly for better accuracy</li>
              <li>• Clear and redraw if needed</li>
              <li>• Signature will be saved as high-quality image</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-4 flex space-x-3">
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 text-sm"
          >
            🗑️ Clear
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 focus:ring-2 focus:ring-red-500 text-sm"
          >
            ❌ Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-500 text-sm"
          >
            ✅ Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSignatureModal;

