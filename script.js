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
        const API_KEY = process.env.GROQ_API_KEY;  // Vercel env se
        if (!API_KEY) {
            throw new Error("GROQ_API_KEY env variable missing!");
        }

        console.log("Sending request to Groq...");  // Debug log

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",  // Stable free model, better Nepali support
                messages: [{role: "user", content: `Simple Nepali/English answer for Nepal student question: ${question}. Keep it educational and short.`}],
                temperature: 0.7,
                max_tokens: 400
            })
        });

        console.log("Response status:", res.status);  // Debug: 200 hona chahiye
        const text = await res.text();  // Raw text for debug
        console.log("Raw response:", text);  // Yeh dekh console mein

        if (!res.ok) {
            throw new Error(`API error: ${res.status} - ${text}`);
        }

        const data = JSON.parse(text);
        if (!data.choices || data.choices.length === 0) {
            throw new Error("No choices in response - check model or prompt");
        }

        const answer = data.choices[0].message.content;
        if (!answer || answer.trim() === "") {
            throw new Error("Empty answer generated");
        }

        loadingMsg.remove();
        addMessage(answer, "bot", true);
    } catch (e) {
        console.error("Full error:", e);  // Console mein full details
        loadingMsg.remove();
        addMessage(`माफ गर्नुहोस्, जवाफ दिन समस्या भयो। फेरि प्रयास गर्नुहोस्। (Error: ${e.message})`, "bot");
    }
}
