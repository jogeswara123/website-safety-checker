chrome.runtime.onMessage.addListener((message) => {

    if (message.type !== "PHISHING_WARNING")
        return;

    if (document.getElementById("phishing-banner"))
        return;

    const banner = document.createElement("div");

    banner.id = "phishing-banner";

    banner.innerHTML =
        "⚠ WARNING: This website may be a phishing website. Proceed with caution.";

    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.width = "100%";
    banner.style.padding = "15px";
    banner.style.backgroundColor = "#dc2626";
    banner.style.color = "white";
    banner.style.fontSize = "18px";
    banner.style.fontWeight = "bold";
    banner.style.textAlign = "center";
    banner.style.zIndex = "999999";

    document.body.appendChild(banner);
});