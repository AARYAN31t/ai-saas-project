import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Shield, Cpu, Github, Twitter } from 'lucide-react';

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass p-10 rounded-[40px] border border-white/5 hover:border-primary/50 transition-all duration-500 group relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500">
            {icon}
        </div>
        <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
        <p className="text-slate-500 leading-relaxed font-semibold">{desc}</p>
    </motion.div>
);

const Home = () => {
    return (
        <div className="bg-[#050505] min-h-screen selection:bg-primary/30">
            {/* Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Navbar */}
            <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center glow-primary">
                        <Sparkles className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black gradient-text tracking-tighter">Promptify</span>
                </div>
                <div className="flex gap-8 items-center font-semibold">
                    <Link to="/login" className="text-slate-400 hover:text-white transition-all text-sm uppercase tracking-widest">Login</Link>
                    <Link to="/signup" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 text-sm uppercase tracking-widest font-black">
                        Start for Free
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-24 pb-40 px-6 relative z-10 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-6 py-2 mb-10 glass rounded-full border border-white/10"
                    >
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-slate-300 text-xs font-bold uppercase tracking-[0.2em]">Platform Live: Version 2.4.0</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-8xl font-black mb-10 leading-[0.9] tracking-tighter"
                    >
                        The AI Infrastructure for <span className="gradient-text">Modern Creators</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-lg md:text-xl text-slate-500 mb-14 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Scale your workflow with production-grade AI tools. Resume scoring, smart chat, and specialized text generation in one ultimate dashboard.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        <Link to="/signup" className="bg-white text-black hover:bg-slate-200 px-10 py-5 rounded-3xl font-black text-lg transition-all flex items-center gap-3 group">
                            Launch Dashboard <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <Link to="/demo" className="glass hover:bg-white/5 text-white px-10 py-5 rounded-3xl font-black text-lg transition-all border border-white/10">
                            Watch Trailer
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Container */}
            <section className="py-32 px-6 relative z-10 border-t border-white/5 bg-[#080808]/50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
                    <FeatureCard
                        icon={<Zap className="text-yellow-400" size={28} />}
                        title="GPT-4 Turbo Infused"
                        desc="Experience lightning-fast reasoning and text generation with the world's most capable AI engines."
                    />
                    <FeatureCard
                        icon={<Shield className="text-blue-400" size={28} />}
                        title="Zero Data Retention"
                        desc="Your privacy is non-negotiable. We never train on your data and encrypt every session."
                    />
                    <FeatureCard
                        icon={<Cpu className="text-purple-400" size={28} />}
                        title="Advanced Analysis"
                        desc="Deep PDF parsing for resume metrics and large-scale document summarization."
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-white/5 text-center relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all cursor-crosshair">
                        <Sparkles className="text-primary w-5 h-5" />
                        <span className="text-xl font-bold">Promptify</span>
                    </div>
                    <div className="flex gap-8 text-slate-600 text-sm font-bold uppercase tracking-widest">
                        <a href="#" className="hover:text-primary transition-colors">Twitter</a>
                        <a href="#" className="hover:text-primary transition-colors">GitHub</a>
                        <a href="#" className="hover:text-primary transition-colors">Discord</a>
                    </div>
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">© 2026 Promptify AI. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
