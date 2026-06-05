chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

    if (changeInfo.status !== "complete" || !tab.url) {
        return;
    }

    try {

        const url = tab.url;
        const lowerUrl = url.toLowerCase();

        // Extract features
        const features = {
            url_length: url.length,
            num_dots: (url.match(/\./g) || []).length,
            num_hyphens: (url.match(/-/g) || []).length,
            https: url.startsWith("https") ? 1 : 0
        };

        // Suspicious keywords
        const suspiciousWords = [
            "verify",
            "secure",
            "bank",
            "account",
            "free",
            "money",
            "paypal",
            "update",
            "password",
            "signin",
            "wallet",
            "crypto",
            "gift",
            "reward"
        ];

        let suspiciousKeyword = false;

        for (const word of suspiciousWords) {
            if (lowerUrl.includes(word)) {
                suspiciousKeyword = true;
                break;
            }
        }

        // Domain analysis
        const hostname = new URL(url).hostname;

        const trustedDomains = [
            "google",
            "youtube",
            "github",
            "microsoft",
            "amazon",
            "facebook",
            "instagram",
            "linkedin",
            "stackoverflow"
            "leetcode"
        ];

        let trusted = false;

        for (const domain of trustedDomains) {
            if (hostname.includes(domain)) {
                trusted = true;
                break;
            }
        }

        const randomDomain =
            hostname.length > 25 &&
            !trusted;

        // Call Flask API
        const response = await fetch(
            "http://127.0.0.1:5000/predict",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(features)
            }
        );

        const data = await response.json();

        const isPhishing =
            data.prediction === 1 ||
            suspiciousKeyword ||
            randomDomain;

        if (isPhishing) {

            chrome.action.setBadgeText({
                text: "!"
            });

            chrome.action.setBadgeBackgroundColor({
                color: "#ff0000"
            });

            chrome.tabs.sendMessage(
                tabId,
                {
                    type: "PHISHING_WARNING"
                },
                () => {
                    if (chrome.runtime.lastError) {
                        console.log(
                            "Content script:",
                            chrome.runtime.lastError.message
                        );
                    }
                }
            );

            console.log("⚠ Dangerous Website Detected");

        } else {

            chrome.action.setBadgeText({
                text: "✓"
            });

            chrome.action.setBadgeBackgroundColor({
                color: "#00aa00"
            });

            console.log("✅ Safe Website");
        }

    } catch (error) {

        console.error("Detection Error:", error);

        chrome.action.setBadgeText({
            text: "?"
        });

        chrome.action.setBadgeBackgroundColor({
            color: "#808080"
        });
    }
});