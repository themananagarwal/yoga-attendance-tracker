import { useAttendanceStore } from '../lib/store';
import { IndianRupee } from 'lucide-react';

interface MonthlySummaryProps {
    currentDate: Date;
}

export function MonthlySummary({ currentDate }: MonthlySummaryProps) {
    const { getMonthSummary } = useAttendanceStore();
    const summary = getMonthSummary(currentDate.getFullYear(), currentDate.getMonth());

    return (
        <div className="bg-surface/50 backdrop-blur-sm border border-secondary/10 rounded-2xl p-6 mt-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-muted uppercase tracking-wider">
                    Monthly Report
                </h3>
                <span className="text-xs font-medium text-muted/70">
                    {summary.days} Sessions
                </span>
            </div>

            <div className="flex items-baseline justify-between">
                <div className="flex flex-col">
                    <span className="text-4xl font-extrabold text-primary tracking-tight flex items-center gap-1">
                        <IndianRupee size={28} className="text-muted/50" strokeWidth={2.5} />
                        {summary.total.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-success font-bold mt-1 uppercase tracking-wider">
                        Payable Amount
                    </span>
                </div>

                {/* Abstract Chart/Visual */}
                <div className="flex gap-1 items-end h-10">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 rounded-full transition-all duration-500 ${i < (summary.days % 10) || summary.days >= 10
                                    ? 'bg-accent'
                                    : 'bg-secondary/10'
                                }`}
                            style={{ height: `${Math.random() * 40 + 40}%` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
