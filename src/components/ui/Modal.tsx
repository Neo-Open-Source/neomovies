'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-warm-900 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <div className="text-gray-300 mb-6">
          {children}
        </div>
        <div className="flex justify-end gap-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            Отмена
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Подтвердить удаление
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
