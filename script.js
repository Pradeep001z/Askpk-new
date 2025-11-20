async function sendMessage() {
    const question = userInput.value.trim();
    if (!question) return;

    addMessage(question, "user");
    userInput.value = "";
    const loadingMsg = document.createElement("div");
    loadingMsg.classList.add("message", "bot", "loading");
    loadingMsg.innerHTML = "जवाफ तयार गर्दैछु... (Free AI सोच्दैछ)";
    chatBox.appendChild(loadingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Puter.js SDK - Correct syntax: prompt string + options object
        const prompt = `Simple Nepali or English answer for Nepal student question (Class 1-12, SEE, +2, Loksewa): ${question}. Keep it short, educational, and accurate.`;
        const response = await puter.ai.chat(prompt, {
            model: 'gpt-4o-mini',  // Free high-quality model
            temperature: 0.7,
            max_tokens: 400,
            stream: false  // Non-stream for simple response
        });

        console.log("Puter response:", response);  // Debug: Browser console mein dekho

        // Response is simple text, so direct use kar
        const answer = response || "No response received.";  // Fallback if empty
        loadingMsg.remove();
        addMessage(answer.replace(/\n/g, "<br>"), "bot", true);
    } catch (e) {
        console.error("Full error:", e);  // Debug
        loadingMsg.remove();
        addMessage(`माफ गर्नुहोस्, समस्या भयो। फेरि प्रयास गर्नुहोस्। (Error: ${e.message})`, "bot");
    }
}

// Rest of your code (addMessage function, etc.) same rakh
