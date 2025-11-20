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
        const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;  // Vercel env se secure
        if (!HF_TOKEN) throw new Error("Token setup chahiye.");

        console.log("Sending to Hugging Face...");  // Debug

        const res = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-large", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                inputs: `Student question: ${question}. Answer in simple Nepali or English, educational style.`, 
                parameters: { max_length: 300, temperature: 0.7 } 
            })
        });

        console.log("Response status:", res.status);  // Debug

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Error: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        const answer = data[0]?.generated_text || "No response.";
        loadingMsg.remove();
        addMessage(answer.replace(/\n/g, "<br>"), "bot", true);
    } catch (e) {
        console.error("Error:", e);
        loadingMsg.remove();
        addMessage(`माफ गर्नुहोस्, समस्या भयो। फेरि प्रयास गर्नुहोस्। (Error: ${e.message})`, "bot");
    }
}

// Rest of code same (addMessage, etc.)
