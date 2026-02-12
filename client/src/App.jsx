import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import CollegeBot from './pages/CollegeBot';
import EmailGenerator from './pages/EmailGenerator';
import Summarizer from './pages/Summarizer';
import History from './pages/History';
import Pricing from './pages/Pricing';
import CustomCursor from './components/CustomCursor';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" />;
    return children;
};

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser && savedUser !== "undefined") {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Invalid user data in localStorage, clearing it.");
                localStorage.removeItem('user');
            }
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <div className="min-h-screen mesh-gradient text-slate-200">
                    <CustomCursor />
                    <Toaster position="top-right" />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login setUser={setUser} />} />
                        <Route path="/signup" element={<Signup setUser={setUser} />} />

                        <Route path="/*" element={
                            <ProtectedRoute>
                                <div className="flex">
                                    <Sidebar user={user} />
                                    <main className="flex-1 min-h-screen p-4 md:p-8">
                                        <Routes>
                                            <Route path="/dashboard" element={<Dashboard user={user} />} />
                                            <Route path="/ai-chat" element={<AIChat />} />
                                            <Route path="/resume" element={<ResumeAnalyzer />} />
                                            <Route path="/college" element={<CollegeBot />} />
                                            <Route path="/email" element={<EmailGenerator />} />
                                            <Route path="/summarize" element={<Summarizer />} />
                                            <Route path="/history" element={<History />} />
                                            <Route path="/pricing" element={<Pricing user={user} />} />
                                        </Routes>
                                    </main>
                                </div>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
