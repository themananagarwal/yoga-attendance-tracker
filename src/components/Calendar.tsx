import { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAttendanceStore } from '../lib/store';
import { AnimatePresence, motion } from 'framer-motion';

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
                    <div key={day} className="text-[10px] font-medium text-muted uppercase tracking-wider py-2">
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
                                "relative group flex flex-col items-center justify-center p-2 rounded-xl h-20 sm:h-24 transition-all border border-transparent",
                                !isCurrentMonth && "opacity-30",
                                isToday(day) && "bg-white/5 border-white/10",
                                "hover:bg-white/5"
                            )}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: isCurrentMonth ? 1 : 0.3, scale: 1 }}
                            transition={{ delay: idx * 0.005 }}
                        >
                            <span className={cn(
                                "text-sm font-medium mb-1",
                                isToday(day) ? "text-accent" : "text-primary"
                            )}>
                                {format(day, 'd')}
                            </span>

                            {/* Attendance Indicator */}
                            <div className="h-6 flex items-center justify-center">
                                {isAttended ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center"
                                    >
                                        <Check size={14} strokeWidth={3} />
                                    </motion.div>
                                ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/5 group-hover:bg-white/20 transition-colors" />
                                )}
                            </div>

                            {/* Note Indicator */}
                            {record?.note && (
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent" />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
