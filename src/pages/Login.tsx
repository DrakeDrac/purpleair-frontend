import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Cloud, CloudRain, Sun, Snowflake, Search, Plus, Grid, Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Thermometer, Gamepad2, Shirt, Sparkles, Clock, Quote, Leaf, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { apiClient } from '../lib/api';
import { cn } from '../lib/utils';
import Home from './Home';

// --- CSS Styles for Animations & Utility ---
const GlobalStyles = () => (
    <style>{`
    body {
      overflow: hidden; /* Prevent browser scroll */
      touch-action: none; /* Disable browser gestures */
    }
    @keyframes fall {
      0% { transform: translateY(-10vh); }
      100% { transform: translateY(110vh); }
    }
    @keyframes snow {
      0% { transform: translateY(-10vh) translateX(0); opacity: 1; }
      100% { transform: translateY(110vh) translateX(20px); opacity: 0.3; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    @keyframes drift {
      0% { transform: translateX(-10%); }
      50% { transform: translateX(10%); }
      100% { transform: translateX(-10%); }
    }
    @keyframes rays {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .raindrop {
      position: absolute;
      background: rgba(255, 255, 255, 0.6);
      width: 2px;
      height: 15px;
      top: -20px;
      animation: fall linear infinite;
    }
    .snowflake {
      position: absolute;
      background: white;
      border-radius: 50%;
      top: -20px;
      animation: snow linear infinite;
    }
    .cloud-drift {
      animation: drift 20s ease-in-out infinite;
    }
    .sun-rays {
      animation: rays 20s linear infinite;
    }
    /* Hide Scrollbar for the sheet content */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

// --- Weather Background Component ---
const WeatherBackground = ({ weather }) => {
    const particles = useMemo(() => {
        return Array.from({ length: 50 }).map((_, i) => ({
            left: Math.random() * 100 + '%',
            delay: Math.random() * 2 + 's',
            duration: Math.random() * 1 + 0.5 + 's',
            snowDuration: Math.random() * 3 + 2 + 's',
            opacity: Math.random() * 0.5 + 0.3,
            size: Math.random() * 3 + 2 + 'px'
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-1000">
            <GlobalStyles />

            {weather === 'Sun' && (
                <>
                    <div className="absolute top-10 right-10 w-32 h-32">
                        <div className="absolute inset-0 sun-rays">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="absolute top-1/2 left-1/2 w-40 h-2 bg-yellow-200/30 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ transform: `translate(-50%, -50%) rotate(${i * 45}deg)` }}></div>
                            ))}
                        </div>
                        <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-60 animate-pulse"></div>
                        <div className="absolute inset-2 bg-yellow-100 rounded-full shadow-[0_0_50px_rgba(255,215,0,0.6)]"></div>
                    </div>
                    <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-yellow-200 rounded-full blur-3xl opacity-20"></div>
                </>
            )}

            {weather === 'Cloud' && (
                <>
                    <div className="absolute top-10 right-20 w-24 h-24 opacity-60">
                        <div className="absolute inset-0 bg-yellow-200 rounded-full blur-xl"></div>
                    </div>
                    <div className="absolute top-20 -left-20 text-white/40 cloud-drift" style={{ animationDuration: '30s' }}>
                        <Cloud className="w-64 h-64 fill-current blur-sm" />
                    </div>
                    <div className="absolute top-40 -right-20 text-white/30 cloud-drift" style={{ animationDuration: '40s', animationDirection: 'reverse' }}>
                        <Cloud className="w-80 h-80 fill-current blur-md" />
                    </div>
                    <div className="absolute top-10 left-1/3 text-white/50 cloud-drift" style={{ animationDuration: '25s' }}>
                        <Cloud className="w-48 h-48 fill-current blur-sm" />
                    </div>
                </>
            )}

            {weather === 'Rain' && (
                <>
                    {particles.map((p, i) => (
                        <div key={i} className="raindrop" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration }} />
                    ))}
                    <div className="absolute -top-20 left-0 right-0 h-48 bg-gradient-to-b from-slate-800 to-transparent opacity-80"></div>
                </>
            )}

            {weather === 'Snow' && (
                <>
                    {particles.map((p, i) => (
                        <div key={i} className="snowflake" style={{ left: p.left, width: p.size, height: p.size, opacity: p.opacity, animationDelay: p.delay, animationDuration: p.snowDuration }} />
                    ))}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(255,255,255,0.1)_100%)]"></div>
                </>
            )}
        </div>
    );
};

// --- The Cute Penguin Component ---
const Penguin = ({ weather }) => {
    const [blink, setBlink] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 200);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-64 h-64 flex justify-center items-center transition-all duration-500 z-10 pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                <ellipse cx="100" cy="185" rx="60" ry="10" fill="rgba(0,0,0,0.3)" />
                <path d="M70 175 C70 175 60 185 50 180 C40 175 50 165 65 165 Z" fill="#F59E0B" />
                <path d="M130 175 C130 175 140 185 150 180 C160 175 150 165 135 165 Z" fill="#F59E0B" />
                <ellipse cx="100" cy="110" rx="55" ry="70" fill="#1F2937" />

                {weather === 'Rain' && (
                    <path d="M45 110 Q45 180 100 180 Q155 180 155 110 Q155 60 100 60 Q45 60 45 110 Z" fill="#FCD34D" />
                )}

                <ellipse cx="100" cy="120" rx="35" ry="50" fill="white" />

                {weather === 'Rain' ? (
                    <path d="M155 110 Q170 130 150 140" stroke="#FCD34D" strokeWidth="12" fill="none" strokeLinecap="round" />
                ) : (
                    <>
                        <ellipse cx="45" cy="110" rx="10" ry="30" fill="#1F2937" transform="rotate(20 45 110)" />
                        <ellipse cx="155" cy="110" rx="10" ry="30" fill="#1F2937" transform="rotate(-20 155 110)" />
                    </>
                )}

                {weather === 'Sun' ? (
                    <g>
                        <rect x="70" y="75" width="25" height="15" rx="5" fill="#111" stroke="white" strokeWidth="1" />
                        <rect x="105" y="75" width="25" height="15" rx="5" fill="#111" stroke="white" strokeWidth="1" />
                        <line x1="95" y1="82" x2="105" y2="82" stroke="#111" strokeWidth="2" />
                    </g>
                ) : (
                    <g>
                        {blink ? (
                            <>
                                <line x1="80" y1="85" x2="90" y2="85" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
                                <line x1="110" y1="85" x2="120" y2="85" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
                            </>
                        ) : (
                            <>
                                <circle cx="85" cy="85" r="4" fill="#1F2937" />
                                <circle cx="115" cy="85" r="4" fill="#1F2937" />
                            </>
                        )}
                    </g>
                )}

                <path d="M95 95 L105 95 L100 105 Z" fill="#F59E0B" />
                <circle cx="75" cy="95" r="4" fill="#FCA5A5" opacity="0.6" />
                <circle cx="125" cy="95" r="4" fill="#FCA5A5" opacity="0.6" />

                {weather === 'Snow' && (
                    <>
                        <path d="M70 130 Q100 150 130 130" stroke="#EF4444" strokeWidth="12" fill="none" strokeLinecap="round" />
                        <path d="M120 130 L125 150" stroke="#EF4444" strokeWidth="10" strokeLinecap="round" />
                        <path d="M70 60 Q100 40 130 60 L130 70 Q100 55 70 70 Z" fill="#EF4444" />
                        <circle cx="100" cy="50" r="10" fill="white" />
                    </>
                )}

                {weather === 'Rain' && (
                    <>
                        <path d="M65 70 Q100 50 135 70" fill="#FCD34D" />
                        <path d="M70 60 Q100 30 130 60" fill="#FCD34D" />
                        <line x1="150" y1="140" x2="150" y2="80" stroke="#9CA3AF" strokeWidth="3" />
                        <path d="M110 80 Q150 40 190 80" fill="#3B82F6" />
                        <path d="M150 40 L150 35" stroke="#3B82F6" strokeWidth="3" />
                    </>
                )}

                {weather === 'Sun' && (
                    <g transform="translate(140, 130) rotate(20)">
                        <path d="M0 0 L10 25 L20 0 Z" fill="#D97706" />
                        <circle cx="10" cy="-5" r="10" fill="#EC4899" />
                    </g>
                )}
            </svg>
        </div>
    );
};

// --- AUTH SCREEN COMPONENT ---
// --- AUTH SCREEN COMPONENT ---
const AuthScreen = ({ onLogin, theme }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // New state for loading and error handling
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            let response;
            if (isLogin) {
                // Assuming the API expects username, but we have email input. 
                // Adjusting to use email as username or chaning input logic. 
                // The API definition says 'username', but UI says 'Email Address'. 
                // I will use email as username for now.
                response = await apiClient.login(email, password);
            } else {
                // For register, we might need name too, but API wrapper only takes username/pass
                response = await apiClient.register(email, password);
            }

            // Store token
            if (response.token) {
                localStorage.setItem('weatherAppToken', response.token);
                onLogin();
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError(err.message || "Authentication failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestLogin = () => {
        localStorage.setItem('weatherAppToken', 'guest_token');
        onLogin();
    };

    return (
        <div className="flex-1 w-full flex flex-col items-center justify-center px-6 relative z-30">

            {/* Title */}
            <div className="mb-8 text-center">
                <h1 className={cn(`text-4xl font-bold mb-2 mt-12`, theme.text)}>
                    {isLogin ? "Welcome Back!" : "Join the Fun!"}
                </h1>
                <p className={cn(`text-sm opacity-80`, theme.text)}>
                    {isLogin ? "Ready to check the weather?" : "Create an account to get started."}
                </p>
            </div>

            {/* Auth Card */}
            <div className={cn(`w-full max-w-sm p-8 rounded-[2.5rem] backdrop-blur-xl border shadow-2xl transition-colors duration-500`, theme.glass)}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Show error if any */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    {!isLogin && (
                        <div className="relative group">
                            <User className={cn(`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60`, theme.text)} />
                            <input
                                type="text"
                                placeholder="Your Name"
                                className={cn(`w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 outline-none focus:bg-white/20 focus:border-white/40 transition-all placeholder:text-current placeholder:opacity-40`, theme.text)}
                            />
                        </div>
                    )}

                    <div className="relative group">
                        <Mail className={cn(`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60`, theme.text)} />
                        <input
                            type="email" // Keeping type email for validation, but treating as username
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className={cn(`w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 outline-none focus:bg-white/20 focus:border-white/40 transition-all placeholder:text-current placeholder:opacity-40`, theme.text)}
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Lock className={cn(`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60`, theme.text)} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className={cn(`w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 outline-none focus:bg-white/20 focus:border-white/40 transition-all placeholder:text-current placeholder:opacity-40`, theme.text)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={cn(`mt-4 w-full py-3.5 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed`,
                            theme.bg.includes('orange')
                                ? 'bg-orange-500 hover:bg-orange-400 text-white'
                                : 'bg-white text-slate-900 hover:bg-white/90'
                        )}
                    >
                        {isLoading ? (
                            <span>Loading...</span>
                        ) : (
                            <>
                                {isLogin ? "Sign In" : "Sign Up"}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    {/* Guest Login Button */}
                    <button
                        type="button"
                        onClick={handleGuestLogin}
                        className={cn(` w-full py-3.5 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed`,
                            theme.bg.includes('orange')
                                ? 'bg-orange-500 hover:bg-orange-400 text-white'
                                : 'bg-white text-slate-900 hover:bg-white/90'
                        )}
                    >
                        Continue as Guest
                    </button>
                </form>

                {/* Toggle Login/Signup - TEMPORARILY DISABLED */}
                {/* 
                <div className="mt-6 text-center">
                    <p className={cn(`text-sm opacity-70`, theme.text)}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className={cn(`text-sm font-bold mt-1 hover:underline`, theme.text)}
                    >
                        {isLogin ? "Create Account" : "Log In Here"}
                    </button>
                </div> 
                */}
            </div>

            {/* Footer */}
            <div className={cn(`mt-8 text-xs opacity-50`, theme.text)}>
                Letsgo penguinnn
            </div>
        </div>
    );
};


// --- WEATHER DASHBOARD COMPONENT ---
// This contains the original dashboard view
const WeatherDashboard = ({ weather, setWeather, theme, WeatherIcon }) => {
    // Swipe Logic State
    const [isExpanded, setIsExpanded] = useState(false);
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const sheetRef = useRef(null);

    // Time & Quote Logic
    const hour = new Date().getHours();
    const isEvening = hour >= 17;

    // Play time calculation (until 7 PM)
    const playHoursLeft = Math.max(0, 19 - hour);

    const QUOTES = [
        "Every cloud has a silver lining!",
        "Keep your face to the sunshine and you cannot see a shadow.",
        "Life is better when you're laughing.",
        "No rain, no flowers!",
        "Be like a snowflake: beautiful and unique."
    ];

    const randomQuote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

    // Touch Event Handlers
    const onTouchStart = (e) => {
        setIsDragging(true);
        startY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
        if (!isDragging) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;

        // Limit drag range
        if (isExpanded && diff > 0) setDragY(diff); // Dragging down from top
        else if (!isExpanded && diff < 0) setDragY(diff); // Dragging up from bottom
    };

    const onTouchEnd = () => {
        setIsDragging(false);
        const threshold = 100; // Pixels to trigger snap

        if (Math.abs(dragY) > threshold) {
            setIsExpanded(!isExpanded); // Toggle state
        }
        setDragY(0); // Reset drag offset
    };

    // Calculate transformation for the sheet
    const collapsedOffset = '60%';
    const expandedOffset = '10%';

    const sheetStyle = {
        transform: isDragging
            ? `translateY(calc(${isExpanded ? expandedOffset : collapsedOffset} + ${dragY}px))`
            : `translateY(${isExpanded ? expandedOffset : collapsedOffset})`,
        transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
    };

    return (
        <>
            {/* Top Info Section */}
            <div className={`w-full px-6 pt-2 flex flex-col items-center z-20 ${theme.text} transition-opacity duration-500 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="w-full flex justify-between items-center mb-8">
                    <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </div>

                {/* Horizontal Layout for Location and Temp */}
                <div className="flex flex-row items-center justify-center gap-6 mb-2">
                    <h2 className="text-4xl font-normal tracking-wide">London</h2>
                    <div className="w-px h-10 bg-current opacity-30"></div>
                    <h1 className="text-5xl font-light tracking-tighter">
                        {theme.temp}
                    </h1>
                </div>

                <div className="flex flex-col items-center relative">
                    <div className="text-lg font-normal opacity-90 flex items-center gap-2">
                        {theme.condition}
                    </div>
                    <div className="text-sm opacity-70 mt-1 font-light">
                        H:{theme.high} &nbsp; L:{theme.low}
                    </div>
                </div>
            </div>

            {/* Penguin Section */}
            <div className={`flex-1 w-full flex flex-col justify-center items-center relative z-10 -mt-6 transition-all duration-700 ${isExpanded ? 'scale-75 -translate-y-20 opacity-50 blur-sm' : 'scale-100 translate-y-0'}`}>

                {/* Container for Penguin + Bubble to keep them together */}
                <div className="relative">
                    {/* Speech Bubble */}
                    <div className="absolute top-4 -right-6 bg-white text-slate-900 px-3 py-1.5 rounded-2xl rounded-bl-none shadow-xl transform transition-all duration-500 hover:scale-105 z-20 max-w-[120px] text-xs font-semibold text-center animate-[float_3s_ease-in-out_infinite]">
                        {theme.suggestion}
                        <div className="absolute -bottom-1 left-0 w-3 h-3 bg-white transform rotate-45"></div>
                    </div>

                    <div className={`absolute inset-0 w-64 h-64 rounded-full blur-3xl opacity-20 ${weather === 'Sun' ? 'bg-white' : 'bg-white'}`}></div>
                    <Penguin weather={weather} />
                </div>
            </div>

            {/* Fake Weather Controls */}
            <div className={`z-50 flex gap-3 mb-32 bg-black/20 backdrop-blur-xl p-2 rounded-full border border-white/10 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {['Sun', 'Rain', 'Snow', 'Cloud'].map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setWeather(mode)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${weather === mode
                            ? 'bg-white text-black shadow-lg scale-105'
                            : 'text-white/70 hover:bg-white/10'
                            }`}
                    >
                        {mode}
                    </button>
                ))}
            </div>

            {/* --- SWIPEABLE BOTTOM SHEET --- */}
            <div
                ref={sheetRef}
                style={sheetStyle}
                className={`fixed bottom-0 w-full h-[85vh] rounded-t-[2.5rem] backdrop-blur-xl shadow-[0_-10px_50px_rgba(0,0,0,0.3)] border-t transition-colors duration-500 ${theme.glass} z-30 flex flex-col`}
            >
                {/* Drag Handle Area */}
                <div
                    className="w-full pt-4 pb-2 flex flex-col items-center cursor-grab active:cursor-grabbing flex-shrink-0"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div className="w-12 h-1.5 rounded-full bg-white/40 mb-4"></div>
                    <div className={`text-center text-sm font-medium opacity-80 ${theme.text}`}>
                        Penguin's Advice
                    </div>
                </div>

                {/* Sheet Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32">

                    {/* Advice Cards Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-4 mb-6">
                        {/* Play Card */}
                        <div className={`p-4 rounded-3xl ${weather === 'Sun' ? 'bg-orange-500/10' : 'bg-white/5'} border border-white/10 flex flex-col gap-3 relative overflow-hidden group`}>
                            <div className="flex justify-between items-start">
                                <span className={`text-xs font-bold uppercase opacity-60 ${theme.text}`}>Play Time</span>
                                <Gamepad2 className={`w-5 h-5 ${theme.text}`} />
                            </div>
                            <p className={`text-sm font-medium leading-tight ${theme.text}`}>
                                {theme.advice.games}
                            </p>
                            {/* Decorative Circle */}
                            <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-current opacity-5"></div>
                        </div>

                        {/* Wear Card */}
                        <div className={`p-4 rounded-3xl ${weather === 'Sun' ? 'bg-orange-500/10' : 'bg-white/5'} border border-white/10 flex flex-col gap-3 relative overflow-hidden`}>
                            <div className="flex justify-between items-start">
                                <span className={`text-xs font-bold uppercase opacity-60 ${theme.text}`}>Dress Code</span>
                                <Shirt className={`w-5 h-5 ${theme.text}`} />
                            </div>
                            <p className={`text-sm font-medium leading-tight ${theme.text}`}>
                                {theme.advice.wear}
                            </p>
                        </div>
                    </div>

                    {/* NEW SECTION: Penguin's Smart Update */}
                    <div className={`mb-6 rounded-3xl p-5 border border-white/10 ${weather === 'Sun' ? 'bg-orange-500/10' : 'bg-white/5'} relative overflow-hidden`}>
                        <div className={`flex items-center gap-2 mb-4 opacity-90 ${theme.text}`}>
                            <Leaf className="w-5 h-5" />
                            <h3 className="text-sm font-bold uppercase">Penguin's Smart Update</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Air Quality */}
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${weather === 'Sun' ? 'bg-orange-100/20' : 'bg-white/10'}`}>
                                    <Wind className={`w-5 h-5 ${theme.text}`} />
                                </div>
                                <div>
                                    <div className={`text-[10px] uppercase font-bold opacity-60 ${theme.text}`}>Air Quality</div>
                                    <div className={`text-sm font-semibold ${theme.text}`}>{theme.aqi}</div>
                                </div>
                            </div>
                            {/* Time Left */}
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${weather === 'Sun' ? 'bg-orange-100/20' : 'bg-white/10'}`}>
                                    <Clock className={`w-5 h-5 ${theme.text}`} />
                                </div>
                                <div>
                                    <div className={`text-[10px] uppercase font-bold opacity-60 ${theme.text}`}>Play Time</div>
                                    <div className={`text-sm font-semibold ${theme.text}`}>{playHoursLeft > 0 ? `${playHoursLeft} hours left` : "Time for bed!"}</div>
                                </div>
                            </div>
                        </div>

                        <p className={`text-sm mb-4 leading-relaxed opacity-90 ${theme.text}`}>
                            {theme.aqiMsg} It's {theme.temp} outside. {playHoursLeft > 1 ? "You have plenty of time to play!" : "Better hurry, it's getting late!"}
                        </p>

                        {/* Quote Section */}
                        <div className="border-t border-white/10 pt-3 flex gap-3">
                            <Quote className={`w-4 h-4 flex-shrink-0 transform scale-x-[-1] opacity-60 ${theme.text}`} />
                            <span className={`text-xs italic font-medium opacity-80 ${theme.text}`}>
                                "{randomQuote}"
                            </span>
                        </div>
                    </div>

                    {/* Tomorrow/Evening Forecast Section */}
                    <div className="w-full bg-gradient-to-br from-white/10 to-transparent p-6 rounded-[2rem] border border-white/10 relative overflow-hidden">
                        <div className={`flex items-center gap-2 mb-4 ${theme.text}`}>
                            <Sparkles className="w-5 h-5 opacity-80" />
                            <h3 className="text-sm font-bold uppercase opacity-80">Looking Ahead: {theme.advice.next.label}</h3>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <WeatherIcon className={`w-12 h-12 ${theme.text}`} />
                                <span className={`text-4xl font-light ${theme.text}`}>{theme.advice.next.temp}</span>
                            </div>
                        </div>

                        {/* Penguin Message Bubble */}
                        <div className={`relative bg-white/90 p-3 rounded-xl rounded-tl-none ${weather === 'Rain' || weather === 'Snow' ? 'text-slate-900' : 'text-slate-800'}`}>
                            <p className="text-sm font-medium italic">
                                "{theme.advice.next.msg}"
                            </p>
                            {/* Triangle Tip */}
                            <div className="absolute -top-2 left-0 w-0 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-white/90 border-r-[10px] border-r-transparent transform -rotate-12 translate-x-1"></div>
                        </div>

                    </div>

                </div>
            </div>

            {/* Bottom Navigation (Fixed over the sheet) */}
            <div className={`absolute bottom-6 left-0 w-full px-8 flex justify-between items-center z-40 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <button className={`p-3 rounded-full hover:bg-white/10 transition-colors ${theme.text}`}>
                    <Search className="w-6 h-6" />
                </button>

                <button className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 hidden ${weather === 'Sun' ? 'bg-orange-500 text-white' : 'bg-pink-400/80 text-white backdrop-blur-md border border-white/20'}`}>
                    <Plus className="w-7 h-7" />
                </button>

                <button className={`p-3 rounded-full hover:bg-white/10 transition-colors ${theme.text}`}>
                    <Grid className="w-6 h-6" />
                </button>
            </div>
        </>
    );
}

