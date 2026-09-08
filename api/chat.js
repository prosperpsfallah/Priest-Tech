
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