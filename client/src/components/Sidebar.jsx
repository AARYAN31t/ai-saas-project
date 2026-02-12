import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
    LayoutDashboard,
    MessageSquare,
    FileText,
    GraduationCap,
    Mail,
    AlignLeft,
    History,
    LogOut,
    Sparkles,
    CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout error:", error);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/ai-chat', icon: MessageSquare, label: 'AI Chat' },
        { to: '/resume', icon: FileText, label: 'Resume Analyzer' },
        { to: '/college', icon: GraduationCap, label: 'College Bot' },
        { to: '/email', icon: Mail, label: 'Email Generator' },
        { to: '/summarize', icon: AlignLeft, label: 'Summarizer' },
        { to: '/history', icon: History, label: 'History' },
        { to: '/pricing', icon: CreditCard, label: 'Upgrade Plan' },
    ];

    return (
        <aside className="w-72 h-screen sticky top-0 border-r border-white/5 bg-[#080808] flex flex-col z-50">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                        <Sparkles className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black gradient-text tracking-tight">Promptify</span>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${isActive
                                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <item.icon size={22} className="group-hover:scale-110 transition-transform" />
                            <span className="font-semibold">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 space-y-4">
                <div className="glass p-5 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Token Usage</span>
                        <span className="text-[10px] text-primary font-black">{100 - (user?.tokens || 0)}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(100 - (user?.tokens || 0))}%` }}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full"
                        />
                    </div>
                    {user?.plan !== 'PRO' ? (
                        <div className="mt-3 text-center">
                            <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                                <span>Free Plan</span>
                                <span>Limit: 5/day</span>
                            </div>
                            <button onClick={() => navigate('/pricing')} className="text-[10px] text-white bg-primary/20 px-2 py-1 rounded hover:bg-primary/30 transition-colors w-full">
                                Upgrade for Unlimited
                            </button>
                        </div>
                    ) : (
                        <p className="text-[10px] text-green-400 mt-2 text-center font-medium">✨ PRO Active</p>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full px-5 py-4 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all duration-300 font-semibold"
                >
                    <LogOut size={22} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
