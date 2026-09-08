const OpenAI = require("openai");

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed. Use POST."
        });
    }

    try {
        // Check API key
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.error("OPENAI_API_KEY is missing.");

            return res.status(500).json({
                success: false,
                error: "OPENAI_API_KEY is not configured."
            });
        }

        // Get message from frontend
        const message = req.body?.message;

        if (!message || typeof message !== "string") {
            return res.status(400).json({
                success: false,
                error: "Message is required."
            });
        }

        // Create OpenAI client
        const openai = new OpenAI({
            apiKey: apiKey
        });

        // Send request to OpenAI
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",

            messages: [
                {
                    role: "system",
                    content:
                        "You are PRIEST AI, a helpful, intelligent and friendly AI assistant."
                },
                {
                    role: "user",
                    content: message
                }
            ],

            temperature: 0.7,
            max_tokens: 1000
        });

        // Get AI response
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