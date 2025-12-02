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
        const res = await fetch("https://46cb831f.askpk.pages.dev/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question })
        });

        const data = await res.json();
        loadingMsg.remove();
        addMessage(data.answer.replace(/\n/g, "<br>"), "bot", true);
    } catch (e) {
        loadingMsg.remove();
        addMessage("Server busy, 10 sec baad try kar!", "bot");
    }
}
