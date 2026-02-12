const pdfParse = require('pdf-parse');
const prisma = require('../utils/prisma');
const aiService = require('../services/groqService');

const deductTokens = async (userId, costOrType) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    if (user.plan === 'PRO') {
        // PRO users have unlimited access
        return;
    }

    // Determine cost if it's a number (legacy call) or type (new logic)
    // The calls in this file are passing numbers (5, 20, 10).
    const cost = typeof costOrType === 'number' ? costOrType : 5;

    // Free Plan Daily Limit Logic
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const requestsToday = await prisma.aIRequest.count({
        where: {
            userId: userId,
            createdAt: { gt: startOfDay }
        }
    });

    if (requestsToday >= 5) {
        throw new Error("Free limit reached (5 prompts/day). Upgrade to Pro for unlimited access.");
    }

    // Maintain token decrement for visual consistency if needed, though limit is primary
    if (user.tokens < cost) {
        // Optional: refill or throw if we still want tokens to mean something
        // For now, let's just decrement if enough, or allow if within daily limit
    }

    if (user.tokens >= cost) {
        await prisma.user.update({
            where: { id: userId },
            data: { tokens: { decrement: cost } }
        });
    }
};

const handleChat = async (req, res) => {
    const { messages } = req.body;
    const userId = req.user.id;

    try {
        await deductTokens(userId, 5);

        const stream = await aiService.generateChatResponse(messages);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        let fullResponse = '';
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullResponse += content;
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }

        await prisma.aIRequest.create({
            data: {
                userId,
                type: 'CHAT',
                prompt: JSON.stringify(messages),
                response: fullResponse,
                tokensUsed: 5
            }
        });

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(402).json({ message: error.message });
    }
};

const handleResumeAnalysis = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const userId = req.user.id;
    try {
        const fileBuffer = req.file.buffer;
        const data = await pdfParse(fileBuffer);
        const resumeText = data.text;

        await deductTokens(userId, 20);

        // Get AI analysis based on the extracted text
        const analysis = await aiService.analyzeResume(resumeText);

        await prisma.aIRequest.create({
            data: {
                userId,
                type: 'RESUME',
                prompt: 'Resume analysis',
                response: analysis,
                tokensUsed: 20
            }
        });

        // Ensure we return analysis as expected by the frontend (result.data.analysis)
        res.json({
            text: resumeText,
            analysis: analysis
        });
    } catch (error) {
        console.error("PDF parsing failed:", error);
        res.status(500).json({ message: error.message || "PDF parsing failed" });
    }
};

const handleCollegeQuery = async (req, res) => {
    const { query } = req.body;
    const userId = req.user.id;
    try {
        await deductTokens(userId, 10);
        const response = await aiService.collegeQuery(query);
        await prisma.aIRequest.create({
            data: { userId, type: 'COLLEGE', prompt: query, response, tokensUsed: 10 }
        });
        res.json({ response });
    } catch (error) {
        console.error("College Error:", error);
        res.status(402).json({ message: error.message });
    }
};

const handleEmailGeneration = async (req, res) => {
    const { prompt, tone } = req.body;
    const userId = req.user.id;
    try {
        await deductTokens(userId, 10);
        const response = await aiService.generateEmail(prompt, tone);
        await prisma.aIRequest.create({
            data: { userId, type: 'EMAIL', prompt, response, tokensUsed: 10 }
        });
        res.json({ response });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(402).json({ message: error.message });
    }
};

const handleSummarization = async (req, res) => {
    const { text } = req.body;
    const userId = req.user.id;
    try {
        await deductTokens(userId, 10);
        const response = await aiService.summarizeText(text);
        await prisma.aIRequest.create({
            data: { userId, type: 'SUMMARY', prompt: text.substring(0, 100), response, tokensUsed: 10 }
        });
        res.json({ response });
    } catch (error) {
        console.error("Summarize Error:", error);
        res.status(402).json({ message: error.message });
    }
};

const getHistory = async (req, res) => {
    const history = await prisma.aIRequest.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        take: 20
    });
    res.json(history);
};

module.exports = {
    handleChat,
    handleResumeAnalysis,
    handleCollegeQuery,
    handleEmailGeneration,
    handleSummarization,
    getHistory
};
