import { useAttendanceStore } from '../lib/store';
import { IndianRupee } from 'lucide-react';

interface MonthlySummaryProps {
    currentDate: Date;
}

export function MonthlySummary({ currentDate }: MonthlySummaryProps) {
    const { getMonthSummary } = useAttendanceStore();
    const summary = getMonthSummary(currentDate.getFullYear(), currentDate.getMonth());

    return (
        <div className="bg-surface border border-white/5 rounded-2xl p-6 mt-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted uppercase tracking-wider">
                    Monthly Report
                </h3>
                <span className="text-xs text-muted/50">
                    {summary.days} Sessions
                </span>
            </div>

            <div className="flex items-baseline justify-between">
                <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white tracking-tight flex items-center gap-1">
                        <IndianRupee size={24} className="text-muted" />
                        {summary.total.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-success font-medium mt-1">
                        Payable Amount
                    </span>
                </div>

                {/* Abstract Chart/Visual */}
                <div className="flex gap-0.5 items-end h-8">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 rounded-t-sm ${i < (summary.days % 10) || summary.days >= 10 ? 'bg-accent' : 'bg-white/5'}`}
                            style={{ height: `${Math.random() * 50 + 50}%` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
