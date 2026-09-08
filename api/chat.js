const Groq = require("groq-sdk");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }

    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                error: "GROQ_API_KEY is missing"
            });
        }

        const { message } = req.body || {};

        if (!message || typeof message !== "string") {
            return res.status(400).json({
                success: false,
                error: "Please enter a message"
            });
        }

        const groq = new Groq({
            apiKey
        });

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "You are PRIEST AI, the intelligent AI assistant for PRIEST TECH. Be helpful, friendly, clear and professional."
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
            response.choices?.[0]?.message?.content ||
            "Sorry, I couldn't generate a response.";

        return res.status(200).json({
            success: true,
            reply
        });

    } catch (error) {
        console.error("PRIEST AI ERROR:", error);

        return res.status(500).json({
            success: false,
            error: "AI service temporarily unavailable."
        });
    }
};