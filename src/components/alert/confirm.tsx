import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmAlertProps {
    message: string;
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmAlert = ({ message, visible, onClose, onConfirm, confirmText = "Confirmer", cancelText = "Annuler" }: ConfirmAlertProps) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative animate-in zoom-in-95 fade-in duration-200 bg-[#1e293b] border border-amber-500/30 rounded-2xl px-5 py-5 md:px-6 shadow-2xl shadow-amber-500/10 w-full max-w-[460px]">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <X className="h-4 w-4" />
                </button>
                <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                        <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-amber-500/15 flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-amber-400" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                        <p className="text-xs md:text-sm font-semibold text-amber-400">Confirmation</p>
                        <p className="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">{message}</p>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 mt-5 md:mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl border-white/10 text-slate-300 hover:bg-white/5 hover:text-white text-xs md:text-sm"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs md:text-sm"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmAlert;
