import React, { useState } from 'react';
import { GraduationCap, Send, Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const CollegeBot = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsLoading(true);
        try {
            const { data } = await api.post('/ai/college', { query });
            setResult(data.response);
            toast.success('Advice generated!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Connection failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="flex items-center gap-6 mb-16">
                <div className="w-16 h-16 bg-purple-500/20 rounded-[20px] flex items-center justify-center text-purple-400 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                    <GraduationCap size={32} />
                </div>
                <div>
                    <h2 className="text-4xl font-black tracking-tight mb-2">College Admission Advisor</h2>
                    <p className="text-slate-500 font-semibold tracking-wide flex items-center gap-2 uppercase text-xs">
                        <Sparkles size={14} className="text-primary" /> Specialized Higher Education Intelligence
                    </p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-10 rounded-[40px] border border-white/5 mb-12"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Your Question</label>
                    <div className="relative group">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Example: How can I improve my extracurricular profile for Ivy League admissions?"
                            rows="4"
                            className="w-full bg-[#0d0d0d] border border-white/10 p-8 rounded-[30px] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-2xl text-lg font-medium resize-none"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !query.trim()}
                            className="absolute right-6 bottom-6 btn-primary flex items-center gap-2 py-3 px-8 text-sm uppercase font-black tracking-widest"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                            Ask Advisor
                        </button>
                    </div>
                </form>
            </motion.div>

            {result ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-12 rounded-[40px] border border-primary/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                    <div className="flex items-center gap-3 mb-8 text-primary">
                        <Lightbulb size={24} />
                        <span className="text-xl font-black uppercase tracking-widest">AAdmissions Strategy</span>
                    </div>
                    <div className="text-slate-300 whitespace-pre-wrap leading-relaxed font-medium text-lg">
                        {result}
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-30 grayscale pointer-events-none">
                    <SuggestionCard text="Comparing Computer Science programs at MIT vs Stanford" />
                    <SuggestionCard text="Scholarship opportunities for international students" />
                </div>
            )}
        </div>
    );
};

const SuggestionCard = ({ text }) => (
    <div className="glass p-6 rounded-[25px] border border-white/5 flex items-center gap-4 italic font-medium text-slate-500">
        <Sparkles size={16} /> "{text}"
    </div>
);

export default CollegeBot;
