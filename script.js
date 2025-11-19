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
        console.log("Sending request to Puter.js...");  // Debug for mobile test

        const res = await fetch('https://api.puter.com/v2/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-4o-mini',  // Free high-quality model, Nepali support
                messages: [{role: 'user', content: `Simple Nepali or English answer for Nepal student question (Class 1-12, SEE, +2, Loksewa): ${question}. Keep it short, educational, and accurate.`}],
                temperature: 0.7,
                max_tokens: 400
            })
        });

        console.log("Response status:", res.status);  // Debug

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Error: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        if (!data.choices || data.choices.length === 0) {
            throw new Error("No response from AI");
        }

        const answer = data.choices[0].message.content;
        loadingMsg.remove();
        addMessage(answer.replace(/\n/g, "<br>"), "bot", true);
    } catch (e) {
        console.error("Full error:", e);  // Mobile debug
        loadingMsg.remove();
        addMessage(`माफ गर्नुहोस्, समस्या भयो। फेरि प्रयास गर्नुहोस्। (Error: ${e.message})`, "bot");
    }
}

// Rest of your code (addMessage, etc.) remains same
