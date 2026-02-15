import { useState } from 'react';
import { Settings, CheckCircle2 } from 'lucide-react';
import { Calendar } from './components/Calendar';
import { MonthlySummary } from './components/MonthlySummary';
import { EditDayModal } from './components/EditDayModal';
import { SettingsModal } from './components/SettingsModal';
import { useAttendanceStore } from './lib/store';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { checkInToday, getRecord } = useAttendanceStore();
  const todayRecord = getRecord(new Date());
  const isCheckedIn = todayRecord?.status === 'attended';

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-accent/20 pb-24 sm:pb-10">

      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Yoga Tracker</h1>
          <p className="text-xs text-muted uppercase tracking-widest mt-1">Personal Dashboard</p>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-muted hover:text-white"
        >
          <Settings size={20} />
        </button>
      </header>

      <main className="max-w-md mx-auto px-4 space-y-2">
        <Calendar
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onDayClick={setSelectedDate}
        />

        <MonthlySummary currentDate={currentDate} />

        {/* Local Storage Indicator */}
        <p className="text-[10px] text-center text-muted/30 mt-8">
          Data stored locally on this device.
        </p>
      </main>

      {/* Floating Check-in Button (Mobile Sticky) */}
      <div className="fixed bottom-6 left-0 w-full px-6 flex justify-center pointer-events-none z-40">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={checkInToday}
          disabled={isCheckedIn}
          className={`pointer-events-auto w-full max-w-sm py-4 rounded-2xl font-bold text-lg shadow-xl backdrop-blur-md border border-white/10 flex items-center justify-center gap-3 transition-all duration-500
                ${isCheckedIn
              ? 'bg-surface/90 text-success cursor-default'
              : 'bg-white text-black hover:bg-gray-100'
            }`}
        >
          {isCheckedIn ? (
            <>
              <CheckCircle2 size={24} className="animate-in zoom-in spin-in-90 duration-300" />
              <span>Checked In</span>
            </>
          ) : (
            <>
              <span>Check In Today</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedDate && (
          <EditDayModal date={selectedDate} onClose={() => setSelectedDate(null)} />
        )}
        {isSettingsOpen && (
          <SettingsModal onClose={() => setIsSettingsOpen(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
