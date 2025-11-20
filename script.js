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
        // Latest Puter.js working method (Nov 2025)
        const result = await puter.ai.ask(`Simple Nepali or English answer for Nepal student (Class 1-12, SEE, +2, Loksewa): ${question}. Keep it short and educational.`);

        loadingMsg.remove();
        addMessage(result.replace(/\n/g, "<br>"), "bot", true);

    } catch (e) {
        console.error(e);
        loadingMsg.remove();
        addMessage("माफ गर्नुहोस्, अहिले जवाफ दिन सकिनँ। फेरि प्रयास गर्नुहोस्।", "bot");
    }
}
