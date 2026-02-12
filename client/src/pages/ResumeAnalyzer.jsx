import React, { useState } from 'react';
import { Upload, FileText, Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const ResumeAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type === 'application/pdf') {
            setFile(selected);
        } else {
            toast.error('Please upload a PDF file');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsLoading(true);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const { data } = await api.post('/ai/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(data.analysis);
            toast.success('Analysis complete!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to analyze resume');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="flex items-center gap-6 mb-16">
                <div className="w-16 h-16 bg-green-500/20 rounded-[20px] flex items-center justify-center text-green-400 border border-green-500/20 glow-secondary">
                    <FileText size={32} />
                </div>
                <div>
                    <h2 className="text-4xl font-black tracking-tight mb-2">Resume Score Analyzer</h2>
                    <p className="text-slate-500 font-semibold tracking-wide flex items-center gap-2 uppercase text-xs">
                        <Sparkles size={14} className="text-primary" /> Powered by Deep Semantic Evaluation
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Upload Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-10 rounded-[40px] border border-white/5 flex flex-col items-center justify-center text-center space-y-8 min-h-[400px]"
                >
                    <div className="relative group cursor-pointer w-full">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="application/pdf"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="border-2 border-dashed border-white/10 rounded-[30px] p-10 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-500">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Upload className="text-slate-400 group-hover:text-primary transition-colors" size={32} />
                            </div>
                            <h3 className="text-xl font-black mb-2">{file ? file.name : 'Choose File'}</h3>
                            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Drag & drop your PDF CV</p>
                        </div>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || isLoading}
                        className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50 h-16 text-lg font-black uppercase tracking-widest"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Start Analysis'}
                    </button>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
                        Securely analyzed via private API. No files are stored permanently.
                    </p>
                </motion.div>

                {/* Info Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <InfoCard
                        icon={<CheckCircle className="text-blue-400" />}
                        title="What we check"
                        points={['Industry-standard skills matching', 'Keywords optimization for ATS', 'Quantifiable achievements', 'Formatting & readability']}
                    />
                    <InfoCard
                        icon={<AlertCircle className="text-orange-400" />}
                        title="Pro Tips"
                        points={['Include relevant certifications', 'Use bullet points for clarity', 'Match keywords to job description']}
                    />
                </motion.div>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-16 glass p-12 rounded-[40px] border border-primary/20 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                        <h3 className="text-3xl font-black mb-8 flex items-center gap-4">
                            Analysis Results <div className="h-[1px] flex-1 bg-white/5" />
                        </h3>
                        <div className="prose prose-invert max-w-none">
                            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed font-medium text-lg">
                                {result}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const InfoCard = ({ icon, title, points }) => (
    <div className="glass p-8 rounded-[30px] border border-white/5 hover:border-white/10 transition-all">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">{icon}</div>
            <h4 className="text-xl font-black tracking-tight">{title}</h4>
        </div>
        <ul className="space-y-3">
            {points.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-500 font-semibold text-sm">
                    <div className="w-1 h-1 bg-primary rounded-full mt-2" /> {p}
                </li>
            ))}
        </ul>
    </div>
);

export default ResumeAnalyzer;
