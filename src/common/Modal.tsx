// Modal.tsx
import React from 'react';
import './Modal.css'; // Ensure you have the modal styles defined as previously mentioned

function Modal({ isOpen, onClose, children }){
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">Close</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
