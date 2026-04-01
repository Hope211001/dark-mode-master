import { useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

interface ErrorAlertProps {
    message: string;
    visible: boolean;
    onClose: () => void;
    duration?: number;
}

const ErrorAlert = ({ message, visible, onClose, duration = 5000 }: ErrorAlertProps) => {
    useEffect(() => {
        if (visible && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [visible, duration, onClose]);

    if (!visible) return null;

    return (
        <div className="fixed top-20 right-4 left-4 md:left-[272px] md:right-6 z-[200] pointer-events-none animate-in slide-in-from-top-2 fade-in duration-300">
            <div className="flex justify-end">
                <div className="pointer-events-auto flex items-start gap-3 bg-[#1e293b] border border-red-500/30 rounded-xl px-4 py-3 md:px-5 md:py-4 shadow-2xl shadow-red-500/10 w-full md:w-auto md:min-w-[340px] md:max-w-[440px]">
                    <div className="flex-shrink-0 mt-0.5">
                        <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-red-500/15 flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-400" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-semibold text-red-400">Erreur</p>
                        <p className="text-xs md:text-sm text-slate-300 mt-0.5 leading-relaxed">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 h-7 w-7 md:h-8 md:w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorAlert;
