import { motion } from "framer-motion";
import { Mail, MessageCircle, MessageSquare, X } from "lucide-react";

interface SendContractPopupProps {
    contractId: number;
    onClose: () => void;
  }

  const SendContractPopup: React.FC<SendContractPopupProps> = ({contractId, onClose }) => {
  return (
    <>
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >

    <motion.div
          initial={{ scale: 0, rotate: -10, y: 100 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          exit={{ scale: 0, rotate: 10, y: -100 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-white rounded-xl overflow-hidden popup-bg shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
              </motion.div>
            </div>
          </div>
          <div className="p-8">
          <h3 className="card-header text-xl mb-6 modal-title">Send Contract via</h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 p-6"
              >
                     <div className="flex gap-8">
        <a 
          href="https://wa.me/1234567890" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 group"
        >
          <div className="p-3 rounded bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors duration-200">
            <MessageCircle size={24} />
          </div>
          <span className="text-sm font-medium text-slate-600 group-hover:text-emerald-600 transition-colors duration-200">
            WhatsApp
          </span>
        </a>
        <a 
          href="mailto:example@email.com"
          className="flex flex-col items-center gap-2 group"
        >
          <div className="p-3 rounded bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors duration-200">
            <Mail size={24} />
          </div>
          <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors duration-200">
            Email
          </span>
        </a>
        <a 
          href="sms:1234567890"
          className="flex flex-col items-center gap-2 group"
        >
          <div className="p-3 rounded bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors duration-200">
            <MessageSquare size={24} />
          </div>
          <span className="text-sm font-medium text-slate-600 group-hover:text-purple-600 transition-colors duration-200">
            SMS
          </span>
        </a>
      </div>
              </motion.div>

            </div>
  
          </div>
        </motion.div>

        </motion.div>
    </>
  )
}
export default SendContractPopup;