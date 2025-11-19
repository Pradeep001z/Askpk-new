async function sendMessage() {
    const question = userInput.value.trim();
    if (!question) return;

    addMessage(question, "user");
    userInput.value = "";
    const loadingMsg = document.createElement("div");
    loadingMsg.classList.add("message", "bot", "loading");
    loadingMsg.innerHTML = "जवाफ तयार गर्दैछु...";
    chatBox.appendChild(loadingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // First: Try Gemini (faster, better for Nepali)
        let answer = await callGemini(question);
        if (!answer) {
            // Fallback: Hugging Face (unlimited low-priority)
            answer = await callHuggingFace(question);
        }
        loadingMsg.remove();
        addMessage(answer, "bot", true);
    } catch (e) {
        loadingMsg.remove();
        addMessage("माफ गर्नुहोस्, अहिले जवाफ दिन सकिनँ। फेरि प्रयास गर्नुहोस्।", "bot");
    }
}

// Gemini Function
async function callGemini(question) {
    const API_KEY = process.env.GEMINI_API_KEY;  // Vercel env se secure
    if (!API_KEY) return null;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: `Simple Nepali/English answer for student: ${question}` }] }]
        })
    });
    if (res.ok) {
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    }
    return null;  // Fail to fallback
}

// Hugging Face Function (Free Token Chahiye: huggingface.co/settings/tokens se le)
async function callHuggingFace(question) {
    const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;  // Vercel env mein daal
    if (!HF_TOKEN) return "Hugging Face setup chahiye.";
    const res = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {  // Ya koi chat model jaise mistral
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: question, parameters: { max_length: 200 } })
    });
    if (res.ok) {
        const data = await res.json();
        return data[0]?.generated_text || "No response.";
    }
    return null;
}
