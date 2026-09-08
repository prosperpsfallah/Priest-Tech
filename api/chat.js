const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed. Use POST."
        });
    }

    try {
        const { message } = req.body || {};

        if (!message || typeof message !== "string") {
            return res.status(400).json({
                success: false,
                error: "Message is required."
            });
        }

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "You are PRIEST AI, the AI assistant of PRIEST TECH. Be helpful, professional, friendly, and knowledgeable about technology, programming, system administration, networking, websites, IT support, and general questions."
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
            completion.choices?.[0]?.message?.content;

        if (!reply) {
            return res.status(500).json({
                success: false,
                error: "PRIEST AI returned an empty response."
            });
        }

        return res.status(200).json({
            success: true,
            reply: reply
        });

    } catch (error) {
        console.error("PRIEST AI ERROR:", error);

        return res.status(500).json({
            success: false,
            error:
                error?.message ||
                "PRIEST AI service temporarily unavailable."
        });
    }
};