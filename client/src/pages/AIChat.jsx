import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Loader2, MessageSquare, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const AIChat = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your Promptify Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const currentInput = input;
        const newMessages = [...messages, { role: 'user', content: currentInput }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ messages: newMessages })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Server connection failed');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '').trim();
                        if (dataStr === '[DONE]') break;
                        try {
                            const parsed = JSON.parse(dataStr);
                            if (parsed.content) {
                                assistantMessage += parsed.content;
                                setMessages(prev => {
                                    const last = prev[prev.length - 1];
                                    return [...prev.slice(0, -1), { ...last, content: assistantMessage }];
                                });
                            }
                        } catch (e) {
                            // Ignore malformed chunks
                        }
                    }
                }
            }
        } catch (error) {
            toast.error(error.message || 'Failed to connect to AI');
            setMessages(prev => prev.slice(0, -1)); // Remove the empty assistant bubble
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([{ role: 'assistant', content: 'Chat history cleared. How can I help?' }]);
    };

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col pt-4">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <MessageSquare size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight">AI Assistant</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-green-500 uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            GPT-4 Turbo Online
                        </div>
                    </div>
                </div>
                <button
                    onClick={clearChat}
                    className="p-3 glass hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-xl transition-all border border-white/5"
                    title="Clear Chat"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar mb-8 scroll-smooth pb-10">
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center flex-shrink-0 border border-white/5 shadow-xl ${m.role === 'user' ? 'bg-primary border-primary/20' : 'bg-[#151515]'
                                }`}>
                                {m.role === 'user' ? <User size={24} className="text-white" /> : <Bot size={24} className="text-primary" />}
                            </div>
                            <div className={`max-w-[85%] px-7 py-6 rounded-[32px] shadow-2xl ${m.role === 'user'
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-[#101010] border border-white/5 text-slate-300 rounded-tl-none font-medium'
                                }`}>
                                <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{m.content || (isLoading && i === messages.length - 1 ? 'Typing...' : '')}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSend} className="relative group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your request..."
                    className="w-full bg-[#0d0d0d] border border-white/10 p-6 pr-20 rounded-[30px] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-2xl text-lg font-medium"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-primary/20"
                >
                    {isLoading ? <Loader2 className="animate-spin text-white" size={24} /> : <Send size={24} className="text-white" />}
                </button>
            </form>
        </div>
    );
};

export default AIChat;
