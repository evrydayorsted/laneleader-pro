import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User, InviteCode, SwimSet, Workout, StrokeType } from './types/swim';
import {
  loadLocal,
  saveLocal,
  DEFAULT_COACH,
  DEFAULT_SWIMMER_1,
  DEFAULT_SWIMMER_2,
  DEFAULT_INVITES,
  DEFAULT_WORKOUTS
} from './utils/storage';
import {
  formatDateKey,
  formatDisplayDate,
  calculateWorkoutYardage,
  calculatePacePer100,
  estimateWorkoutDurationMinutes
} from './utils/swimCalculators';
import { PrintWorkoutModal } from './components/PrintWorkoutModal';

// Toggle to re-enable the one-click demo profile buttons on the login screen for debugging.
const SHOW_DEMO_PROFILES = false;

// Bulletproof SVG Icons Dictionary with strict types
interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const Icons = {
  Waves: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  ),
  Users: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  UserPlus: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  ),
  Calendar: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Award: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Key: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <path d="m21 2-2 2m-1.5 1.5L16 7l4 4-1.5 1.5M15 8l-8 8.5a4 4 0 1 1-2-2L13.5 6" />
      <circle cx="7" cy="17" r="2" />
    </svg>
  ),
  Clock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 14 14" />
    </svg>
  ),
  Check: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  CheckCircle: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Trash: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  Plus: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  ChevronLeft: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  ChevronDown: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  X: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Copy: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  LogOut: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Activity: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  BookOpen: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-5 h-5"}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
};

