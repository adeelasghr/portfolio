import {Check, X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface MessageBoxProps {
  children: React.ReactNode;
  onClose: () => void;
  code: string;
  title: string;
  primaryAction: {
    label: string;
    path: string;
  };
  secondaryAction: {
    label: string;
    path: string;
  };
}

const MessageBox: React.FC<MessageBoxProps> = ({
  code,
  onClose,
  title,
  primaryAction,
  secondaryAction,
  children,
}) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <div
            className={`${
              code === "red"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            } rounded-full p-3 mb-4`}
          >
            {code === "green" ? <Check /> : <X />}
          </div>
          <h2 className="text-xl font-semibold mb-1">{title}</h2>
          <p className="text-gray-600 mb-4">{children}</p>

          <div className="flex gap-3 mt-2">
            {code === "green" ? (
              <>
                <button
                  onClick={() => navigate(secondaryAction.path)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
                >
                  {secondaryAction.label}
                </button>
                <button
                  onClick={() => navigate(primaryAction.path)}
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-900 transition"
                >
                  {primaryAction.label}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
                >
                  {primaryAction.label}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
