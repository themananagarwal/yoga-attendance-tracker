import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAttendanceStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';

interface EditDayModalProps {
    date: Date | null;
    onClose: () => void;
}

export function EditDayModal({ date, onClose }: EditDayModalProps) {
    const { getRecord, toggleAttendance, setNote } = useAttendanceStore();
    const [note, setNoteInput] = useState('');

    // Sync internal state when date changes
    useEffect(() => {
        if (date) {
            const record = getRecord(date);
            setNoteInput(record?.note || '');
        }
    }, [date, getRecord]);

    if (!date) return null;

    const record = getRecord(date);
    const isAttended = record?.status === 'attended';
    const dateStr = format(date, 'EEEE, MMMM do');

    const handleSave = () => {
        setNote(date, note);
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-full max-w-sm bg-surface rounded-2xl border border-white/10 p-6 shadow-2xl space-y-6"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white tracking-tight">{dateStr}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Toggle Status */}
                    <button
                        onClick={() => toggleAttendance(date)}
                        className={cn(
                            "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-sm",
                            isAttended
                                ? "bg-success text-white hover:bg-success/90 ring-4 ring-success/20"
                                : "bg-white border border-secondary/20 text-primary hover:bg-secondary/5"
                        )}
                    >
                        {isAttended ? (
                            <>
                                <Check size={24} strokeWidth={3} />
                                <span>Session Complete</span>
                            </>
                        ) : (
                            <span>Mark as Attended</span>
                        )}
                    </button>

                    {/* Note/Comment */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted">Session Note</label>
                        <textarea
                            value={note}
                            onChange={e => setNoteInput(e.target.value)}
                            placeholder="Add details (e.g., Vinyasa flow, 1hr)"
                            className="w-full bg-background rounded-lg border border-white/10 p-3 text-sm text-primary placeholder:text-muted/50 focus:outline-none focus:border-white/20 h-24 resize-none"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button onClick={handleSave} className="flex-1 py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-colors">
                            Save
                        </button>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