export default function App() {
  // --- Persistent Storage State ---
  const [users, setUsers] = useState<User[]>(() =>
    loadLocal<User[]>('users', [DEFAULT_COACH, DEFAULT_SWIMMER_1, DEFAULT_SWIMMER_2])
  );
  const [invites, setInvites] = useState<InviteCode[]>(() =>
    loadLocal<InviteCode[]>('invites', DEFAULT_INVITES)
  );
  const [workouts, setWorkouts] = useState<Workout[]>(() =>
    loadLocal<Workout[]>('workouts', DEFAULT_WORKOUTS)
  );
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadLocal<User | null>('session_user', null)
  );

  // Sync to local storage
  useEffect(() => saveLocal('users', users), [users]);
  useEffect(() => saveLocal('invites', invites), [invites]);
  useEffect(() => saveLocal('workouts', workouts), [workouts]);
  useEffect(() => saveLocal('session_user', currentUser), [currentUser]);

  // --- Auth Screen State ---
  const [isSignUp, setIsSignUp] = useState(false);
  const [authRole, setAuthRole] = useState<'coach' | 'swimmer'>('coach');
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    inviteCode: ''
  });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // --- Coach Roster & Selection State ---
  const [selectedSwimmerId, setSelectedSwimmerId] = useState<string | null>(null);
  const [rosterSearch, setRosterSearch] = useState('');
  const [mobileViewTab, setMobileViewTab] = useState<'roster' | 'calendar'>('roster');

  // --- Modals State ---
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newlyGeneratedCode, setNewlyGeneratedCode] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printWorkout, setPrintWorkout] = useState<Workout | null>(null);

  // --- Calendar & Workout Selection State ---
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => formatDateKey(new Date()));
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  // --- Workout Editor / Prescription State ---
  const [workoutForm, setWorkoutForm] = useState<{
    title: string;
    description: string;
    dayType: 'workout' | 'meet' | 'rest' | 'recovery';
    poolCourse: 'SCY' | 'SCM' | 'LCM';
    sets: SwimSet[];
    coachReview: string;
  }>({
    title: 'Main Training Session',
    description: '',
    dayType: 'workout',
    poolCourse: 'SCY',
    sets: [
      { id: 's_' + Date.now(), reps: 4, distance: 100, stroke: 'Freestyle', interval: '1:30', notes: '', category: 'Main Set' }
    ],
    coachReview: ''
  });

  // Swimmer feedback log fields
  const [swimmerLogTimes, setSwimmerLogTimes] = useState<Record<string, string>>({});
  const [swimmerLogNotes, setSwimmerLogNotes] = useState<Record<string, string>>({});
  const [swimmerRpe, setSwimmerRpe] = useState<number>(7);
  const [swimmerFeedback, setSwimmerFeedback] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('');

  // User menu dropdown
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter swimmers belonging to the active coach
  const coachSwimmers = useMemo(() => {
    if (!currentUser || currentUser.role !== 'coach') return [];
    return users.filter(u => u.role === 'swimmer' && u.coachId === currentUser.id);
  }, [users, currentUser]);

  const filteredSwimmers = useMemo(() => {
    if (!rosterSearch.trim()) return coachSwimmers;
    const q = rosterSearch.toLowerCase();
    return coachSwimmers.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  }, [coachSwimmers, rosterSearch]);

  // Set initial selected swimmer for coach
  useEffect(() => {
    if (currentUser?.role === 'coach' && !selectedSwimmerId && coachSwimmers.length > 0) {
      setSelectedSwimmerId(coachSwimmers[0].id);
    }
  }, [currentUser, coachSwimmers, selectedSwimmerId]);

  // Active swimmer object
  const activeSwimmer = useMemo<User | null>(() => {
    if (currentUser?.role === 'swimmer') return currentUser;
    return users.find(u => u.id === selectedSwimmerId) || null;
  }, [currentUser, selectedSwimmerId, users]);

  const targetSwimmerId = currentUser?.role === 'swimmer' ? currentUser.id : selectedSwimmerId;

  // Active workout for currently selected date and swimmer
  const activeWorkout = useMemo<Workout | null>(() => {
    if (!targetSwimmerId || !selectedDateStr) return null;
    return workouts.find(w => w.swimmerId === targetSwimmerId && w.date === selectedDateStr) || null;
  }, [workouts, targetSwimmerId, selectedDateStr]);

  // Synchronize workout modal whenever selected date or active workout changes
  useEffect(() => {
    if (activeWorkout) {
      setWorkoutForm({
        title: activeWorkout.title || '',
        description: activeWorkout.description || '',
        dayType: activeWorkout.dayType || 'workout',
        poolCourse: activeWorkout.poolCourse || 'SCY',
        coachReview: activeWorkout.coachReview || '',
        sets: activeWorkout.sets && activeWorkout.sets.length > 0
          ? activeWorkout.sets
          : [{ id: 's_' + Date.now(), reps: 4, distance: 100, stroke: 'Freestyle', interval: '1:30', notes: '', category: 'Main Set' }]
      });

      const initialTimes: Record<string, string> = {};
      const initialNotes: Record<string, string> = {};
      (activeWorkout.sets || []).forEach(s => {
        initialTimes[s.id] = s.completedTime || '';
        initialNotes[s.id] = s.swimmerNotes || '';
      });
      setSwimmerLogTimes(initialTimes);
      setSwimmerLogNotes(initialNotes);
      setSwimmerRpe(activeWorkout.rpe || 7);
      setSwimmerFeedback(activeWorkout.feedback || '');
    } else {
      setWorkoutForm({
        title: 'Aerobic & Technique Training',
        description: '',
        dayType: 'workout',
        poolCourse: 'SCY',
        coachReview: '',
        sets: [
          { id: 's_' + Date.now(), reps: 4, distance: 100, stroke: 'Freestyle', interval: '1:30', notes: 'Descend 1-4', category: 'Main Set' }
        ]
      });
      setSwimmerLogTimes({});
      setSwimmerLogNotes({});
      setSwimmerRpe(7);
      setSwimmerFeedback('');
    }
    setSaveStatus('');
  }, [activeWorkout, showWorkoutModal]);

  // ==========================================
  // AUTHENTICATION HANDLERS
  // ==========================================
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const emailClean = (authForm.email || '').trim().toLowerCase();
    const passwordClean = (authForm.password || '').trim();

    if (!emailClean || !passwordClean) {
      setAuthError('Please enter both email and password.');
      return;
    }

    if (isSignUp) {
      if (!authForm.name.trim()) {
        setAuthError('Please enter your full name.');
        return;
      }

      const existing = users.find(u => u.email.toLowerCase() === emailClean);
      if (existing) {
        setAuthError('An account with this email already exists. Please log in.');
        return;
      }

      let matchedCoachId: string | null = null;

      if (authRole === 'swimmer') {
        const codeInput = (authForm.inviteCode || '').trim().toUpperCase();
        if (!codeInput) {
          setAuthError('Please enter the 6-character Invite Code provided by your coach.');
          return;
        }

        const validInvite = invites.find(inv => inv.code.toUpperCase() === codeInput);
        if (!validInvite) {
          setAuthError('Invalid Invite Code. Please check with your coach.');
          return;
        }
        matchedCoachId = validInvite.coachId;

        // Consume invite code
        setInvites(prev => prev.filter(inv => inv.id !== validInvite.id));
      }

      const newUser: User = {
        id: (authRole === 'coach' ? 'coach_' : 'swimmer_') + Date.now(),
        name: authForm.name.trim(),
        email: emailClean,
        password: passwordClean,
        role: authRole,
        coachId: matchedCoachId,
        createdAt: new Date().toISOString()
      };

      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setAuthSuccess('Account registered successfully!');
    } else {
      const foundUser = users.find(u => u.email.toLowerCase() === emailClean && u.password === passwordClean);
      if (!foundUser) {
        setAuthError('Invalid email or password. Please try again.');
        return;
      }
      setCurrentUser(foundUser);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedSwimmerId(null);
    setShowWorkoutModal(false);
    setShowInviteModal(false);
    setShowPrintModal(false);
    setUserMenuOpen(false);
    setAuthForm({ name: '', email: '', password: '', inviteCode: '' });
    setAuthError('');
    setAuthSuccess('');
  };

  const handleQuickLogin = (role: 'coach' | 'swimmer', swimmerId?: string) => {
    if (role === 'coach') {
      const coach = users.find(u => u.role === 'coach') || DEFAULT_COACH;
      setCurrentUser(coach);
      setSelectedSwimmerId(coachSwimmers[0]?.id || DEFAULT_SWIMMER_1.id);
    } else {
      const targetId = swimmerId || DEFAULT_SWIMMER_1.id;
      const swimmer = users.find(u => u.id === targetId) || DEFAULT_SWIMMER_1;
      setCurrentUser(swimmer);
    }
    setMobileViewTab('calendar');
  };

  // ==========================================
  // COACH INVITE CODE GENERATOR
  // ==========================================
  const generateNewInviteCode = () => {
    if (!currentUser) return;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newInvite: InviteCode = {
      id: 'inv_' + Date.now(),
      code,
      coachId: currentUser.id,
      coachName: currentUser.name,
      createdAt: new Date().toISOString()
    };

    setInvites(prev => [newInvite, ...prev]);
    setNewlyGeneratedCode(code);
    setCopiedNotification(false);
  };

  const copyToClipboard = (code: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          setCopiedNotification(true);
          setTimeout(() => setCopiedNotification(false), 2500);
        }).catch(() => fallbackCopy(code));
      } else {
        fallbackCopy(code);
      }
    } catch {
      fallbackCopy(code);
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    } catch (err) {
      console.warn('Manual copy needed:', err);
    }
  };

  // ==========================================
  // COACH WORKOUT PRESCRIBER HANDLERS
  // ==========================================
  const handleAddSet = () => {
    setWorkoutForm(prev => ({
      ...prev,
      sets: [
        ...prev.sets,
        {
          id: 's_' + Date.now(),
          reps: 4,
          distance: 100,
          stroke: 'Freestyle',
          interval: '1:30',
          notes: '',
          category: 'Main Set'
        }
      ]
    }));
  };

  const handleUpdateSet = (setId: string, field: keyof SwimSet, val: string | number) => {
    setWorkoutForm(prev => ({
      ...prev,
      sets: prev.sets.map(s => (s.id === setId ? { ...s, [field]: val } : s))
    }));
  };

  const handleRemoveSet = (setId: string) => {
    setWorkoutForm(prev => ({
      ...prev,
      sets: prev.sets.length > 1 ? prev.sets.filter(s => s.id !== setId) : prev.sets
    }));
  };

  const handleSaveWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSwimmerId || !selectedDateStr || !currentUser) return;

    const updatedWorkout: Workout = {
      id: activeWorkout ? activeWorkout.id : 'w_' + Date.now(),
      swimmerId: targetSwimmerId,
      coachId: currentUser.role === 'coach' ? currentUser.id : (activeSwimmer?.coachId || ''),
      date: selectedDateStr,
      title: workoutForm.title.trim() || 'Prescribed Swim Session',
      description: workoutForm.description.trim(),
      dayType: workoutForm.dayType,
      poolCourse: workoutForm.poolCourse,
      sets: workoutForm.sets.map(s => ({
        ...s,
        reps: Math.max(1, Number(s.reps) || 1),
        distance: Math.max(0, Number(s.distance) || 0),
        // Retain any existing swimmer splits
        completedTime: activeWorkout ? (activeWorkout.sets?.find(x => x.id === s.id)?.completedTime || '') : '',
        swimmerNotes: activeWorkout ? (activeWorkout.sets?.find(x => x.id === s.id)?.swimmerNotes || '') : ''
      })),
      completed: activeWorkout?.completed || false,
      rpe: activeWorkout?.rpe || null,
      feedback: activeWorkout?.feedback || '',
      coachReview: workoutForm.coachReview.trim(),
      updatedAt: new Date().toISOString()
    };

    setWorkouts(prev => {
      const filtered = prev.filter(w => !(w.swimmerId === targetSwimmerId && w.date === selectedDateStr));
      return [...filtered, updatedWorkout];
    });

    setSaveStatus('Workout prescribed successfully!');
    setTimeout(() => {
      setShowWorkoutModal(false);
      setSaveStatus('');
    }, 800);
  };

  const handleDeleteWorkout = () => {
    if (!activeWorkout) return;
    setWorkouts(prev => prev.filter(w => w.id !== activeWorkout.id));
    setShowWorkoutModal(false);
  };

  // ==========================================
  // SWIMMER FEEDBACK & TIME LOGGING HANDLERS
  // ==========================================
  const handleSaveSwimmerFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkout) return;

    const updatedSets = (activeWorkout.sets || []).map(s => ({
      ...s,
      completedTime: swimmerLogTimes[s.id] !== undefined ? swimmerLogTimes[s.id] : (s.completedTime || ''),
      swimmerNotes: swimmerLogNotes[s.id] !== undefined ? swimmerLogNotes[s.id] : (s.swimmerNotes || '')
    }));

    const updatedWorkout: Workout = {
      ...activeWorkout,
      sets: updatedSets,
      rpe: Number(swimmerRpe),
      feedback: swimmerFeedback.trim(),
      completed: true,
      completedAt: new Date().toISOString()
    };

    setWorkouts(prev => prev.map(w => (w.id === activeWorkout.id ? updatedWorkout : w)));
    setSaveStatus('Great effort! Your workout splits & feedback have been logged.');
    setTimeout(() => {
      setShowWorkoutModal(false);
      setSaveStatus('');
    }, 1100);
  };

  // ==========================================
  // CALENDAR COMPUTATION HELPERS
  // ==========================================
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
    const totalDays = lastDay.getDate();

    const days = [];

    // Blank prefix cells
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ dayNumber: null, dateStr: null, isCurrentMonth: false, isToday: false });
    }

    // Days in active month
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = formatDateKey(dateObj);
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === formatDateKey(new Date())
      });
    }

    return days;
  }, [currentMonthDate]);

  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelectDay = (dateStr: string | null) => {
    if (!dateStr) return;
    setSelectedDateStr(dateStr);
    setShowWorkoutModal(true);
  };

  // ==========================================
  // RENDER: AUTHENTICATION SCREEN
  // ==========================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-sky-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative z-10">
          {/* Header */}
          <div className="p-6 text-center border-b border-slate-800 bg-gradient-to-b from-slate-800/50 to-transparent">
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center space-x-2">
              <span>Fitzswimming</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Swim Coaching App
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Role Selector Tabs (Only on Sign Up) */}
            {isSignUp && (
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthRole('coach');
                      setAuthError('');
                    }}
                    className={`py-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                      authRole === 'coach'
                        ? 'bg-gradient-to-r from-cyan-600 to-sky-600 border-cyan-400 text-white shadow-lg shadow-cyan-900/30'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icons.Award className="w-5 h-5 mb-1" />
                    <span className="font-bold text-xs">Swim Coach</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthRole('swimmer');
                      setAuthError('');
                    }}
                    className={`py-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                      authRole === 'swimmer'
                        ? 'bg-gradient-to-r from-cyan-600 to-sky-600 border-cyan-400 text-white shadow-lg shadow-cyan-900/30'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icons.Waves className="w-5 h-5 mb-1" />
                    <span className="font-bold text-xs">Swimmer</span>
                  </button>
                </div>
              </div>
            )}

            {authError && (
              <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-center space-x-2">
                <Icons.X className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center space-x-2">
                <Icons.CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{authSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder={authRole === 'coach' ? 'e.g., Coach Collin' : 'e.g., Thor S'}
                    value={authForm.name}
                    onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="coach@example.com"
                  value={authForm.email}
                  onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                />
              </div>

              {isSignUp && authRole === 'swimmer' && (
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold uppercase text-cyan-300 flex items-center">
                      <Icons.Key className="w-3.5 h-3.5 mr-1" />
                      Coach Invite Code
                    </label>
                    <span className="text-[10px] text-slate-400">Required</span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="e.g. SWIM99"
                    value={authForm.inviteCode}
                    onChange={e => setAuthForm({ ...authForm, inviteCode: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 bg-cyan-950/40 border border-cyan-500/50 rounded-xl text-cyan-200 font-mono tracking-widest text-center text-lg placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Ask your coach for their 6-character code (demo code: <span className="font-mono text-cyan-300">SWIM99</span>).</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-3 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-500/20 transition transform active:scale-[0.99] text-sm"
              >
                {isSignUp ? (authRole === 'coach' ? 'Create Coach Account' : 'Register Swimmer Account') : 'Sign In to Fitzswimming'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition font-medium"
              >
                {isSignUp ? 'Already registered? Sign In' : "Don't have an account yet? Register"}
              </button>
            </div>

            {/* Quick Demo Switcher */}
            {SHOW_DEMO_PROFILES && (
              <div className="mt-6 pt-5 border-t border-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                  Instant 1-Click Demo Profiles
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('coach')}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-xl border border-slate-700 transition flex items-center justify-center space-x-1.5"
                  >
                    <Icons.Award className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Coach Collin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('swimmer', DEFAULT_SWIMMER_1.id)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-xl border border-slate-700 transition flex items-center justify-center space-x-1.5"
                  >
                    <Icons.Waves className="w-3.5 h-3.5 text-sky-400" />
                    <span>Swimmer Thor</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: MAIN AUTHENTICATED APP
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg font-black tracking-tight text-white">Fitzswimming</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 uppercase">
              {currentUser.role}
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* User Profile Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] uppercase font-bold text-cyan-400 capitalize">{currentUser.role}</div>
                </div>
                <Icons.ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-[11px] text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Role: {currentUser.role}
                    </span>
                  </div>

                  <div className="p-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-lg flex items-center space-x-2 transition"
                    >
                      <Icons.LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentUser.role === 'coach' ? (
          // ==========================================
          // COACH VIEW: ROSTER + CALENDAR PRESCRIPTION
          // ==========================================
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Mobile Tab Switcher */}
            <div className="lg:hidden col-span-1 flex rounded-xl bg-slate-900 border border-slate-800 p-1">
              <button
                type="button"
                onClick={() => setMobileViewTab('roster')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  mobileViewTab === 'roster' ? 'bg-cyan-600 text-slate-950' : 'text-slate-400'
                }`}
              >
                Swimmer Roster ({coachSwimmers.length})
              </button>
              <button
                type="button"
                onClick={() => setMobileViewTab('calendar')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  mobileViewTab === 'calendar' ? 'bg-cyan-600 text-slate-950' : 'text-slate-400'
                }`}
              >
                Calendar & Workouts
              </button>
            </div>

            {/* Left: Swimmer Roster */}
            <div className={`lg:col-span-4 space-y-4 ${mobileViewTab === 'calendar' ? 'hidden lg:block' : 'block'}`}>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icons.Users className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-base font-bold text-white">Swimmer Roster</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteModal(true);
                      setCopiedNotification(false);
                      if (invites.length === 0) generateNewInviteCode();
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold transition"
                  >
                    <Icons.Key className="w-3.5 h-3.5" />
                    <span>Invite</span>
                  </button>
                </div>

                {/* Search Swimmer input */}
                {coachSwimmers.length > 0 && (
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Search swimmer by name..."
                      value={rosterSearch}
                      onChange={e => setRosterSearch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                )}

                {coachSwimmers.length === 0 ? (
                  <div className="text-center py-8 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/50">
                    <Icons.UserPlus className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">No Swimmers Linked</p>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      Generate an invite code and give it to your swimmers to link their accounts!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowInviteModal(true);
                        generateNewInviteCode();
                      }}
                      className="inline-flex items-center space-x-1 px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition"
                    >
                      <Icons.Plus className="w-3.5 h-3.5" />
                      <span>Generate Invite Code</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredSwimmers.map(swimmer => {
                      const isSelected = selectedSwimmerId === swimmer.id;
                      const swimmerWorkouts = workouts.filter(w => w.swimmerId === swimmer.id);
                      const completedCount = swimmerWorkouts.filter(w => w.completed).length;

                      return (
                        <div
                          key={swimmer.id}
                          className={`p-3 rounded-xl border transition flex items-center justify-between group ${
                            isSelected
                              ? 'bg-gradient-to-r from-cyan-950/80 to-sky-950/80 border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                              : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSwimmerId(swimmer.id);
                              setMobileViewTab('calendar');
                            }}
                            className="flex items-center space-x-3 truncate text-left flex-1"
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                                isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-cyan-300'
                              }`}
                            >
                              {swimmer.name.charAt(0)}
                            </div>
                            <div className="truncate">
                              <h3 className="text-sm font-bold text-white truncate">{swimmer.name}</h3>
                              <p className="text-xs text-slate-400 truncate">{swimmer.email}</p>
                            </div>
                          </button>

                          <div className="ml-2">
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-cyan-300 font-mono">
                              {completedCount} done
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Right: Calendar & Workout Manager for Selected Swimmer */}
            <div className={`lg:col-span-8 ${mobileViewTab === 'roster' ? 'hidden lg:block' : 'block'}`}>
              {activeSwimmer ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
                  {/* Swimmer Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                          Prescribing Workouts For:
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                        {activeSwimmer.name}
                      </h2>
                      <p className="text-xs text-slate-400">{activeSwimmer.email}</p>
                    </div>
                  </div>

                  {/* Calendar Navigation */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <Icons.Calendar className="w-5 h-5 text-cyan-400" />
                      <span>{monthName}</span>
                    </h3>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                      >
                        <Icons.ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                      >
                        <Icons.ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="text-center py-1.5 text-xs font-bold uppercase text-slate-500">
                        {d}
                      </div>
                    ))}

                    {calendarDays.map((cd, idx) => {
                      if (!cd.isCurrentMonth || !cd.dateStr) {
                        return <div key={`empty_${idx}`} className="h-20 sm:h-24 bg-slate-950/30 rounded-xl" />;
                      }

                      const dayWorkout = workouts.find(w => w.swimmerId === activeSwimmer.id && w.date === cd.dateStr);
                      const isSelected = selectedDateStr === cd.dateStr;

                      return (
                        <button
                          key={cd.dateStr}
                          type="button"
                          onClick={() => handleSelectDay(cd.dateStr)}
                          className={`h-20 sm:h-24 p-1.5 sm:p-2 rounded-xl text-left border flex flex-col justify-between transition-all relative overflow-hidden group ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400/50'
                              : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span
                              className={`text-xs font-bold ${
                                cd.isToday
                                  ? 'px-1.5 py-0.5 rounded-md bg-cyan-500 text-slate-950 font-black'
                                  : 'text-slate-300'
                              }`}
                            >
                              {cd.dayNumber}
                            </span>
                            {dayWorkout?.completed && (
                              <Icons.CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            )}
                          </div>

                          {dayWorkout ? (
                            <div className="w-full truncate">
                              <span
                                className={`text-[10px] font-semibold block truncate px-1.5 py-0.5 rounded ${
                                  dayWorkout.completed
                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                                    : 'bg-sky-950/80 text-sky-300 border border-sky-800/40'
                                }`}
                              >
                                {dayWorkout.title}
                              </span>
                              <span className="text-[9px] text-slate-400 block truncate mt-0.5 font-mono">
                                {calculateWorkoutYardage(dayWorkout)} yds
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition">
                              + prescribe
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                  <Icons.Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-200">Select a Swimmer</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Pick any swimmer from your roster on the left to inspect their schedule, prescribe sets, and view logged splits.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // ==========================================
          // SWIMMER VIEW: CALENDAR & SPLIT LOGGING
          // ==========================================
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Swimmer Dashboard</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-0.5">
                    {currentUser.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {currentUser.coachId
                      ? `Coached by ${users.find(u => u.id === currentUser.coachId)?.name || 'Apex Coach'}`
                      : 'Independent Training'}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Tap any day to view & record splits</span>
                  </span>
                </div>
              </div>

              {/* Swimmer Calendar Navigation */}
              <div className="flex items-center justify-between my-4">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Icons.Calendar className="w-5 h-5 text-cyan-400" />
                  <span>{monthName}</span>
                </h3>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                  >
                    <Icons.ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                  >
                    <Icons.ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Swimmer Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center py-1.5 text-xs font-bold uppercase text-slate-500">
                    {d}
                  </div>
                ))}

                {calendarDays.map((cd, idx) => {
                  if (!cd.isCurrentMonth || !cd.dateStr) {
                    return <div key={`swimmer_empty_${idx}`} className="h-24 bg-slate-950/30 rounded-xl" />;
                  }

                  const dayWorkout = workouts.find(w => w.swimmerId === currentUser.id && w.date === cd.dateStr);
                  const isSelected = selectedDateStr === cd.dateStr;

                  return (
                    <button
                      key={cd.dateStr}
                      type="button"
                      onClick={() => handleSelectDay(cd.dateStr)}
                      className={`h-24 p-2 rounded-xl text-left border flex flex-col justify-between transition relative overflow-hidden ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400/50'
                          : dayWorkout
                            ? 'border-sky-800/70 bg-sky-950/30 hover:border-cyan-500'
                            : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`text-xs font-bold ${
                            cd.isToday
                              ? 'px-1.5 py-0.5 rounded-md bg-cyan-500 text-slate-950 font-black'
                              : 'text-slate-300'
                          }`}
                        >
                          {cd.dayNumber}
                        </span>
                        {dayWorkout?.completed && (
                          <Icons.CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        )}
                      </div>

                      {dayWorkout ? (
                        <div className="w-full">
                          <span
                            className={`text-[10px] font-semibold block truncate px-1.5 py-0.5 rounded ${
                              dayWorkout.completed
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                                : 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                            }`}
                          >
                            {dayWorkout.title}
                          </span>
                          <span className="text-[9px] text-slate-400 block truncate mt-0.5">
                            {dayWorkout.completed ? '✓ Logged' : 'Prescribed'} • {calculateWorkoutYardage(dayWorkout)}y
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600">Rest Day</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==========================================
          MODAL: COACH INVITE CODE GENERATOR
         ========================================== */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Icons.Key className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Manage Swimmer Invites</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <p className="text-xs text-slate-300">
                Generate a unique 6-character registration code. When a swimmer creates an account and enters this code, they are automatically linked to your roster.
              </p>

              {newlyGeneratedCode && (
                <div className="p-4 bg-cyan-950/40 border border-cyan-500/50 rounded-xl space-y-2">
                  <span className="text-xs font-semibold text-cyan-300 uppercase">Newly Generated Code</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={newlyGeneratedCode}
                      className="w-full px-3 py-2 bg-slate-950 border border-cyan-500/60 rounded-lg text-cyan-200 font-mono tracking-widest text-center text-lg font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(newlyGeneratedCode)}
                      className={`px-3 py-2 rounded-lg font-semibold text-xs flex items-center space-x-1 transition ${
                        copiedNotification
                          ? 'bg-emerald-600 text-white'
                          : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                      }`}
                    >
                      {copiedNotification ? <Icons.Check className="w-4 h-4" /> : <Icons.Copy className="w-4 h-4" />}
                      <span>{copiedNotification ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={generateNewInviteCode}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Generate New Code
              </button>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-2">
                  Active Pending Codes ({invites.filter(i => i.coachId === currentUser.id).length})
                </span>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {invites.filter(i => i.coachId === currentUser.id).length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No active codes. Click generate above.</p>
                  ) : (
                    invites
                      .filter(i => i.coachId === currentUser.id)
                      .map(inv => (
                        <div
                          key={inv.id}
                          className="flex items-center justify-between p-2 bg-slate-800/60 rounded-lg border border-slate-700 text-xs"
                        >
                          <span className="font-mono text-cyan-300 font-bold tracking-wider">{inv.code}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(inv.code)}
                              className="text-slate-300 hover:text-white p-1"
                              title="Copy code"
                            >
                              <Icons.Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setInvites(prev => prev.filter(x => x.id !== inv.id))}
                              className="text-rose-400 hover:text-rose-300 p-1"
                              title="Delete code"
                            >
                              <Icons.Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: WORKOUT PRESCRIBER & SWIMMER LOGGING
         ========================================== */}
      {showWorkoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 sm:p-6 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {currentUser.role === 'coach' ? `Prescription for ${activeSwimmer?.name || 'Swimmer'}` : 'Swimmer Workout Log'}
                </span>
                <h3 className="text-lg font-black text-white">
                  {formatDisplayDate(selectedDateStr)}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                {activeWorkout && (
                  <button
                    type="button"
                    onClick={() => {
                      setPrintWorkout(activeWorkout);
                      setShowPrintModal(true);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 flex items-center space-x-1"
                  >
                    <span>Pool-Deck Card</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowWorkoutModal(false)}
                  className="text-slate-400 hover:text-white transition p-1"
                >
                  <Icons.X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {saveStatus && (
              <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs font-semibold flex items-center space-x-2">
                <Icons.CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{saveStatus}</span>
              </div>
            )}

            {/* COACH PRESCRIBING INTERFACE */}
            {currentUser.role === 'coach' ? (
              <form onSubmit={handleSaveWorkout} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Session Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Threshold Free & Stroke Aerobic"
                      value={workoutForm.title}
                      onChange={e => setWorkoutForm({ ...workoutForm, title: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Pool Course</label>
                    <select
                      value={workoutForm.poolCourse}
                      onChange={e => setWorkoutForm({ ...workoutForm, poolCourse: e.target.value as 'SCY' | 'SCM' | 'LCM' })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold"
                    >
                      <option value="SCY">SCY (Short Course Yards)</option>
                      <option value="SCM">SCM (Short Course Meters)</option>
                      <option value="LCM">LCM (Long Course Meters)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Session Objectives & Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Descend stroke counts, hold steady elbow catch, fast breakouts on wall turns."
                    value={workoutForm.description}
                    onChange={e => setWorkoutForm({ ...workoutForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {/* Sets Builder */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Prescribed Sets ({workoutForm.sets.length})
                    </label>
                    <div className="flex items-center space-x-3 text-xs font-mono">
                      <span className="text-cyan-400 font-bold">
                        {workoutForm.sets.reduce((sum, s) => sum + ((Number(s.reps) || 0) * (Number(s.distance) || 0)), 0)} {workoutForm.poolCourse === 'SCY' ? 'yds' : 'm'}
                      </span>
                      <span className="text-slate-400">
                        ~{estimateWorkoutDurationMinutes(workoutForm.sets)} min
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {workoutForm.sets.map((set, idx) => (
                      <div key={set.id} className="p-3 bg-slate-800/70 border border-slate-700 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-cyan-400">Set #{idx + 1}</span>
                          {workoutForm.sets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSet(set.id)}
                              className="text-rose-400 hover:text-rose-300 text-xs p-1"
                              title="Delete set"
                            >
                              <Icons.Trash className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {/* Reps */}
                          <div>
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">Reps</label>
                            <input
                              type="number"
                              min={1}
                              step={1}
                              value={set.reps}
                              onChange={e => handleUpdateSet(set.id, 'reps', Math.max(1, Number(e.target.value)))}
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-semibold text-center"
                            />
                          </div>

                          {/* Distance: min=0 step=1 allows any number like 25, 50, 75, 100, 200, 400 */}
                          <div>
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">Distance (yds/m)</label>
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={set.distance}
                              onChange={e => handleUpdateSet(set.id, 'distance', Math.max(0, Number(e.target.value)))}
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-semibold text-center"
                            />
                          </div>

                          {/* Stroke */}
                          <div>
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">Stroke</label>
                            <select
                              value={set.stroke}
                              onChange={e => handleUpdateSet(set.id, 'stroke', e.target.value as StrokeType)}
                              className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-semibold"
                            >
                              <option value="Freestyle">Freestyle</option>
                              <option value="Backstroke">Backstroke</option>
                              <option value="Breaststroke">Breaststroke</option>
                              <option value="Butterfly">Butterfly</option>
                              <option value="IM">Individual Medley</option>
                              <option value="Choice">Choice</option>
                              <option value="Kick">Kick</option>
                              <option value="Pull">Pull</option>
                              <option value="Drill">Drill</option>
                            </select>
                          </div>

                          {/* Interval */}
                          <div>
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">Interval</label>
                            <input
                              type="text"
                              placeholder="e.g. 1:30"
                              value={set.interval || ''}
                              onChange={e => handleUpdateSet(set.id, 'interval', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs text-center font-mono"
                            />
                          </div>
                        </div>

                        {/* Set instructions */}
                        <div>
                          <input
                            type="text"
                            placeholder="Set instructions / pacing (e.g. Descend 1-4, max effort turns)"
                            value={set.notes || ''}
                            onChange={e => handleUpdateSet(set.id, 'notes', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-900/60 border border-slate-700/80 rounded-lg text-slate-300 text-xs"
                          />
                        </div>

                        {/* Swimmer's Logged Split Times (Coach Inspection View) */}
                        {activeWorkout && (set.completedTime || set.swimmerNotes) && (
                          <div className="mt-2 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs space-y-1">
                            <span className="font-bold text-cyan-300">Swimmer Logged Split:</span>
                            {set.completedTime && (
                              <div className="text-white font-mono font-bold flex items-center space-x-2">
                                <span>{set.completedTime}</span>
                                {set.distance > 0 && calculatePacePer100(set.distance, set.completedTime) && (
                                  <span className="text-[10px] text-slate-400">
                                    (Avg pace: {calculatePacePer100(set.distance, set.completedTime)}/100)
                                  </span>
                                )}
                              </div>
                            )}
                            {set.swimmerNotes && <div className="text-slate-300 italic">"{set.swimmerNotes}"</div>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSet}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-dashed border-slate-600 rounded-xl text-xs font-semibold text-cyan-300 flex items-center justify-center space-x-1.5 transition"
                  >
                    <Icons.Plus className="w-3.5 h-3.5" />
                    <span>Add Set</span>
                  </button>
                </div>

                {/* Swimmer Completion & Feedback Overview */}
                {activeWorkout?.completed && (
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 uppercase flex items-center space-x-1">
                        <Icons.CheckCircle className="w-3.5 h-3.5" />
                        <span>Workout Completed by Swimmer</span>
                      </span>
                      {activeWorkout.rpe && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-900 text-emerald-200">
                          Exertion RPE: {activeWorkout.rpe}/10
                        </span>
                      )}
                    </div>
                    {activeWorkout.feedback && (
                      <p className="text-xs text-slate-200 italic bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                        "{activeWorkout.feedback}"
                      </p>
                    )}
                  </div>
                )}

                {/* Coach Feedback Note to Swimmer */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-cyan-300 mb-1">
                    Coach Response / Technical Guidance
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Great pace control on the 100s Thor! Tomorrow focus on dolphin kick breakouts."
                    value={workoutForm.coachReview}
                    onChange={e => setWorkoutForm({ ...workoutForm, coachReview: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {/* Modal Footer Controls */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  {activeWorkout ? (
                    <button
                      type="button"
                      onClick={handleDeleteWorkout}
                      className="px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-lg transition flex items-center space-x-1"
                    >
                      <Icons.Trash className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  ) : <div />}

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowWorkoutModal(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-900/30 transition"
                    >
                      Save Prescription
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              // ==========================================
              // SWIMMER LOGGING INTERFACE
              // ==========================================
              <div className="mt-5 space-y-5">
                {!activeWorkout ? (
                  <div className="text-center py-10 bg-slate-950/50 rounded-xl border border-slate-800">
                    <Icons.Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <h4 className="text-sm font-semibold text-slate-300">No Workout Prescribed for this Date</h4>
                    <p className="text-xs text-slate-500 mt-1">Enjoy your rest day or check with your coach!</p>
                  </div>
                ) : (
                  <form onSubmit={handleSaveSwimmerFeedback} className="space-y-4">
                    {/* Prescribed Summary Card */}
                    <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-white">{activeWorkout.title}</h4>
                        <span className="text-xs font-mono text-cyan-300 font-bold">
                          {calculateWorkoutYardage(activeWorkout)} {activeWorkout.poolCourse || 'SCY'} Total
                        </span>
                      </div>
                      {activeWorkout.description && (
                        <p className="text-xs text-slate-300 mt-1">{activeWorkout.description}</p>
                      )}
                      {activeWorkout.coachReview && (
                        <div className="mt-2 p-2 bg-cyan-950/50 border border-cyan-700/40 rounded-lg text-xs text-cyan-200">
                          <span className="font-bold">Coach Note:</span> {activeWorkout.coachReview}
                        </div>
                      )}
                    </div>

                    {/* Sets Logging Table */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Prescribed Sets & Recorded Splits
                        </label>
                      </div>

                      {activeWorkout.sets.map((set, idx) => (
                        <div key={set.id} className="p-3.5 bg-slate-800/50 border border-slate-700 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-cyan-300">
                              Set #{idx + 1}: {set.reps} x {set.distance} {set.stroke}
                            </span>
                            {set.interval && (
                              <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded">
                                @ {set.interval}
                              </span>
                            )}
                          </div>

                          {set.notes && (
                            <p className="text-xs text-slate-400 italic">Coach note: {set.notes}</p>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                                Recorded Time / Split
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 1:04, 1:06, 1:05"
                                value={swimmerLogTimes[set.id] || ''}
                                onChange={e => setSwimmerLogTimes({ ...swimmerLogTimes, [set.id]: e.target.value })}
                                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:ring-1 focus:ring-cyan-400"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                                Set Notes / Stroke Count
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Held 14 strokes per 25"
                                value={swimmerLogNotes[set.id] || ''}
                                onChange={e => setSwimmerLogNotes({ ...swimmerLogNotes, [set.id]: e.target.value })}
                                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-cyan-400"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* RPE Exertion Slider */}
                    <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase text-slate-300">
                          Rate of Perceived Exertion (RPE)
                        </label>
                        <span
                          className={`text-sm font-bold font-mono px-2 py-0.5 rounded ${
                            swimmerRpe >= 8
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : swimmerRpe >= 5
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          }`}
                        >
                          {swimmerRpe} / 10
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={swimmerRpe}
                        onChange={e => setSwimmerRpe(Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                        <span>1 (Easy Warmup)</span>
                        <span>5 (Moderate Pace)</span>
                        <span>10 (Race Max Effort)</span>
                      </div>
                    </div>

                    {/* Post-Workout Comments */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                        Post-Workout Notes for Coach
                      </label>
                      <textarea
                        rows={3}
                        placeholder="How did your shoulders feel? Did you hit your interval targets?"
                        value={swimmerFeedback}
                        onChange={e => setSwimmerFeedback(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowWorkoutModal(false)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-900/30 transition flex items-center space-x-1.5"
                      >
                        <Icons.Check className="w-4 h-4" />
                        <span>Submit Workout Log</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pool-Deck Print Card Modal */}
      {printWorkout && (
        <PrintWorkoutModal
          workout={printWorkout}
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
        />
      )}

    </div>
  );
}