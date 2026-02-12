import React, { useState } from 'react';
import { Mail, Send, Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const EmailGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [tone, setTone] = useState('formal');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        setIsLoading(true);
        try {
            const { data } = await api.post('/ai/email', { prompt, tone });
            setResult(data.response);
            toast.success('Email generated!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Generation failed');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="flex items-center gap-6 mb-16">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-[24px] flex items-center justify-center text-yellow-400 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.15)] underline-offset-8">
                    <Mail size={32} />
                </div>
                <div>
                    <h2 className="text-4xl font-black tracking-tight mb-2">Smart Email Composer</h2>
                    <p className="text-slate-500 font-semibold tracking-wide flex items-center gap-2 uppercase text-xs">
                        <Sparkles size={14} className="text-primary" /> Perfect Tone. Zero Friction.
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
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-2 p-2 bg-white/5 rounded-2xl border border-white/5">
                                {['formal', 'casual'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setTone(t)}
                                        className={`py-3 rounded-xl font-black uppercase text-xs tracking-[0.2em] transition-all ${tone === t ? 'bg-primary text-white glow-primary' : 'text-slate-500 hover:text-white'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-2">What's the context?</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe the email you want to write..."
                                    rows="3"
                                    className="w-full bg-[#0d0d0d] border border-white/10 p-8 rounded-[30px] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-2xl text-lg font-medium resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !prompt.trim()}
                                className="w-full btn-primary flex items-center justify-center gap-3 h-16 text-lg font-black uppercase tracking-widest"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Compose Email'}
                            </button>
                        </form>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-12 glass p-12 rounded-[40px] border border-primary/20 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black tracking-tight">Drafted Content</h3>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-white"
                                >
                                    {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed font-medium text-lg selection:bg-primary/30">
                                {result}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EmailGenerator;
