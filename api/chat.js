const Groq = require("groq-sdk");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed. Use POST."
        });
    }

    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                error: "GROQ_API_KEY is not configured in Vercel."
            });
        }

        const message = req.body?.message;

        if (!message || typeof message !== "string") {
            return res.status(400).json({
                success: false,
                error: "Message is required."
            });
        }

        const groq = new Groq({
            apiKey: apiKey
        });

        const completion = await groq.chat.completions.create({
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "You are PRIEST AI, a helpful, intelligent and friendly AI assistant created for PRIEST TECH."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        const reply =
            completion.choices?.[0]?.message?.content ||
            "I couldn't generate a response.";

        return res.status(200).json({
            success: true,
            reply: reply
        });

    } catch (error) {
        console.error("PRIEST AI backend error:", error);

        return res.status(500).json({
            success: false,
            error: "AI service temporarily unavailable."
        });
    }
};