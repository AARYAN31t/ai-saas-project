import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Clock, MessageSquare, FileText, GraduationCap, Mail, AlignLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const History = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get('/ai/history');
                setHistory(data);
            } catch (error) {
                toast.error('Failed to load history');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'CHAT': return <MessageSquare size={18} className="text-blue-400" />;
            case 'RESUME': return <FileText size={18} className="text-green-400" />;
            case 'COLLEGE': return <GraduationCap size={18} className="text-purple-400" />;
            case 'EMAIL': return <Mail size={18} className="text-yellow-400" />;
            case 'SUMMARY': return <AlignLeft size={18} className="text-pink-400" />;
            default: return <HistoryIcon size={18} />;
        }
    };

    const filteredHistory = history.filter(item =>
        item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center text-slate-400 border border-white/5 shadow-2xl">
                        <HistoryIcon size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">Request History</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                            <Clock size={14} /> Auto-archived AI interactions
                        </p>
                    </div>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search history..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0d0d0d] border border-white/5 p-5 pl-16 rounded-[22px] focus:border-primary outline-none transition-all font-semibold"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filteredHistory.length === 0 ? (
                <div className="text-center py-32 glass rounded-[40px] border border-white/5">
                    <HistoryIcon className="mx-auto text-slate-700 mb-6" size={64} />
                    <h3 className="text-2xl font-black text-slate-400 mb-2">No history found</h3>
                    <p className="text-slate-600 font-semibold uppercase tracking-widest text-xs">Start using AI tools to build your archive</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredHistory.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="glass p-8 rounded-[30px] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all group"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            {getIcon(item.type)}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">{item.type}</span>
                                                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-300 line-clamp-1">{item.prompt}</h4>
                                            <p className="text-slate-500 font-medium text-sm line-clamp-2 leading-relaxed">
                                                {item.response}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex md:flex-col justify-between items-end gap-2">
                                        <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                            {item.tokensUsed} Tokens
                                        </div>
                                        <button className="text-primary hover:text-indigo-400 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default History;
