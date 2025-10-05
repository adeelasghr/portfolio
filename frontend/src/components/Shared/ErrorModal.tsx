// components/Common/ErrorModal.tsx
import { X } from "lucide-react";
import React from "react";

interface ErrorModalProps {
  show: boolean;
  errors: string[];
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ show, errors, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-4 shadow-xl w-full max-w-sm animate-fade-in">
 <div className="flex flex-col items-center text-center">
           <div
            className= "bg-red-100 text-red-600 rounded-full p-3 mb-2">
            <X />
          </div>
            <h2 className="text-xl font-semibold mb-1">Error</h2>
        <ul className="list-none list-inside space-y-2 text-sm text-gray-700">
          {errors.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-700 text-white rounded"
          >
            Close
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;