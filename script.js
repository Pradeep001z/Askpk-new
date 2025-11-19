const chatBox = document.getElementById("chat");
const userInput = document.getElementById("userInput");

function addMessage(text, type, isHtml = false) {
    const div = document.createElement("div");
    div.classList.add("message", type);
    div.innerHTML = isHtml ? text : text.replace(/\n/g, "<br>");
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    if (type === "bot" && !isHtml) div.innerHTML = text.replace(/\n/g, "<br>"); // Ensure line breaks
}

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
        // Use free Gemini API (Get your own key from ai.google.dev for production - free tier 15 RPM)
        const API_KEY = ""; // Placeholder - replace with real free key
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Answer this student question in Nepali or English, keep it simple and educational: ${question}` }] }]
            })
        });

        if (res.ok) {
            const data = await res.json();
            const answer = data.candidates[0].content.parts[0].text;
            loadingMsg.remove();
            addMessage(answer, "bot", true);
        } else {
            throw new Error("API error");
        }
    } catch (e) {
        loadingMsg.remove();
        addMessage("माफ गर्नुहोस्, अहिले जवाफ दिन सकिनँ। इन्टरनेट जाँच गर्नुहोस् वा फेरि प्रयास गर्नुहोस्। (Error: " + e.message + ")", "bot");
    }
}

// Enter key support
userInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

// Initial welcome (already in HTML)
