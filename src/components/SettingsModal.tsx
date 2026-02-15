import { useState } from 'react';
import { X, Save, Download } from 'lucide-react';
import { useAttendanceStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
    onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
    const { dailyRate, setDailyRate, exportData, importData } = useAttendanceStore();
    const [rate, setRate] = useState(dailyRate.toString());
    const [jsonInput, setJsonInput] = useState('');
    const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSave = () => {
        setDailyRate(Number(rate));
        onClose();
    };

    const handleExport = () => {
        const data = exportData();
        // Copy to clipboard or download file
        navigator.clipboard.writeText(data).then(() => {
            alert("Data copied to clipboard!");
        });
    };

    const handleImport = () => {
        if (importData(jsonInput)) {
            setImportStatus('success');
            setTimeout(() => setImportStatus('idle'), 2000);
        } else {
            setImportStatus('error');
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-md bg-surface rounded-2xl border border-white/10 p-6 shadow-2xl space-y-6"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <h2 className="text-xl font-bold text-white tracking-tight">Settings</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Rate Setting */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted">Daily Rate (₹)</label>
                        <input
                            type="number"
                            value={rate}
                            onChange={e => setRate(e.target.value)}
                            className="w-full bg-background rounded-lg border border-white/10 p-3 text-lg font-mono text-white placeholder:text-muted/50 focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Data Management */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <h3 className="text-sm font-medium text-white">Data Management</h3>

                        <button onClick={handleExport} className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                            <Download size={16} />
                            Export Data (Copy Backup)
                        </button>

                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Paste JSON backup here..."
                                    value={jsonInput}
                                    onChange={e => setJsonInput(e.target.value)}
                                    className="flex-1 bg-background rounded-lg border border-white/10 p-2 text-xs text-muted focus:outline-none focus:border-white/20"
                                />
                                <button
                                    onClick={handleImport}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${importStatus === 'success' ? 'bg-success text-white' : importStatus === 'error' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                                >
                                    {importStatus === 'success' ? 'Done' : importStatus === 'error' ? 'Err' : 'Import'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button onClick={handleSave} className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
