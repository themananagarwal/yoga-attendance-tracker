import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

export type AttendanceStatus = 'attended' | 'unattended';

export interface AttendanceRecord {
    date: string; // YYYY-MM-DD
    status: AttendanceStatus;
    note?: string;
}

interface AttendanceStore {
    records: Record<string, AttendanceRecord>; // Keyed by date string for O(1) access
    dailyRate: number;

    // Actions
    toggleAttendance: (date: Date) => void;
    setNote: (date: Date, note: string) => void;
    setDailyRate: (rate: number) => void;
    checkInToday: () => void;

    // Computed (helper)
    getRecord: (date: Date) => AttendanceRecord | undefined;
    getMonthSummary: (year: number, month: number) => { days: number; total: number };

    // Data Management
    importData: (json: string) => boolean;
    exportData: () => string;
}

export const useAttendanceStore = create<AttendanceStore>()(
    persist(
        (set, get) => ({
            records: {},
            dailyRate: 500, // Default value

            toggleAttendance: (date: Date) => {
                const dateKey = format(date, 'yyyy-MM-dd');
                set((state) => {
                    const current = state.records[dateKey];
                    const newRecords = { ...state.records };

                    if (current?.status === 'attended') {
                        newRecords[dateKey] = { ...current, status: 'unattended' };
                        // Optional: delete if unattended and no note? Keep for history if note exists.
                    } else {
                        newRecords[dateKey] = {
                            date: dateKey,
                            status: 'attended',
                            note: current?.note || ''
                        };
                    }
                    return { records: newRecords };
                });
            },

            setNote: (date: Date, note: string) => {
                const dateKey = format(date, 'yyyy-MM-dd');
                set((state) => {
                    const current = state.records[dateKey] || { date: dateKey, status: 'unattended' };
                    return {
                        records: {
                            ...state.records,
                            [dateKey]: { ...current, note }
                        }
                    };
                });
            },

            setDailyRate: (rate: number) => set({ dailyRate: rate }),

            checkInToday: () => {
                const today = new Date();
                const dateKey = format(today, 'yyyy-MM-dd');
                const current = get().records[dateKey];

                if (current?.status === 'attended') return; // Idempotent

                set((state) => ({
                    records: {
                        ...state.records,
                        [dateKey]: {
                            date: dateKey,
                            status: 'attended',
                            note: current?.note || ''
                        }
                    }
                }));
            },

            getRecord: (date: Date) => {
                const dateKey = format(date, 'yyyy-MM-dd');
                return get().records[dateKey];
            },

            getMonthSummary: (year: number, month: number) => {
                const { records, dailyRate } = get();
                // month is 0-indexed (0 = Jan)
                // Filter records that match YYYY-MM
                // Alternatively, iterate all records? If scale is small, iteration is fine.
                // Or construct keys? Iteration is safer for now.

                // Let's iterate values.
                const count = Object.values(records).filter(r => {
                    if (r.status !== 'attended') return false;
                    const d = new Date(r.date);
                    return d.getFullYear() === year && d.getMonth() === month;
                }).length;

                return { days: count, total: count * dailyRate };
            },

            exportData: () => JSON.stringify(get().records),

            importData: (json: string) => {
                try {
                    const parsed = JSON.parse(json);
                    // Basic validation
                    if (typeof parsed !== 'object') return false;
                    set({ records: parsed });
                    return true;
                } catch (e) {
                    return false;
                }
            }

        }),
        {
            name: 'yoga-attendance-storage',
        }
    )
);
