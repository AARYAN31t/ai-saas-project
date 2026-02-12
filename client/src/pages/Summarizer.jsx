import React, { useState } from 'react';
import { AlignLeft, Send, Loader2, Sparkles, FileText, FileSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const Summarizer = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setIsLoading(true);
        try {
            const { data } = await api.post('/ai/summarize', { text });
            setResult(data.response);
            toast.success('Summary generated!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Summarization failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="flex items-center gap-6 mb-16">
                <div className="w-16 h-16 bg-pink-500/20 rounded-[24px] flex items-center justify-center text-pink-400 border border-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
                    <AlignLeft size={32} />
                </div>
                <div>
                    <h2 className="text-4xl font-black tracking-tight mb-2">Instant Summarizer</h2>
                    <p className="text-slate-500 font-semibold tracking-wide flex items-center gap-2 uppercase text-xs">
                        <Sparkles size={14} className="text-primary" /> Long Documents → Short Insights
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-10 rounded-[40px] border border-white/5"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Content to Distill</label>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Paste your long text, article, or document content here..."
                                    rows="8"
                                    className="w-full bg-[#0d0d0d] border border-white/10 p-8 rounded-[30px] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-2xl text-lg font-medium resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !text.trim()}
                                className="w-full btn-primary flex items-center justify-center gap-3 h-16 text-lg font-black uppercase tracking-widest"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Generate Summary'}
                            </button>
                        </form>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="lg:col-span-12 glass p-12 rounded-[40px] border border-pink-500/10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/5 rounded-full blur-[100px]" />
                            <div className="flex items-center gap-3 mb-8 text-pink-400">
                                <FileSearch size={28} />
                                <h3 className="text-2xl font-black uppercase tracking-[0.2em]">Key Takeaways</h3>
                            </div>
                            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed font-medium text-lg selection:bg-pink-500/20">
                                {result}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Summarizer;
