async function sendMessage() {
    const question = userInput.value.trim();
    if (!question) return;

    addMessage(question, "user");
    userInput.value = "";
    const loadingMsg = document.createElement("div");
    loadingMsg.classList.add("message", "bot", "loading");
    loadingMsg.innerHTML = "जवाफ तयार गर्दैछु... (Gemini AI सोच्दैछ)";
    chatBox.appendChild(loadingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const API_KEY = "AIzaSyBtD9Sv3q2Z6vP1f4YxRtAEcr7rWPHi9hY"
        if (!API_KEY) {
            throw new Error("GEMINI_API_KEY env variable missing!");
        }

        console.log("Sending request to Gemini...");  // Debug

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Simple Nepali or English answer for Nepal student question (Class 1-12, SEE, +2, Loksewa): ${question}. Keep it short, educational, and accurate.` }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
            })
        });

        console.log("Response status:", res.status);  // Debug: 200 hona chahiye
        const text = await res.text();
        console.log("Raw response:", text);  // Console mein check kar

        if (!res.ok) {
            throw new Error(`API error: ${res.status} - ${text}`);
        }

        const data = JSON.parse(text);
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("No candidates in response");
        }

        const answer = data.candidates[0].content.parts[0].text;
        if (!answer || answer.trim() === "") {
            throw new Error("Empty answer");
        }

        loadingMsg.remove();
        addMessage(answer, "bot", true);
    } catch (e) {
        console.error("Full error:", e);  // Console details
        loadingMsg.remove();
        addMessage(`माफ गर्नुहोस्, जवाफ दिन समस्या भयो। फेरि प्रयास गर्नुहोस्। (Error: ${e.message})`, "bot");
    }
}
