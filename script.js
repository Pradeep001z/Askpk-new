async function sendMessage() {
    const question = userInput.value.trim();
    if (!question) return;

    addMessage(question, "user");
    userInput.value = "";
    const loadingMsg = document.createElement("div");
    loadingMsg.classList.add("message", "bot", "loading");
    loadingMsg.innerHTML = "जवाफ तयार गर्दैछु... (AI सोच्दैछ)";
    chatBox.appendChild(loadingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const API_KEY = process.env.GROQ_API_KEY;  // Vercel env se secure
        if (!API_KEY) throw new Error("API key setup chahiye.");

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",  // Free fast model, Nepali support accha
                messages: [{role: "user", content: `Simple Nepali/English answer for Nepal student question: ${question}. Keep it educational and short.`}],
                temperature: 0.7,
                max_tokens: 400
            })
        });

        if (res.ok) {
            const data = await res.json();
            const answer = data.choices[0].message.content;
            loadingMsg.remove();
            addMessage(answer, "bot", true);
        } else {
            throw new Error(`API error: ${res.status}`);
        }
    } catch (e) {
        loadingMsg.remove();
        addMessage(`माफ गर्नुहोस्, जवाफ दिन समस्या भयो। फेरि प्रयास गर्नुहोस्। (Error: ${e.message})`, "bot");
    }
}
