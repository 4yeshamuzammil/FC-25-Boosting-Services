import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[90%] sm:w-auto transition-all animate-bounce-short">
      <div className={`px-5 py-3.5 rounded-xl border shadow-2xl flex items-center space-x-3 text-sm font-semibold backdrop-blur-md ${
        toast.type === 'success'
          ? 'bg-[#141824]/95 border-[#00F59B]/50 text-white shadow-[#00F59B]/10'
          : toast.type === 'error'
          ? 'bg-[#141824]/95 border-[#FF3B30]/50 text-white shadow-[#FF3B30]/10'
          : 'bg-[#141824]/95 border-[#262B3D] text-gray-200'
      }`}>
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#00F59B] shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#FF3B30] shrink-0" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
        <span>{toast.text}</span>
      </div>
    </div>
  );
}
