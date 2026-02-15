
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,

    isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAttendanceStore } from '../lib/store';
import { motion } from 'framer-motion';

interface CalendarProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
    onDayClick: (date: Date) => void;
}

export function Calendar({ currentDate, onDateChange, onDayClick }: CalendarProps) {
    const { records } = useAttendanceStore();

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-primary">
                    {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-1">
                    <button
                        onClick={() => onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => onDateChange(new Date())}
                        className="px-3 py-1 text-xs font-medium border border-white/10 rounded-full hover:bg-white/5 transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
                {weekDays.map(day => (
                    <div key={day} className="text-[10px] font-bold text-muted uppercase tracking-wider py-3">
                        {day}
                    </div>
                ))}

                {days.map((day, idx) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const record = records[dateKey];
                    const isAttended = record?.status === 'attended';
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    return (
                        <motion.button
                            key={day.toISOString()}
                            onClick={() => onDayClick(day)}
                            className={cn(
                                "relative group flex flex-col items-center justify-start pt-2 rounded-xl h-20 sm:h-24 transition-all duration-200 border",
                                // Base Styles
                                isCurrentMonth ? "opacity-100" : "opacity-30",
                                // Border Styling (Visible Grid)
                                "border-secondary/20 hover:border-secondary/50",
                                // Status Styling
                                isAttended
                                    ? "bg-success/10 border-success/30 shadow-sm"
                                    : "bg-surface hover:bg-white/50",
                                // Today Styling
                                isToday(day) && "ring-2 ring-accent ring-offset-2 ring-offset-background z-10"
                            )}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: isCurrentMonth ? 1 : 0.3, scale: 1 }}
                            transition={{ delay: idx * 0.005 }}
                        >
                            <span className={cn(
                                "text-sm font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full",
                                isToday(day) ? "bg-accent text-white" : "text-primary",
                                isAttended && !isToday(day) && "text-success"
                            )}>
                                {format(day, 'd')}
                            </span>

                            {/* Attendance Indicator (Big Checkmark) */}
                            <div className="flex-1 flex items-center justify-center w-full">
                                {isAttended ? (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center shadow-sm"
                                    >
                                        <Check size={18} strokeWidth={4} />
                                    </motion.div>
                                ) : (
                                    // Empty state placeholder on hover
                                    <div className="w-2 h-2 rounded-full bg-secondary/10 group-hover:bg-secondary/30 transition-colors" />
                                )}
                            </div>

                            {/* Note Indicator */}
                            {record?.note && (
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent ring-2 ring-surface" />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
