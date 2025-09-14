import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

/**
 * SignatureModal component for capturing e-signatures
 * Uses react-signature-canvas to provide a drawing interface
 */
const SignatureModal = ({ isOpen, onClose, onConfirm, onCancel }) => {
  const signatureRef = useRef();
  const [isEmpty, setIsEmpty] = useState(true);

  // Handle signature drawing events
  const handleBegin = () => {
    setIsEmpty(false);
  };

  const handleEnd = () => {
    // Check if signature is empty
    if (signatureRef.current) {
      setIsEmpty(signatureRef.current.isEmpty());
    }
  };

  // Clear the signature canvas
  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsEmpty(true);
    }
  };

  // Confirm and save the signature
  const handleConfirm = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      // Get signature as base64 PNG data URL
      const signatureDataUrl = signatureRef.current.toDataURL('image/png');
      onConfirm(signatureDataUrl);
      handleClear(); // Clear for next use
    }
  };

  // Cancel and close modal
  const handleCancel = () => {
    handleClear();
    onCancel();
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            E-Signature Required
          </h3>
          <p className="text-sm text-gray-600">
            Please sign in the box below to complete the receipt.
          </p>
        </div>

        {/* Signature Canvas */}
        <div className="mb-4">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              className: 'signature-canvas w-full h-32',
              width: 400,
              height: 128
            }}
            onBegin={handleBegin}
            onEnd={handleEnd}
            backgroundColor="rgb(255, 255, 255)"
            penColor="rgb(17, 24, 39)"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between space-x-3">
          <button
            type="button"
            onClick={handleClear}
            className="btn-secondary flex-1"
            disabled={isEmpty}
          >
            Clear
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            className="btn-primary flex-1"
            disabled={isEmpty}
          >
            Confirm
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          Use your mouse or touch to sign above. Click "Clear" to start over.
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
