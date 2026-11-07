import React, { useState } from 'react';
import { Workout } from '../types/swim';
import { calculateWorkoutYardage, formatDisplayDate } from '../utils/swimCalculators';

interface PrintWorkoutModalProps {
  workout: Workout;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintWorkoutModal: React.FC<PrintWorkoutModalProps> = ({ workout, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalYardage = calculateWorkoutYardage(workout);

  const workoutPlainText = [
    `🏊‍♂️ LANELEADER PRO - SWIM WORKOUT`,
    `Date: ${formatDisplayDate(workout.date)}`,
    `Session: ${workout.title}`,
    workout.description ? `Focus: ${workout.description}` : '',
    `Total Volume: ${totalYardage.toLocaleString()} ${workout.poolCourse || 'SCY'}`,
    `----------------------------------------`,
    ...workout.sets.map((s, idx) => {
      const intervalText = s.interval ? ` @ ${s.interval}` : '';
      const notesText = s.notes ? ` (${s.notes})` : '';
      return `${idx + 1}. ${s.reps} x ${s.distance} ${s.stroke}${intervalText}${notesText}`;
    }),
    `----------------------------------------`,
    workout.completed && workout.feedback ? `Swimmer Feedback: ${workout.feedback}` : ''
  ].filter(Boolean).join('\n');

  const handleCopyText = () => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(workoutPlainText);
      } else {
        const ta = document.createElement('textarea');
        ta.value = workoutPlainText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Pool-Deck Card & Export</h3>
              <p className="text-[11px] text-slate-400">Printable waterproof format & text share</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Printable Waterproof Card Look */}
        <div className="my-5 p-5 bg-white text-slate-900 rounded-xl shadow-lg font-sans border-2 border-slate-300">
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-2 mb-3">
            <div>
              <h4 className="font-black text-base uppercase tracking-tight text-cyan-900">{workout.title}</h4>
              <p className="text-xs text-slate-600 font-semibold">{formatDisplayDate(workout.date)}</p>
            </div>
            <div className="text-right font-mono font-bold text-sm bg-cyan-100 text-cyan-950 px-2 py-0.5 rounded border border-cyan-300">
              {totalYardage.toLocaleString()} {workout.poolCourse || 'SCY'}
            </div>
          </div>

          {workout.description && (
            <p className="text-xs italic text-slate-700 mb-3 bg-slate-100 p-2 rounded">
              🎯 {workout.description}
            </p>
          )}

          <div className="space-y-1.5 font-mono text-xs">
            {workout.sets.map((s, idx) => (
              <div key={s.id} className="flex items-baseline justify-between border-b border-slate-200 pb-1">
                <div>
                  <span className="font-bold text-cyan-800 mr-2">#{idx + 1}</span>
                  <span className="font-black">{s.reps} x {s.distance}</span>{' '}
                  <span className="font-bold">{s.stroke}</span>
                  {s.notes && <span className="text-[11px] text-slate-600 font-sans italic ml-1">({s.notes})</span>}
                </div>
                {s.interval && (
                  <span className="font-bold text-slate-700 bg-slate-100 px-1 rounded text-[11px]">
                    @ {s.interval}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleCopyText}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
            }`}
          >
            <span>{copied ? '✓ Copied Text!' : '📋 Copy Text'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold rounded-xl transition shadow-md shadow-cyan-900/30"
            >
              🖨️ Print Card
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
