const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const DEFAULT_MODEL = "openai/gpt-oss-120b";
const MAX_COMPLETION_TOKENS = 8192;

const generateChatResponse = async (messages) => {
    try {
        return await groq.chat.completions.create({
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            model: DEFAULT_MODEL,
            temperature: 1,
            max_completion_tokens: MAX_COMPLETION_TOKENS,
            top_p: 1,
            reasoning_effort: "medium",
            stream: true,
            stop: null
        });
    } catch (error) {
        console.error("Groq Chat Error:", error);
        throw error;
    }
};

const analyzeResume = async (text) => {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a professional resume reviewer. Provide a score out of 100 and detailed feedback.' },
                { role: 'user', content: `Analyze this resume and provide feedback including a score:\n\n${text}` }
            ],
            model: DEFAULT_MODEL,
            temperature: 1,
            max_completion_tokens: MAX_COMPLETION_TOKENS,
            top_p: 1,
            reasoning_effort: "medium"
        });
        return response.choices[0]?.message?.content || "No analysis generated.";
    } catch (error) {
        console.error("Groq Resume Error:", error);
        throw error;
    }
};

const generateEmail = async (prompt, tone) => {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: `You are an expert email writer. Create an email with a ${tone} tone.` },
                { role: 'user', content: prompt }
            ],
            model: DEFAULT_MODEL,
            temperature: 1,
            max_completion_tokens: MAX_COMPLETION_TOKENS,
            top_p: 1,
            reasoning_effort: "medium"
        });
        return response.choices[0]?.message?.content || "No email generated.";
    } catch (error) {
        console.error("Groq Email Error:", error);
        throw error;
    }
};

const summarizeText = async (text) => {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'Summarize the following text into a short paragraph and key bullet points.' },
                { role: 'user', content: text }
            ],
            model: DEFAULT_MODEL,
            temperature: 1,
            max_completion_tokens: MAX_COMPLETION_TOKENS,
            top_p: 1,
            reasoning_effort: "medium"
        });
        return response.choices[0]?.message?.content || "No summary generated.";
    } catch (error) {
        console.error("Groq Summary Error:", error);
        throw error;
    }
};

const collegeQuery = async (query) => {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are an AI advisor for college admissions. Answer accurately and professionally.' },
                { role: 'user', content: query }
            ],
            model: DEFAULT_MODEL,
            temperature: 1,
            max_completion_tokens: MAX_COMPLETION_TOKENS,
            top_p: 1,
            reasoning_effort: "medium"
        });
        return response.choices[0]?.message?.content || "No response generated.";
    } catch (error) {
        console.error("Groq College Error:", error);
        throw error;
    }
};

module.exports = {
    generateChatResponse,
    analyzeResume,
    generateEmail,
    summarizeText,
    collegeQuery
};
