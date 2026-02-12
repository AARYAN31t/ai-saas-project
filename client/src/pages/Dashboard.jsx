import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    CreditCard,
    History as HistoryIcon,
    MessageSquare,
    FileText,
    GraduationCap,
    Mail,
    AlignLeft,
    Plus,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = ({ user }) => {
    const handleUpgrade = async () => {
        try {
            const { data } = await api.post('/stripe/create-checkout-session');
            window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
        } catch (error) {
            console.error('Payment failed', error);
        }
    };

    const tools = [
        { name: 'AI Chat Assistant', icon: MessageSquare, color: 'text-blue-400', to: '/ai-chat', desc: 'Real-time intelligent conversations.' },
        { name: 'Resume Analyzer', icon: FileText, color: 'text-green-400', to: '/resume', desc: 'Deep score & feedback for PDF resumes.' },
        { name: 'College Bot', icon: GraduationCap, color: 'text-purple-400', to: '/college', desc: 'Expert admissions guidance.' },
        { name: 'Email Generator', icon: Mail, color: 'text-yellow-400', to: '/email', desc: 'Professional emails in seconds.' },
        { name: 'Summarizer', icon: AlignLeft, color: 'text-pink-400', to: '/summarize', desc: 'Distill documents into insights.' },
    ];

    return (
        <div className="max-w-7xl mx-auto py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                    <h1 className="text-5xl font-black mb-3 tracking-tighter">Welcome, {user?.name || 'Explorer'}! ✨</h1>
                    <p className="text-slate-500 text-lg font-semibold">Your AI-powered productivity hub is ready.</p>
                </div>
                <button
                    onClick={handleUpgrade}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-3xl font-black flex items-center gap-3 shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus size={20} /> Upgrade to Pro
                </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <StatCard
                    icon={<Zap className="text-primary" size={24} />}
                    label="Available Tokens"
                    value={user?.tokens || 0}
                    suffix="Units"
                    trend="+5 free today"
                />

                <div className="glass p-10 rounded-[40px] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:rotate-12 transition-transform">
                                <CreditCard className="text-green-400" size={24} />
                            </div>
                            <span className="text-slate-500 font-black uppercase tracking-widest text-xs">Current Tier</span>
                        </div>
                        {user?.plan === 'FREE' && (
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">
                                Action Required
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-5xl font-black tracking-tighter">{user?.plan || 'Free'}</span>
                        <span className="text-slate-500 font-bold uppercase text-xs">Plan</span>
                    </div>
                    <button
                        onClick={handleUpgrade}
                        disabled={user?.plan === 'PRO'}
                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all ${user?.plan === 'PRO'
                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                : 'bg-primary text-white glow-primary hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20'
                            }`}
                    >
                        {user?.plan === 'PRO' ? '✓ Pro Active' : 'Upgrade Now'}
                    </button>
                </div>

                <StatCard
                    icon={<HistoryIcon className="text-purple-400" size={24} />}
                    label="Recent Activity"
                    value="42"
                    suffix="Requests"
                    trend="Active now"
                />
            </div>

            {/* Tools Section */}
            <div className="mb-10">
                <h2 className="text-3xl font-black mb-10 tracking-tight flex items-center gap-4">
                    AI Tool Suite <div className="h-[1px] flex-1 bg-white/5" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tools.map((tool, idx) => (
                        <Link key={idx} to={tool.to} className="group">
                            <motion.div
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="glass p-8 rounded-[40px] border border-white/5 hover:border-primary/40 transition-all duration-300 relative overflow-hidden h-full flex flex-col"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-all" />
                                <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 ${tool.color} border border-white/5 group-hover:scale-110 transition-transform`}>
                                    <tool.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-black mb-3">{tool.name}</h3>
                                <p className="text-slate-500 mb-8 font-semibold leading-relaxed">{tool.desc}</p>
                                <div className="mt-auto flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    Open Tool <ArrowRight size={16} />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, suffix, trend }) => (
    <div className="glass p-10 rounded-[40px] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:rotate-12 transition-transform">
                {icon}
            </div>
            <span className="text-slate-500 font-black uppercase tracking-widest text-xs">{label}</span>
        </div>
        <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-black tracking-tighter">{value}</span>
            <span className="text-slate-500 font-bold uppercase text-xs">{suffix}</span>
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-green-400/10 text-green-400 text-[10px] font-black uppercase tracking-widest">
            {trend}
        </div>
    </div>
);

export default Dashboard;