// --- Main App Component ---
const Login = () => {
    const [weather, setWeather] = useState('Snow');
    const [view, setView] = useState('auth'); // 'auth' | 'app'
    const hour = new Date().getHours();
    const isEvening = hour >= 17;

    // Dynamic Data based on weather
    const getTheme = () => {
        switch (weather) {
            case 'Sun':
                return {
                    bg: 'bg-gradient-to-b from-sky-400 via-sky-300 to-blue-200',
                    text: 'text-slate-800',
                    glass: 'bg-white/40 border-white/50',
                    temp: '24°', condition: 'Sunny', high: '26°', low: '18°', icon: Sun,
                    suggestion: "Don't forget SPF!",
                    aqi: "Good (35)",
                    aqiMsg: "Air is clean! Great for sports.",
                    advice: {
                        games: "Perfect for Tag or Frisbee!",
                        wear: "Shorts, T-shirt & Sunglasses",
                        next: { label: isEvening ? "Tonight" : "Tomorrow", temp: "15°", msg: isEvening ? "Clear skies for stargazing!" : "Another sunny day ahead!" }
                    }
                };
            case 'Rain':
                return {
                    bg: 'bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800',
                    text: 'text-white',
                    glass: 'bg-slate-800/80 border-white/10',
                    temp: '12°', condition: 'Heavy Rain', high: '14°', low: '9°', icon: CloudRain,
                    suggestion: "Stay dry today!",
                    aqi: "Excellent (15)",
                    aqiMsg: "Rain cleaned the air!",
                    advice: {
                        games: "Board games & Indoor Forts",
                        wear: "Raincoat, Boots & Umbrella",
                        next: { label: isEvening ? "Tonight" : "Tomorrow", temp: "10°", msg: "Rain should stop by morning." }
                    }
                };
            case 'Cloud':
                return {
                    bg: 'bg-gradient-to-b from-slate-400 via-slate-300 to-slate-400',
                    text: 'text-slate-800',
                    glass: 'bg-white/40 border-white/30',
                    temp: '16°', condition: 'Cloudy', high: '17°', low: '13°', icon: Cloud,
                    suggestion: "Perfect reading weather.",
                    aqi: "Moderate (55)",
                    aqiMsg: "Good for a walk, but take it easy.",
                    advice: {
                        games: "Hide and Seek outside",
                        wear: "Light Jacket or Hoodie",
                        next: { label: isEvening ? "Tonight" : "Tomorrow", temp: "14°", msg: "Sun might peek out soon!" }
                    }
                };
            case 'Snow':
            default:
                return {
                    bg: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-violet-950',
                    text: 'text-white',
                    glass: 'bg-white/10 border-white/20',
                    temp: '5°', condition: 'Heavy Snow', high: '19°', low: '12°', icon: Snowflake,
                    suggestion: "Brrr! Bundle up!",
                    aqi: "Good (42)",
                    aqiMsg: "Fresh cold air! Dress warmly.",
                    advice: {
                        games: "Snowball fight & Snow angels!",
                        wear: "Puffer Jacket, Scarf & Gloves",
                        next: { label: isEvening ? "Tonight" : "Tomorrow", temp: "-2°", msg: "Stay warm, it's freezing!" }
                    }
                };
        }
    };

    const theme = getTheme();

    if (view === 'app') {
        return <Home />;
    }

    return (
        <div className={`w-full h-screen ${theme.bg} transition-colors duration-1000 flex flex-col items-center relative overflow-hidden font-light selection:bg-pink-500 selection:text-white`}>

            {/* Background is always visible */}
            <WeatherBackground weather={weather} />

            {/* Status Bar */}
            <div className={`w-full px-6 py-3 flex justify-between items-center text-xs font-medium ${theme.text} opacity-80 z-20`}>
                <span>3:30</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-current opacity-60" />
                    <div className="w-3 h-3 rounded-full bg-current opacity-60" />
                    <div className="w-4 h-3 rounded-[2px] border border-current opacity-60" />
                </div>
            </div>

            {/* Render Auth Screen */}
            <div className="flex-1 w-full flex flex-col relative">
                {/* Show Penguin in Auth Mode but positioned differently or same */}
                <div className="absolute top-[-5%] left-0 w-full flex justify-center opacity-80 pointer-events-none z-10">
                    <div className="scale-75 blur-[1px]">
                        <Penguin weather={weather} />
                    </div>
                </div>

                {/* Fake Controls allowed in Auth to see theme changes */}
                <div className="absolute bottom-6 w-full flex justify-center z-50">
                    <div className={`flex gap-3 bg-black/20 backdrop-blur-xl p-2 rounded-full border border-white/10`}>
                        {['Sun', 'Rain', 'Snow'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setWeather(mode)}
                                className={`w-2 h-2 rounded-full transition-all ${weather === mode ? 'bg-white scale-150' : 'bg-white/40'}`}
                            />
                        ))}
                    </div>
                </div>

                <AuthScreen onLogin={() => setView('app')} theme={theme} />
            </div>

        </div>
    );
};

export default Login;