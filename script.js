/* =========================================================
   PRIEST TECH — PRIEST AI FRONTEND
   Connects the website to /api/chat
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("aiInput");
    const button = document.getElementById("sendAI");
    const chat = document.getElementById("aiChat");
    const status = document.getElementById("aiStatus");

    /* -----------------------------------------------------
       Check that the AI elements exist
    ----------------------------------------------------- */

    if (!input || !button || !chat) {
        console.error("PRIEST AI: Required elements were not found.");
        return;
    }


    /* -----------------------------------------------------
       Add a message to the chat
    ----------------------------------------------------- */

    function addMessage(text, type = "ai") {

        const message = document.createElement("div");

        message.classList.add("ai-message");

        if (type === "user") {
            message.classList.add("user-message");
        }

        message.textContent = text;

        chat.appendChild(message);

        chat.scrollTop = chat.scrollHeight;

        return message;
    }


    /* -----------------------------------------------------
       Show status message
    ----------------------------------------------------- */

    function showStatus(message, isError = false) {

        if (!status) return;

        status.style.display = "block";

        status.textContent = message;

        if (isError) {
            status.style.color = "#ff6b6b";
        } else {
            status.style.color = "#ffd000";
        }
    }


    /* -----------------------------------------------------
       Hide status
    ----------------------------------------------------- */

    function hideStatus() {

        if (!status) return;

        status.style.display = "none";
        status.textContent = "";
    }


    /* -----------------------------------------------------
       Create typing indicator
    ----------------------------------------------------- */

    function createTypingIndicator() {

        const typing = document.createElement("div");

        typing.className = "ai-message";
        typing.id = "aiTyping";

        typing.textContent = "PRIEST AI is thinking...";

        chat.appendChild(typing);

        chat.scrollTop = chat.scrollHeight;

        return typing;
    }


    /* -----------------------------------------------------
       Remove typing indicator
    ----------------------------------------------------- */

    function removeTypingIndicator() {

        const typing = document.getElementById("aiTyping");

        if (typing) {
            typing.remove();
        }
    }


    /* -----------------------------------------------------
       Send message to backend
    ----------------------------------------------------- */

    async function sendMessage() {

        const message = input.value.trim();

        /* Don't send empty messages */

        if (!message) {

            showStatus("Please type a message first.");

            input.focus();

            return;
        }


        /* Limit extremely large messages */

        if (message.length > 4000) {

            showStatus(
                "Your message is too long. Please keep it under 4,000 characters.",
                true
            );

            return;
        }


        /* Hide old status */

        hideStatus();


        /* Add user's message */

        addMessage(message, "user");


        /* Clear input */

        input.value = "";


        /* Disable button */

        button.disabled = true;

        button.textContent = "⏳ PRIEST AI is thinking...";


        /* Create typing indicator */

        createTypingIndicator();


        try {

            /* -------------------------------------------------
               Send request to Vercel serverless function
            ------------------------------------------------- */

            const response = await fetch("/api/chat", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })

            });


            /* -------------------------------------------------
               Try to read backend response
            ------------------------------------------------- */

            let data;

            try {

                data = await response.json();

            } catch (jsonError) {

                throw new Error(
                    "The server returned an invalid response."
                );

            }


            /* Remove typing indicator */

            removeTypingIndicator();


            /* -------------------------------------------------
               Handle backend errors
            ------------------------------------------------- */

            if (!response.ok) {

                const backendError =
                    data?.error ||
                    "The AI service returned an error.";

                throw new Error(backendError);

            }


            /* -------------------------------------------------
               Get AI response
            ------------------------------------------------- */

            const reply =
                typeof data?.reply === "string"
                    ? data.reply.trim()
                    : "";


            /* -------------------------------------------------
               Make sure we received a response
            ------------------------------------------------- */

            if (!reply) {

                throw new Error(
                    "PRIEST AI returned an empty response."
                );

            }


            /* -------------------------------------------------
               Display AI response
            ------------------------------------------------- */

            addMessage(reply, "ai");


        } catch (error) {

            console.error(
                "PRIEST AI request failed:",
                error
            );


            /* Remove typing indicator */

            removeTypingIndicator();


            /* -------------------------------------------------
               Display friendly error
            ------------------------------------------------- */

            let errorMessage =
                "Sorry, PRIEST AI is temporarily unavailable. Please try again.";


            /*
             * Give a more useful message for common errors.
             */

            if (
                error.message &&
                error.message.includes("Failed to fetch")
            ) {

                errorMessage =
                    "I couldn't connect to the PRIEST TECH server. Please check your internet connection and try again.";

            } else if (
                error.message &&
                error.message.includes("GROQ_API_KEY")
            ) {

                errorMessage =
                    "The AI backend is not configured yet. Please add the GROQ_API_KEY in Vercel.";

            } else if (
                error.message &&
                error.message.includes("429")
            ) {

                errorMessage =
                    "PRIEST AI is receiving too many requests right now. Please wait a moment and try again.";

            }


            addMessage(errorMessage, "ai");


            showStatus(
                "AI request failed.",
                true
            );

        } finally {

            /* -------------------------------------------------
               Re-enable button
            ------------------------------------------------- */

            button.disabled = false;

            button.textContent = "⚡ Ask PRIEST AI";

            input.focus();

        }

    }


    /* ---------------------------------------------------------
       Button click
    --------------------------------------------------------- */

    button.addEventListener("click", () => {

        sendMessage();

    });


    /* ---------------------------------------------------------
       Enter key
       
       Enter = send
       Shift + Enter = new line
    --------------------------------------------------------- */

    input.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    });


    /* ---------------------------------------------------------
       Clear status when user starts typing
    --------------------------------------------------------- */

    input.addEventListener("input", () => {

        hideStatus();

    });


    /* ---------------------------------------------------------
       Initial console message
    --------------------------------------------------------- */

    console.log(
        "PRIEST AI frontend loaded successfully."
    );

});