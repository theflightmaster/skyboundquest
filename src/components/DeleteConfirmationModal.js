'use client';

import { X, AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, bookingReference, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-in fade-in zoom-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Confirm Delete</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete this booking?
          </p>
          <p className="text-sm font-mono text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg inline-block">
            Reference: {bookingReference}
          </p>
          <p className="text-sm text-red-600 mt-4 flex items-center gap-2">
            <AlertTriangle size={14} />
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Booking
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}