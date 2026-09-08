const Groq = require("groq-sdk");

module.exports = async function handler(req, res) {

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
                error: "GROQ_API_KEY is not configured."
            });

        }

        const { message } = req.body || {};

        if (!message || typeof message !== "string") {

            return res.status(400).json({
                success: false,
                error: "Please provide a message."
            });

        }

        const groq = new Groq({
            apiKey: apiKey
        });

        const completion = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages: [

                {
                    role: "system",
                    content:
                        "You are PRIEST AI, the helpful AI assistant for PRIEST TECH. " +
                        "Be friendly, professional, concise and helpful. " +
                        "Help users with technology, programming, websites, " +
                        "system administration and general questions."
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
