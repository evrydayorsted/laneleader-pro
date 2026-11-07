import React, { useState, useEffect, useMemo, useRef } from 'react';

// ==========================================
// 1. INLINE SVG ICONS (Bulletproof - Zero External Icon Dependency Crashes)
// ==========================================
const SvgIcon = ({ path, className = "w-5 h-5", ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className} 
    {...props}
  >
    {path}
  </svg>
);

const Icons = {
  Users: (props) => <SvgIcon {...props} path={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
  UserPlus: (props) => <SvgIcon {...props} path={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></>} />,
  Plus: (props) => <SvgIcon {...props} path={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />,
  Trash: (props) => <SvgIcon {...props} path={<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></>} />,
  Calendar: (props) => <SvgIcon {...props} path={<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />,
  ChevronLeft: (props) => <SvgIcon {...props} path={<polyline points="15 18 9 12 15 6"/>} />,
  ChevronRight: (props) => <SvgIcon {...props} path={<polyline points="9 18 15 12 9 6"/>} />,
  Clock: (props) => <SvgIcon {...props} path={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></>} />,
  Check: (props) => <SvgIcon {...props} path={<polyline points="20 6 9 17 4 12"/>} />,
  CheckCircle: (props) => <SvgIcon {...props} path={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>} />,
  X: (props) => <SvgIcon {...props} path={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />,
  Award: (props) => <SvgIcon {...props} path={<><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>} />,
  Copy: (props) => <SvgIcon {...props} path={<><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>} />,
  Key: (props) => <SvgIcon {...props} path={<><path d="m21 2-2 2m-1.5 1.5L16 7l4 4-1.5 1.5M15 8l-8 8.5a4 4 0 1 1-2-2L13.5 6"/><circle cx="7" cy="17" r="2"/></>} />,
  LogOut: (props) => <SvgIcon {...props} path={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />,
  Waves: (props) => <SvgIcon {...props} path={<><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></>} />,
  Edit3: (props) => <SvgIcon {...props} path={<><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>} />,
  Activity: (props) => <SvgIcon {...props} path={<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>} />,
  ChevronDown: (props) => <SvgIcon {...props} path={<polyline points="6 9 12 15 18 9"/>} />
};

// ==========================================
// 2. LOCAL PERSISTENCE LAYER (Safe, Fast, Always Works)
// ==========================================
const STORAGE_PREFIX = "laneleader_data_";
const loadLocal = (key, fallback) => {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.warn("Storage read error:", e);
    return fallback;
  }
};

const saveLocal = (key, data) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn("Storage write error:", e);
  }
};

// Initial seed data for effortless out-of-the-box demo
const DEFAULT_COACH = {
  id: "coach_collin",
  name: "Collin F",
  email: "collin@coach.com",
  role: "coach",
  password: "password123"
};

const DEFAULT_SWIMMER = {
  id: "swimmer_thor",
  name: "Thor S",
  email: "thor@swimmer.com",
  role: "swimmer",
  password: "password123",
  coachId: "coach_collin"
};

const DEFAULT_INVITES = [
  { id: "inv_1", code: "SWIM99", coachId: "coach_collin", coachName: "Collin F", createdAt: new Date().toISOString() }
];

const DEFAULT_WORKOUTS = [
  {
    id: "w_seed_1",
    swimmerId: "swimmer_thor",
    coachId: "coach_collin",
    date: new Date().toISOString().split("T")[0],
    title: "Threshold Free & Stroke Aerobic",
    description: "Focus on holding steady stroke count across the 100s.",
    sets: [
      { id: "s1", reps: 1, distance: 400, stroke: "Freestyle", interval: "6:00", notes: "Warmup swim, relaxed breathing", completedTime: "5:22", swimmerNotes: "Smooth pace" },
      { id: "s2", reps: 4, distance: 100, stroke: "Freestyle", interval: "1:30", notes: "Hold descending pace 1-4", completedTime: "1:08, 1:07, 1:06, 1:04", swimmerNotes: "Felt strong on the last 100" },
      { id: "s3", reps: 8, distance: 50, stroke: "Choice", interval: "0:55", notes: "Stroke technique drill / swim", completedTime: "36s avg", swimmerNotes: "Worked on high elbow catch" }
    ],
    completed: true,
    rpe: 8,
    feedback: "High quality set! Arms felt heavy on the final 50s but kept stroke rate up.",
    completedAt: new Date().toISOString()
  }
];

// Helper to format date strings YYYY-MM-DD safely
const formatDateKey = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ==========================================
// 3. MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  // --- Persistent Global State ---
  const [users, setUsers] = useState(() => loadLocal("users", [DEFAULT_COACH, DEFAULT_SWIMMER]));
  const [invites, setInvites] = useState(() => loadLocal("invites", DEFAULT_INVITES));
  const [workouts, setWorkouts] = useState(() => loadLocal("workouts", DEFAULT_WORKOUTS));
  const [currentUser, setCurrentUser] = useState(() => loadLocal("session_user", null));

  // Sync to local storage on changes
  useEffect(() => saveLocal("users", users), [users]);
  useEffect(() => saveLocal("invites", invites), [invites]);
  useEffect(() => saveLocal("workouts", workouts), [workouts]);
  useEffect(() => saveLocal("session_user", currentUser), [currentUser]);

  // --- Auth Screen State ---
  const [isSignUp, setIsSignUp] = useState(false);
  const [authRole, setAuthRole] = useState("coach"); // 'coach' | 'swimmer'
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    inviteCode: ""
  });
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // --- Coach View State ---
  const [selectedSwimmerId, setSelectedSwimmerId] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newlyGeneratedCode, setNewlyGeneratedCode] = useState("");
  const [copiedNotification, setCopiedNotification] = useState(false);

  // --- Calendar & Workout Selection State ---
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => formatDateKey(new Date()));
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  // --- Workout Editor / Logging State ---
  const [workoutForm, setWorkoutForm] = useState({
    title: "",
    description: "",
    sets: [
      { id: "s_" + Date.now(), reps: 4, distance: 100, stroke: "Freestyle", interval: "1:30", notes: "" }
    ]
  });

  // Swimmer feedback log fields
  const [swimmerLogTimes, setSwimmerLogTimes] = useState({});
  const [swimmerLogNotes, setSwimmerLogNotes] = useState({});
  const [swimmerRpe, setSwimmerRpe] = useState(7);
  const [swimmerFeedback, setSwimmerFeedback] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  // Top user menu dropdown
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Swimmers Linked to Active Coach ---
  const coachSwimmers = useMemo(() => {
    if (!currentUser || currentUser.role !== "coach") return [];
    return users.filter(u => u.role === "swimmer" && u.coachId === currentUser.id);
  }, [users, currentUser]);

  // Selected swimmer profile (when Coach views a swimmer)
  const activeSwimmer = useMemo(() => {
    if (currentUser?.role === "swimmer") return currentUser;
    return users.find(u => u.id === selectedSwimmerId) || null;
  }, [currentUser, selectedSwimmerId, users]);

  // Target Swimmer ID for Workouts & Calendar View
  const targetSwimmerId = currentUser?.role === "swimmer" ? currentUser?.id : selectedSwimmerId;

  // Active workout for the selected date & swimmer
  const activeWorkout = useMemo(() => {
    if (!targetSwimmerId || !selectedDateStr) return null;
    return workouts.find(w => w.swimmerId === targetSwimmerId && w.date === selectedDateStr) || null;
  }, [workouts, targetSwimmerId, selectedDateStr]);

  // Synchronize workout modal fields whenever active workout changes
  useEffect(() => {
    if (activeWorkout) {
      setWorkoutForm({
        title: activeWorkout.title || "",
        description: activeWorkout.description || "",
        sets: activeWorkout.sets && activeWorkout.sets.length > 0 ? activeWorkout.sets : [
          { id: "s_" + Date.now(), reps: 4, distance: 100, stroke: "Freestyle", interval: "1:30", notes: "" }
        ]
      });
      // Hydrate swimmer inputs
      const initialTimes = {};
      const initialNotes = {};
      (activeWorkout.sets || []).forEach(s => {
        initialTimes[s.id] = s.completedTime || "";
        initialNotes[s.id] = s.swimmerNotes || "";
      });
      setSwimmerLogTimes(initialTimes);
      setSwimmerLogNotes(initialNotes);
      setSwimmerRpe(activeWorkout.rpe || 7);
      setSwimmerFeedback(activeWorkout.feedback || "");
    } else {
      // Default blank workout
      setWorkoutForm({
        title: "Main Training Session",
        description: "",
        sets: [
          { id: "s_" + Date.now(), reps: 4, distance: 100, stroke: "Freestyle", interval: "1:30", notes: "" }
        ]
      });
      setSwimmerLogTimes({});
      setSwimmerLogNotes({});
      setSwimmerRpe(7);
      setSwimmerFeedback("");
    }
    setSaveStatus("");
  }, [activeWorkout, showWorkoutModal]);

  // ==========================================
  // AUTHENTICATION LOGIC
  // ==========================================
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    const emailClean = (authForm.email || "").trim().toLowerCase();
    const passwordClean = (authForm.password || "").trim();

    if (!emailClean || !passwordClean) {
      setAuthError("Please enter both email and password.");
      return;
    }

    if (isSignUp) {
      if (!authForm.name.trim()) {
        setAuthError("Please enter your full name.");
        return;
      }

      // Check if user already exists
      const existing = users.find(u => u.email.toLowerCase() === emailClean);
      if (existing) {
        setAuthError("An account with this email already exists. Please log in.");
        return;
      }

      let matchedCoachId = null;

      // Swimmer must provide a valid invite code
      if (authRole === "swimmer") {
        const codeInput = (authForm.inviteCode || "").trim().toUpperCase();
        if (!codeInput) {
          setAuthError("Please enter the 6-character Invite Code provided by your coach.");
          return;
        }

        const validInvite = invites.find(inv => inv.code.toUpperCase() === codeInput);
        if (!validInvite) {
          setAuthError("Invalid Invite Code. Please verify the code with your coach.");
          return;
        }
        matchedCoachId = validInvite.coachId;

        // Consume/remove invite after use
        setInvites(prev => prev.filter(inv => inv.id !== validInvite.id));
      }

      const newUser = {
        id: (authRole === "coach" ? "coach_" : "swimmer_") + Date.now(),
        name: authForm.name.trim(),
        email: emailClean,
        password: passwordClean,
        role: authRole,
        coachId: matchedCoachId,
        createdAt: new Date().toISOString()
      };

      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setAuthSuccess("Account created successfully!");
    } else {
      // Log In
      const foundUser = users.find(u => u.email.toLowerCase() === emailClean && u.password === passwordClean);
      if (!foundUser) {
        setAuthError("Invalid email or password. Please try again.");
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
    setUserMenuOpen(false);
    setAuthForm({ name: "", email: "", password: "", inviteCode: "" });
    setAuthError("");
    setAuthSuccess("");
  };

  // Switch demo account conveniently
  const handleQuickLogin = (role) => {
    if (role === "coach") {
      const coach = users.find(u => u.role === "coach") || DEFAULT_COACH;
      setCurrentUser(coach);
    } else {
      const swimmer = users.find(u => u.role === "swimmer") || DEFAULT_SWIMMER;
      setCurrentUser(swimmer);
    }
  };

  // ==========================================
  // COACH INVITE MANAGEMENT
  // ==========================================
  const generateNewInviteCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newInvite = {
      id: "inv_" + Date.now(),
      code,
      coachId: currentUser.id,
      coachName: currentUser.name,
      createdAt: new Date().toISOString()
    };

    setInvites(prev => [newInvite, ...prev]);
    setNewlyGeneratedCode(code);
    setCopiedNotification(false);
  };

  const copyToClipboard = (code) => {
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

  const fallbackCopy = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    } catch (err) {
      console.warn("Manual copy required:", err);
    }
  };

  // ==========================================
  // WORKOUT PRESCRIBER (Coach Actions)
  // ==========================================
  const handleAddSet = () => {
    setWorkoutForm(prev => ({
      ...prev,
      sets: [
        ...prev.sets,
        {
          id: "s_" + Date.now(),
          reps: 4,
          distance: 100,
          stroke: "Freestyle",
          interval: "1:30",
          notes: ""
        }
      ]
    }));
  };

  const handleUpdateSet = (setId, field, val) => {
    setWorkoutForm(prev => ({
      ...prev,
      sets: prev.sets.map(s => s.id === setId ? { ...s, [field]: val } : s)
    }));
  };

  const handleRemoveSet = (setId) => {
    setWorkoutForm(prev => ({
      ...prev,
      sets: prev.sets.length > 1 ? prev.sets.filter(s => s.id !== setId) : prev.sets
    }));
  };

  const handleSaveWorkout = (e) => {
    e.preventDefault();
    if (!targetSwimmerId || !selectedDateStr) return;

    const updatedWorkout = {
      id: activeWorkout ? activeWorkout.id : ("w_" + Date.now()),
      swimmerId: targetSwimmerId,
      coachId: currentUser.role === "coach" ? currentUser.id : (activeSwimmer?.coachId || ""),
      date: selectedDateStr,
      title: workoutForm.title.trim() || "Prescribed Swim Session",
      description: workoutForm.description.trim(),
      sets: workoutForm.sets.map(s => ({
        ...s,
        reps: Number(s.reps) || 1,
        distance: Number(s.distance) || 0,
        // Preserve any previously logged times
        completedTime: activeWorkout ? (activeWorkout.sets?.find(x => x.id === s.id)?.completedTime || "") : "",
        swimmerNotes: activeWorkout ? (activeWorkout.sets?.find(x => x.id === s.id)?.swimmerNotes || "") : ""
      })),
      completed: activeWorkout?.completed || false,
      rpe: activeWorkout?.rpe || null,
      feedback: activeWorkout?.feedback || "",
      updatedAt: new Date().toISOString()
    };

    setWorkouts(prev => {
      const filtered = prev.filter(w => !(w.swimmerId === targetSwimmerId && w.date === selectedDateStr));
      return [...filtered, updatedWorkout];
    });

    setSaveStatus("Workout saved successfully!");
    setTimeout(() => {
      setShowWorkoutModal(false);
      setSaveStatus("");
    }, 900);
  };

  const handleDeleteWorkout = () => {
    if (!activeWorkout) return;
    setWorkouts(prev => prev.filter(w => w.id !== activeWorkout.id));
    setShowWorkoutModal(false);
  };

  // ==========================================
  // SWIMMER FEEDBACK & TIME LOGGING
  // ==========================================
  const handleSaveSwimmerFeedback = (e) => {
    e.preventDefault();
    if (!activeWorkout) return;

    // Merge completed splits into the workout's sets
    const updatedSets = (activeWorkout.sets || []).map(s => ({
      ...s,
      completedTime: swimmerLogTimes[s.id] !== undefined ? swimmerLogTimes[s.id] : (s.completedTime || ""),
      swimmerNotes: swimmerLogNotes[s.id] !== undefined ? swimmerLogNotes[s.id] : (s.swimmerNotes || "")
    }));

    const updatedWorkout = {
      ...activeWorkout,
      sets: updatedSets,
      rpe: Number(swimmerRpe),
      feedback: swimmerFeedback.trim(),
      completed: true,
      completedAt: new Date().toISOString()
    };

    setWorkouts(prev => prev.map(w => w.id === activeWorkout.id ? updatedWorkout : w));
    setSaveStatus("Great job! Your splits and feedback were logged.");
    setTimeout(() => {
      setShowWorkoutModal(false);
      setSaveStatus("");
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

    // Empty lead slots
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ dayNumber: null, dateStr: null, isCurrentMonth: false });
    }

    // Month days
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

  const handleSelectDay = (dateStr) => {
    if (!dateStr) return;
    setSelectedDateStr(dateStr);
    setShowWorkoutModal(true);
  };

  // Calculate total workout distance for summary
  const getWorkoutSummaryYardage = (workout) => {
    if (!workout || !workout.sets) return 0;
    return workout.sets.reduce((sum, s) => sum + ((Number(s.reps) || 0) * (Number(s.distance) || 0)), 0);
  };

  // ==========================================
  // RENDER: AUTHENTICATION SCREEN
  // ==========================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-cyan-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-md rounded-2xl border border-sky-800/50 shadow-2xl overflow-hidden">
          {/* Header Banner */}
          <div className="p-6 text-center border-b border-sky-800/40 bg-gradient-to-r from-sky-900/60 to-cyan-900/60">
            <div className="inline-flex p-3 bg-cyan-500/20 rounded-2xl text-cyan-400 mb-3 ring-1 ring-cyan-400/40">
              <Icons.Waves className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">LaneLeader</h1>
            <p className="text-sm text-cyan-200/80 font-medium mt-1">Elite Swim Workout Prescriptions & Logging</p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Role Selector Tabs (Only on Sign Up) */}
            {isSignUp && (
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">I am registering as a</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { setAuthRole("coach"); setAuthError(""); }}
                    className={`py-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      authRole === "coach"
                        ? "bg-gradient-to-r from-sky-600 to-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-900/40"
                        : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Icons.Award className="w-5 h-5 mb-1" />
                    <span className="font-semibold text-sm">Swim Coach</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthRole("swimmer"); setAuthError(""); }}
                    className={`py-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      authRole === "swimmer"
                        ? "bg-gradient-to-r from-sky-600 to-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-900/40"
                        : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Icons.Waves className="w-5 h-5 mb-1" />
                    <span className="font-semibold text-sm">Swimmer</span>
                  </button>
                </div>
              </div>
            )}

            {authError && (
              <div className="mb-4 p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-sm flex items-start space-x-2">
                <Icons.X className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-sm flex items-start space-x-2">
                <Icons.CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                <span>{authSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder={authRole === "coach" ? "e.g., Coach Collin" : "e.g., Thor S"}
                    value={authForm.name}
                    onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={authForm.email}
                  onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
              </div>

              {isSignUp && authRole === "swimmer" && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase text-cyan-300 flex items-center">
                      <Icons.Key className="w-3.5 h-3.5 mr-1" />
                      Coach Invite Code
                    </label>
                    <span className="text-[11px] text-slate-400">Required</span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="e.g., SWIM99"
                    value={authForm.inviteCode}
                    onChange={e => setAuthForm({ ...authForm, inviteCode: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 bg-cyan-950/40 border border-cyan-500/50 rounded-xl text-cyan-200 font-mono tracking-widest text-center text-lg placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Ask your coach for their 6-character registration key.</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition duration-150 transform active:scale-[0.99]"
              >
                {isSignUp ? (authRole === "coach" ? "Create Coach Account" : "Register as Swimmer") : "Log In to LaneLeader"}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError("");
                  setAuthSuccess("");
                }}
                className="text-sm text-cyan-300 hover:text-cyan-200 transition font-medium"
              >
                {isSignUp ? "Already have an account? Log In" : "Don't have an account yet? Sign Up"}
              </button>
            </div>

            {/* Quick-Switch Demo Accounts for Easy Testing */}
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
                Instant Demo Access
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("coach")}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg border border-slate-700 transition flex items-center justify-center space-x-1"
                >
                  <Icons.Award className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Coach Collin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("swimmer")}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg border border-slate-700 transition flex items-center justify-center space-x-1"
                >
                  <Icons.Waves className="w-3.5 h-3.5 text-sky-400" />
                  <span>Swimmer Thor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: AUTHENTICATED APPLICATION
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-600 to-sky-500 rounded-xl text-white shadow-md shadow-cyan-900/30">
              <Icons.Waves className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center">
                LaneLeader
                <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 uppercase">
                  Pro
                </span>
              </span>
              <p className="text-xs text-slate-400 hidden sm:block">Swim Training Prescription & Feedback System</p>
            </div>
          </div>

          {/* User Profile & Logout Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                {(currentUser.name || "U").charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[10px] uppercase font-bold text-cyan-400 capitalize">{currentUser.role}</div>
              </div>
              <Icons.ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-rose-400 hover:bg-rose-950/40 flex items-center space-x-2 transition"
                >
                  <Icons.LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentUser.role === "coach" ? (
          // ==========================================
          // COACH VIEW: ROSTER + WORKOUT CALENDAR
          // ==========================================
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Swimmer Roster & Invites Sidebar */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
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
                    <span>Invite Swimmer</span>
                  </button>
                </div>

                {coachSwimmers.length === 0 ? (
                  <div className="text-center py-8 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/50">
                    <Icons.UserPlus className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-300">No swimmers linked yet</p>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Generate an invite code and share it with your swimmers to link their accounts.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowInviteModal(true);
                        generateNewInviteCode();
                      }}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs transition"
                    >
                      <Icons.Plus className="w-3.5 h-3.5" />
                      <span>Generate Invite Code</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {coachSwimmers.map(swimmer => {
                      const isSelected = selectedSwimmerId === swimmer.id;
                      const swimmerWorkouts = workouts.filter(w => w.swimmerId === swimmer.id);
                      const completedCount = swimmerWorkouts.filter(w => w.completed).length;

                      return (
                        <button
                          key={swimmer.id}
                          type="button"
                          onClick={() => setSelectedSwimmerId(swimmer.id)}
                          className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                            isSelected
                              ? "bg-gradient-to-r from-cyan-950/80 to-sky-950/80 border-cyan-500/60 shadow-lg shadow-cyan-950/40"
                              : "bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center space-x-3 truncate">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                              isSelected ? "bg-cyan-500 text-slate-950" : "bg-slate-700 text-cyan-300"
                            }`}>
                              {swimmer.name.charAt(0)}
                            </div>
                            <div className="truncate">
                              <h3 className="text-sm font-semibold text-white truncate">{swimmer.name}</h3>
                              <p className="text-xs text-slate-400 truncate">{swimmer.email}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-cyan-300 font-medium">
                              {completedCount} done
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Info Box */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-xs text-slate-400 space-y-2">
                <h4 className="font-semibold text-slate-200 flex items-center space-x-1.5">
                  <Icons.Activity className="w-4 h-4 text-cyan-400" />
                  <span>Coach Instructions</span>
                </h4>
                <p>1. Select any swimmer above to load their personal calendar.</p>
                <p>2. Click any calendar date to prescribe a workout (e.g., 4 x 100 Free on 1:30).</p>
                <p>3. Once the swimmer logs their workout, inspect their splits, RPE scale, and feedback directly here.</p>
              </div>
            </div>

            {/* Right: Calendar & Workout Manager for Selected Swimmer */}
            <div className="lg:col-span-8">
              {activeSwimmer ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
                  {/* Swimmer Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Prescribing Workouts For:</span>
                      </div>
                      <h2 className="text-xl font-black text-white mt-0.5">{activeSwimmer.name}</h2>
                      <p className="text-xs text-slate-400">{activeSwimmer.email}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDateStr(formatDateKey(new Date()));
                          setShowWorkoutModal(true);
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-900/40 transition"
                      >
                        <Icons.Plus className="w-4 h-4" />
                        <span>Prescribe Today</span>
                      </button>
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
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                      <div key={d} className="text-center py-1.5 text-xs font-bold uppercase text-slate-500">
                        {d}
                      </div>
                    ))}

                    {calendarDays.map((cd, idx) => {
                      if (!cd.isCurrentMonth) {
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
                              ? "border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400/50"
                              : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className={`text-xs font-bold ${
                              cd.isToday ? "px-1.5 py-0.5 rounded-md bg-cyan-500 text-slate-950" : "text-slate-300"
                            }`}>
                              {cd.dayNumber}
                            </span>
                            {dayWorkout?.completed && (
                              <Icons.CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            )}
                          </div>

                          {dayWorkout ? (
                            <div className="w-full truncate">
                              <span className={`text-[10px] font-semibold block truncate px-1.5 py-0.5 rounded ${
                                dayWorkout.completed
                                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/40"
                                  : "bg-sky-950/80 text-sky-300 border border-sky-800/40"
                              }`}>
                                {dayWorkout.title}
                              </span>
                              <span className="text-[9px] text-slate-400 block truncate mt-0.5 font-mono">
                                {getWorkoutSummaryYardage(dayWorkout)}y
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition">
                              + add
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
                  <h3 className="text-lg font-bold text-slate-200">Select a Swimmer to Begin</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                    Choose any swimmer from your roster on the left to review their calendar, prescribe daily swim sets, and inspect completed times.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // ==========================================
          // SWIMMER VIEW: CALENDAR & LOGGING
          // ==========================================
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Welcome Back, Swimmer</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-0.5">{currentUser.name}</h2>
                  <p className="text-xs text-slate-400">
                    {currentUser.coachId 
                      ? `Coached by ${users.find(u => u.id === currentUser.coachId)?.name || "Your Coach"}`
                      : "Independent Training"}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Click any day to view & log workout</span>
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
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <div key={d} className="text-center py-1.5 text-xs font-bold uppercase text-slate-500">
                    {d}
                  </div>
                ))}

                {calendarDays.map((cd, idx) => {
                  if (!cd.isCurrentMonth) {
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
                          ? "border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400/50"
                          : dayWorkout
                            ? "border-sky-800/70 bg-sky-950/30 hover:border-cyan-500"
                            : "border-slate-800 bg-slate-950/60 hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs font-bold ${
                          cd.isToday ? "px-1.5 py-0.5 rounded-md bg-cyan-500 text-slate-950" : "text-slate-300"
                        }`}>
                          {cd.dayNumber}
                        </span>
                        {dayWorkout?.completed && (
                          <Icons.CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        )}
                      </div>

                      {dayWorkout ? (
                        <div className="w-full">
                          <span className={`text-[10px] font-semibold block truncate px-1.5 py-0.5 rounded ${
                            dayWorkout.completed
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                              : "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40"
                          }`}>
                            {dayWorkout.title}
                          </span>
                          <span className="text-[9px] text-slate-400 block truncate mt-0.5">
                            {dayWorkout.completed ? "Logged" : "Prescribed"}
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
                Generate a unique 6-character code. Swimmers can enter this code during registration to link directly to your coach dashboard.
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
                          ? "bg-emerald-600 text-white"
                          : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                      }`}
                    >
                      {copiedNotification ? <Icons.Check className="w-4 h-4" /> : <Icons.Copy className="w-4 h-4" />}
                      <span>{copiedNotification ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={generateNewInviteCode}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold rounded-xl text-sm transition"
              >
                Generate Another Invite Code
              </button>

              {/* Active Pending Invites List */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-2">
                  Active Pending Codes ({invites.filter(i => i.coachId === currentUser.id).length})
                </span>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {invites.filter(i => i.coachId === currentUser.id).length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No active codes. Generate one above!</p>
                  ) : (
                    invites.filter(i => i.coachId === currentUser.id).map(inv => (
                      <div key={inv.id} className="flex items-center justify-between p-2 bg-slate-800/60 rounded-lg border border-slate-700 text-xs">
                        <span className="font-mono text-cyan-300 font-bold tracking-wider">{inv.code}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(inv.code)}
                            className="text-slate-300 hover:text-white p-1"
                          >
                            <Icons.Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setInvites(prev => prev.filter(x => x.id !== inv.id))}
                            className="text-rose-400 hover:text-rose-300 p-1"
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
                  {currentUser.role === "coach" ? "Coach Prescription" : "Swimmer Workout Log"}
                </span>
                <h3 className="text-lg font-black text-white">
                  Date: {selectedDateStr}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWorkoutModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            {saveStatus && (
              <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs font-semibold flex items-center space-x-2">
                <Icons.CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{saveStatus}</span>
              </div>
            )}

            {/* COACH PRESCRIBING INTERFACE */}
            {currentUser.role === "coach" ? (
              <form onSubmit={handleSaveWorkout} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Workout Title</label>
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
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Session Goals / Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Target holding descending stroke counts across the 100s."
                    value={workoutForm.description}
                    onChange={e => setWorkoutForm({ ...workoutForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {/* Sets Builder */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Prescribed Sets</label>
                    <span className="text-xs text-cyan-400 font-mono">
                      Total Yardage: {workoutForm.sets.reduce((sum, s) => sum + ((Number(s.reps) || 0) * (Number(s.distance) || 0)), 0)}y
                    </span>
                  </div>

                  <div className="space-y-3">
                    {workoutForm.sets.map((set, idx) => (
                      <div key={set.id} className="p-3 bg-slate-800/70 border border-slate-700 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">Set #{idx + 1}</span>
                          {workoutForm.sets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSet(set.id)}
                              className="text-rose-400 hover:text-rose-300 text-xs p-1"
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
                              onChange={e => handleUpdateSet(set.id, "reps", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-semibold text-center"
                            />
                          </div>

                          {/* Distance */}
                          <div>
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">Distance (y/m)</label>
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={set.distance}
                              onChange={e => handleUpdateSet(set.id, "distance", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-semibold text-center"
                            />
                          </div>

                          {/* Stroke */}
                          <div>
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">Stroke</label>
                            <select
                              value={set.stroke}
                              onChange={e => handleUpdateSet(set.id, "stroke", e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-semibold"
                            >
                              <option value="Freestyle">Freestyle</option>
                              <option value="Backstroke">Backstroke</option>
                              <option value="Breaststroke">Breaststroke</option>
                              <option value="Butterfly">Butterfly</option>
                              <option value="IM">Individual Medley</option>
                              <option value="Choice">Choice</option>
                            </select>
                          </div>

                          {/* Interval */}
                          <div>
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">Interval</label>
                            <input
                              type="text"
                              placeholder="e.g., 1:30"
                              value={set.interval}
                              onChange={e => handleUpdateSet(set.id, "interval", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs text-center"
                            />
                          </div>
                        </div>

                        {/* Set specific notes */}
                        <div>
                          <input
                            type="text"
                            placeholder="Set instructions / pacing (optional)"
                            value={set.notes}
                            onChange={e => handleUpdateSet(set.id, "notes", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-900/60 border border-slate-700/80 rounded-lg text-slate-300 text-xs"
                          />
                        </div>

                        {/* Swimmer's Logged Split Times (Coach Inspection View) */}
                        {activeWorkout && (set.completedTime || set.swimmerNotes) && (
                          <div className="mt-2 p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs space-y-1">
                            <span className="font-semibold text-cyan-300">Swimmer Logged Split:</span>
                            {set.completedTime && <div className="text-white font-mono font-medium">{set.completedTime}</div>}
                            {set.swimmerNotes && <div className="text-slate-300 italic">"{set.swimmerNotes}"</div>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSet}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-dashed border-slate-600 rounded-xl text-xs font-semibold text-cyan-300 flex items-center justify-center space-x-1 transition"
                  >
                    <Icons.Plus className="w-3.5 h-3.5" />
                    <span>Add Another Set</span>
                  </button>
                </div>

                {/* Swimmer Completion & Feedback Overview for Coach */}
                {activeWorkout?.completed && (
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 uppercase flex items-center space-x-1">
                        <Icons.CheckCircle className="w-3.5 h-3.5" />
                        <span>Workout Completed by Swimmer</span>
                      </span>
                      {activeWorkout.rpe && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-900 text-emerald-200">
                          RPE: {activeWorkout.rpe}/10
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
                      className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-900/30 transition"
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
                    <p className="text-xs text-slate-500 mt-1">Enjoy your rest day or check with your coach for workouts!</p>
                  </div>
                ) : (
                  <form onSubmit={handleSaveSwimmerFeedback} className="space-y-5">
                    {/* Prescribed Summary */}
                    <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-white">{activeWorkout.title}</h4>
                        <span className="text-xs font-mono text-cyan-300 font-semibold">
                          {getWorkoutSummaryYardage(activeWorkout)}y Total
                        </span>
                      </div>
                      {activeWorkout.description && (
                        <p className="text-xs text-slate-300 mt-1">{activeWorkout.description}</p>
                      )}
                    </div>

                    {/* Sets Logging Table */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                        Prescribed Sets & Your Recorded Times
                      </label>

                      {activeWorkout.sets.map((set, idx) => (
                        <div key={set.id} className="p-3.5 bg-slate-800/50 border border-slate-700 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-cyan-300">
                              Set #{idx + 1}: {set.reps} x {set.distance}y {set.stroke}
                            </span>
                            {set.interval && (
                              <span className="text-xs font-mono text-slate-400">@ {set.interval}</span>
                            )}
                          </div>

                          {set.notes && (
                            <p className="text-xs text-slate-400 italic">Coach note: {set.notes}</p>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            <div>
                              <label className="text-[10px] font-semibold text-slate-400 uppercase">Recorded Time / Split</label>
                              <input
                                type="text"
                                placeholder="e.g., 1:04, 1:06, 1:05"
                                value={swimmerLogTimes[set.id] || ""}
                                onChange={e => setSwimmerLogTimes({ ...swimmerLogTimes, [set.id]: e.target.value })}
                                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:ring-1 focus:ring-cyan-400"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-slate-400 uppercase">Set Notes / Stroke Count</label>
                              <input
                                type="text"
                                placeholder="e.g., Held 14 strokes per length"
                                value={swimmerLogNotes[set.id] || ""}
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
                        <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded ${
                          swimmerRpe >= 8 ? "bg-rose-950 text-rose-300 border border-rose-800" :
                          swimmerRpe >= 5 ? "bg-amber-950 text-amber-300 border border-amber-800" :
                          "bg-cyan-950 text-cyan-300 border border-cyan-800"
                        }`}>
                          {swimmerRpe} / 10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={swimmerRpe}
                        onChange={e => setSwimmerRpe(e.target.value)}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                        <span>1 (Very Light)</span>
                        <span>5 (Moderate)</span>
                        <span>10 (Maximum Effort)</span>
                      </div>
                    </div>

                    {/* Post-Workout Comments */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                        Post-Workout Notes for Coach
                      </label>
                      <textarea
                        rows={3}
                        placeholder="How did your shoulders feel? Did you hit target intervals?"
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
                        className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-900/30 transition flex items-center space-x-1.5"
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
    </div>
  );
}