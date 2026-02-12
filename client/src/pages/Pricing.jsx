import React, { useState } from 'react';
import { Check, Sparkles, X, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-hot-toast';

// Initialize Stripe with the Publishable Key from env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51Szt7IFlRzHBnQvF4drusVpYdpq5lIDKNNKZiB9vmdY2eXgzDphSD1MJJqdRSdcsRyUHvC4KXj81VgbHHyaFySEg00XNDYX8Nd");

const Pricing = ({ user }) => {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const { data } = await api.post('/stripe/create-checkout-session');
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
            if (error) toast.error(error.message);
        } catch (error) {
            console.error("Upgrade error:", error);
            toast.error("Failed to start upgrade process.");
        } finally {
            setLoading(false);
        }
    };

    const isPro = user?.plan === 'PRO';

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                    Upgrade to <span className="gradient-text">Pro</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Unlock the full potential of AI with unlimited access, faster processing, and exclusive features.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 rounded-3xl border border-white/5 relative"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/10" />
                    <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
                    <div className="text-4xl font-black mb-6">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-slate-300">
                            <div className="p-1 bg-white/10 rounded-full"><Check size={14} /></div>
                            5 AI prompts per day
                        </li>
                        <li className="flex items-center gap-3 text-slate-300">
                            <div className="p-1 bg-white/10 rounded-full"><Check size={14} /></div>
                            Basic AI model access
                        </li>
                        <li className="flex items-center gap-3 text-slate-300">
                            <div className="p-1 bg-white/10 rounded-full"><Check size={14} /></div>
                            Limited token usage
                        </li>
                        <li className="flex items-center gap-3 text-slate-500">
                            <div className="p-1 bg-white/5 rounded-full"><X size={14} /></div>
                            No priority processing
                        </li>
                    </ul>

                    <button disabled className="w-full py-4 rounded-xl bg-white/5 text-slate-400 font-bold cursor-not-allowed">
                        {isPro ? "Downgrade" : "Current Plan"}
                    </button>
                </motion.div>

                {/* Pro Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-8 rounded-3xl border border-primary/50 relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-500" />

                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-bold">Pro Plan</h3>
                        <span className="bg-primary/20 text-primary text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                    </div>
                    <div className="text-4xl font-black mb-6">$19<span className="text-lg text-slate-500 font-normal">/mo</span></div>

                    <ul className="space-y-4 mb-8 relative z-10">
                        <li className="flex items-center gap-3 text-white font-medium">
                            <div className="p-1 bg-primary/20 text-primary rounded-full"><Sparkles size={14} /></div>
                            Unlimited AI prompts
                        </li>
                        <li className="flex items-center gap-3 text-white font-medium">
                            <div className="p-1 bg-primary/20 text-primary rounded-full"><Zap size={14} /></div>
                            Faster AI model (Llama 3 70B)
                        </li>
                        <li className="flex items-center gap-3 text-white font-medium">
                            <div className="p-1 bg-primary/20 text-primary rounded-full"><Check size={14} /></div>
                            Higher token limit
                        </li>
                        <li className="flex items-center gap-3 text-white font-medium">
                            <div className="p-1 bg-primary/20 text-primary rounded-full"><Check size={14} /></div>
                            Priority processing
                        </li>
                    </ul>

                    {isPro ? (
                        <button disabled className="w-full py-4 rounded-xl bg-green-500/20 text-green-400 border border-green-500/50 font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                            <Check size={20} /> Active Plan
                        </button>
                    ) : (
                        <button
                            onClick={handleUpgrade}
                            disabled={loading}
                            className="w-full py-4 rounded-xl btn-primary font-bold uppercase tracking-wider shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                        >
                            {loading ? "Processing..." : "Upgrade Now"}
                        </button>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Pricing;
